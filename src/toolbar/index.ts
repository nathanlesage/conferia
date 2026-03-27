import { dom } from '../dom/util'
import { askUser } from '../dom/ask-user'
import { makeToolbarWrapper, makeFilter, makeAgendaToggle, makeIcalButton, makeFullscreenToggle, makeClearButton, makeHelpButton, makeCompactToggle, makeSpacer } from './util'
import { ApplicationState, appState } from '../state'

export type ButtonClickEvents = 'ical'|'clear'

/**
 * Implements a toolbar component.
 */
export class Toolbar {
  /**
   * The toolbar wrapper element
   */
  private toolbar: HTMLDivElement

  /**
   * The query filter element
   */
  private filter: HTMLInputElement

  /**
   * The "Show only personal agenda" toggle
   */
  private personalAgendaToggle: HTMLButtonElement

  /**
   * The "Download ical" button
   */
  private toIcalButton: HTMLButtonElement

  /**
   * The "toggle fullscreen" button
   */
  private fullscreenToggle: HTMLButtonElement

  /**
   * The "Clear storage" button
   */
  private clearButton: HTMLButtonElement

  /**
   * The "Show help" button
   */
  private helpButton: HTMLButtonElement

  /**
   * Toggles between all days and single day
   */
  private compactModeToggle: HTMLButtonElement

  /**
   * Holds the toolbar state
   */
  private state: ApplicationState

  private readonly callbacks: Array<(which: ButtonClickEvents) => void>

  /**
   * Instantiates a new Toolbar component. Only 1 per Conferia instance.
   *
   * @param   {ToolbarCallbacks}  callbacks  Various toolbar callbacks.
   */
  constructor () {
    this.callbacks = []
    this.state = appState()
    // Generate the toolbar structure
    this.toolbar = makeToolbarWrapper()
    this.filter = makeFilter()
    this.personalAgendaToggle = makeAgendaToggle(this.state.get('onlyPersonalAgendaItems'))
    this.toIcalButton = makeIcalButton()
    this.fullscreenToggle = makeFullscreenToggle(this.state.get('fullscreen'))
    this.clearButton = makeClearButton()
    this.helpButton = makeHelpButton()
    this.compactModeToggle = makeCompactToggle(this.state.get('viewMode') === 'compact')

    // Append the elements in order. The layout is as follows:
    // [mode] [daySelector?] [filter] [agenda] [ical] [fullscreen] [spacer] [clear] [help]
    this.toolbar.append(
      // Mode controls
      this.compactModeToggle,
      // Filter
      this.filter,
      // Buttons
      this.personalAgendaToggle, this.toIcalButton, this.fullscreenToggle,
      makeSpacer(),
      // Less used buttons
      this.clearButton, this.helpButton
    )

    // Attach event listeners
    this.setupEventListeners()

    // Whenever the application state changes, update the toolbar.
    this.state.on('change', () => {
      this.updateToolbarState()
    })
  }

  /**
   * Returns the Toolbar DOM element
   *
   * @return  {HTMLDivElement}  The toolbar wrapper
   */
  public get dom (): HTMLDivElement {
    return this.toolbar
  }

  /**
   * Registers a callback to fire when the user clicks a button.
   *
   * @param   {Function}  callback  The callback
   */
  public onClick (callback: (which: ButtonClickEvents) => void) {
    this.callbacks.push(callback)
  }

  /**
   * Updates the toolbar buttons and toggles based on the application state.
   */
  private updateToolbarState () {
    this.filter.value = this.state.get('query')
    this.personalAgendaToggle = makeAgendaToggle(this.state.get('onlyPersonalAgendaItems'), this.personalAgendaToggle)
    this.fullscreenToggle = makeFullscreenToggle(this.state.get('fullscreen'), this.fullscreenToggle)
    this.compactModeToggle = makeCompactToggle(this.state.get('viewMode') === 'compact', this.compactModeToggle)
  }

  /**
   * Sets up event listeners for the buttons and other elements on the toolbar.
   */
  private setupEventListeners () {
    // Filtering
    this.filter.addEventListener('keyup', () => {
      this.state.set('query', this.filter.value)
    })

    this.clearButton.addEventListener('click', () => {
      for (const cb of this.callbacks) {
        cb('clear')
      }
    })

    this.toIcalButton.addEventListener('click', () => {
      for (const cb of this.callbacks) {
        cb('ical')
      }
    })

    // We can handle the help button directly here, which keeps the main class
    // a bit leaner.
    this.helpButton.addEventListener('click', () => {
      askUser(
        'About Conferia.js',
        `This conference utilizes the Free and Open Source framework Conferia.js to implement an interactive agenda. Conferia allows you to browse the program effortlessly, search for events, and even bookmark sessions and export them into your personal calendar. Conferia.js has a manual that explains its features and how to use them.`,
        [
          'Open documentation',
          'Close'
        ]
      ).then(response => {
        if (response === 0) {
          // User wants to open the documentation -> redirect them to the documentation.
          // NOTE: We have to do this little anchor element programmatic click dance
          // because Safari on iOS again does not allow opening a new tab using window.open.
          const a = dom('a', undefined, { href: 'https://nathanlesage.github.io/conferia/users-guide/', target: '_blank' })
          document.body.appendChild(a)
          a.addEventListener('mouseup', event => {
            document.body.removeChild(a)
          })
          a.click()
        }
      })
    })

    // Handle the toggles
    this.personalAgendaToggle.addEventListener('click', event => {
      this.state.set('onlyPersonalAgendaItems', !this.state.get('onlyPersonalAgendaItems'))
    })

    this.fullscreenToggle.addEventListener('click', event => {
      this.state.set('fullscreen', !this.state.get('fullscreen'))
    })

    this.compactModeToggle.addEventListener('click', event => {
      this.state.set('viewMode', this.state.get('viewMode') === 'compact' ? 'full' : 'compact')
    })
  }
}
