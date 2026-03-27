import { DateTime } from "luxon"
import { CSVRecord } from "./csv"

let stateSingleton: ApplicationState|undefined

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
      records: []
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
   * @param  {T}         which  The setting to change
   * @param  {State[T]}  value  The new value for the setting
   */
  public set<T extends keyof State>(which: T, value: State[T]) {
    this.state[which] = value

    for (const cb of this.callbacks) {
      cb(which, value)
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
