import { DateTime } from "luxon"
import { CSVRecord } from "./csv"
import { debug } from "./util/logger"
import { matchEvent } from "./util/fuzzy-match"
import { Agenda } from "./agenda"

let stateSingleton: ApplicationState|undefined

const CONFIG_KEY = 'conferia-config'

// Types the application state.
interface State {
  /**
   * The current query string to filter events
   */
  query: string
  /**
   * Should the app only show items on the personal agenda?
   */
  onlyPersonalAgendaItems: boolean
  /**
   * Should the application be in fullscreen mode?
   */
  fullscreen: boolean
  /**
   * Stores the view mode. Full = all days in horizontal layout, compact = only
   * one day.
   */
  viewMode: 'full'|'compact'
  /**
   * If the viewMode is set to compact, only show this day.
   */
  compactDay: DateTime
  /**
   * Holds all records in the schedule. From this, callers can filter out
   * certain events, e.g., to show search results or only individual days.
   */
  records: CSVRecord[]
  /**
   * Internal property that is preset to "true", but will be programmatically
   * set to "false" as soon as there is a user scroll. This can be used to
   * ensure that, upon load, the library will automatically scroll the current
   * time into view. In addition, this property can even be used to create a
   * fully automated schedule display that updates automagically throughout the
   * conference.
   */
  autoScroll: boolean
  /**
   * Holds the last time the schedule has been fetched online
   */
  lastUpdate: DateTime
}

// Do some type trickery to enforce callbacks that are properly typed to only
// expect existing state keys and values.
type CallbackFunc<T extends keyof State> = (which: T, value: State[T]) => void
type AppStateCallback = CallbackFunc<keyof State>

/**
 * The application state class. Do not instantiate this, this should be a
 * singleton to enforce a single application state. Only exported for the types.
 */
export class ApplicationState {
  private state: State

  private readonly callbacks: AppStateCallback[]

  /**
   * Creates a new application state with default settings. NOTE: Do not
   * instantiate this! Instead, call `appState`!
   */
  constructor () {
    this.callbacks = []
    this.state = {
      query: '',
      onlyPersonalAgendaItems: false,
      fullscreen: false,
      viewMode: 'full',
      compactDay: DateTime.now(),
      records: [],
      autoScroll: true,
      lastUpdate: DateTime.now()
    }
  }

  /**
   * Retrieves a setting from the state.
   *
   * @param   {T}         which  The setting to retrieve
   *
   * @return  {State[T]}         The setting's value
   */
  public get<T extends keyof State>(which: T): State[T] {
    return this.state[which]
  }

  /**
   * Sets the provided setting to the given value.
   *
   * @param  {T}         which    The setting to change
   * @param  {State[T]}  value    The new value for the setting
   * @param  {boolean}   persist  By default, overwrite the settings in the local storage.
   */
  public set<T extends keyof State>(which: T, value: State[T], persist: boolean = true) {
    this.state[which] = value

    // If the records are updated, update the last update time.
    if (which === 'records') {
      this.set('lastUpdate', DateTime.now())
    }

    for (const cb of this.callbacks) {
      cb(which, value)
    }

    if (persist) {
      this.saveToLocalStorage()
    }
  }

  /**
   * Listens to events from the application state.
   *
   * @param  {'change'}          event     Listen to 'change' events
   * @param  {AppStateCallback}  callback  A callback that receives the setting
   *                                       that was changed, and its new value.
   */
  public on (event: 'change', callback: AppStateCallback) {
    this.callbacks.push(callback)
  }

  /**
   * Restores the state from local storage
   */
  public loadFromLocalStorage () {
    debug('Loading from local storage...')
    const item = window.localStorage.getItem(CONFIG_KEY)

    if (item === null || item.trim() === '') {
      debug('Nothing to load from local storage.')
      return // Nothing to load
    }

    try {
      const loadedData = JSON.parse(item)
      for (const prop of Object.keys(this.state) as Array<keyof State>) {
        debug(`Loading property ${prop}`)
        console.log(prop, loadedData[prop])
        // First special handling for special keys, then just copy over.
        if (prop === 'compactDay') {
          this.set(prop, DateTime.fromISO(loadedData[prop]))
        } else if (prop in loadedData && typeof loadedData[prop] === typeof this.state[prop]) {
          this.set(prop, loadedData[prop])
        }
      }
    } catch (err) {
      debug(`Could not load from local storage: ${err}`)
      window.localStorage.removeItem(CONFIG_KEY)
    }
  }

  /**
   * Persists the config in local storage
   */
  public saveToLocalStorage () {
    debug('Saving to local storage...')
    // NOTE: BE CAREFUL ABOUT WHAT YOU SAVE! It must be able to be revived. Look
    // at the loader above to understand that.
    const partialState: Partial<State> = {
      query: this.state.query,
      onlyPersonalAgendaItems: this.state.onlyPersonalAgendaItems,
      fullscreen: this.state.fullscreen,
      viewMode: this.state.viewMode,
      compactDay: this.state.compactDay,
      // NOTE: records left out
      autoScroll: this.state.autoScroll
    }

    window.localStorage.setItem(CONFIG_KEY, JSON.stringify(partialState))
    debug('Saved to local storage.')
  }

  //////////////////////////////////////////////////////////////////////////////
  ////// UTILITY FUNCTIONS
  //////////////////////////////////////////////////////////////////////////////
  // These have been ported from the main class since they mostly depend on the
  // state and thus declutter the main class.

  /**
   * Filters all available records based on various conditions.
   *
   * @return  {CSVRecord[]}  The filtered set of events.
   */
  public filterRecords (agenda: Agenda): CSVRecord[] {
    const q = this.get('query').trim().toLowerCase()

    let records = [...this.get('records')]

    if (this.get('onlyPersonalAgendaItems')) {
      records = records.filter(r => agenda.hasItem(r.id))
    }

    if (this.get('viewMode') === 'compact') {
      // In compact mode, we should only show a single day.
      const focusDay = this.get('compactDay')
      const dayStart = focusDay.set({ hour: 0, minute: 0, second: 0 })
      const dayEnd = focusDay.set({ hour: 23, minute: 59, second: 59 })
      records = records.filter(r => r.dateStart >= dayStart && r.dateEnd <= dayEnd)
    }

    if (q === '') {
      return records
    }

    return records.filter(record => matchEvent(record, q))
  }
}

/**
 * Retrieves the application state singleton
 *
 * @return  {ApplicationState}  The singleton
 */
export function appState (): ApplicationState {
  if (stateSingleton === undefined) {
    stateSingleton = new ApplicationState()
  }

  return stateSingleton
}
