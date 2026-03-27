import { dom } from '../dom/util'
import { askUser } from '../dom/ask-user'
import { makeToolbarWrapper, makeFilter, makeAgendaToggle, makeIcalButton, makeFullscreenToggle, makeClearButton, makeHelpButton, makeCompactToggle } from './util'

interface ToolbarState {
  query: string
  personalAgenda: boolean
  fullscreen: boolean
  viewMode: 'full'|'compact'
}

export interface ToolbarCallbacks {
  // Fires when the filter input changes
  onFilter: (query: string) => void
  // Fires when any of the toggles changes
  onToggle: (which: 'personal-agenda'|'fullscreen'|'viewMode', state: boolean) => void
  // Fires when any of the buttons are clicked
  onClick: (which: 'ical'|'clear') => void
}

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
  private fullscreenButton: HTMLButtonElement

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
  private state: ToolbarState = {
    query: '',
    personalAgenda: false,
    fullscreen: false,
    viewMode: 'full'
  }

  /**
   * Instantiates a new Toolbar component. Only 1 per Conferia instance.
   *
   * @param   {ToolbarCallbacks}  callbacks  Various toolbar callbacks.
   */
  constructor (private callbacks: ToolbarCallbacks) {
    // Generate the toolbar structure
    this.toolbar = makeToolbarWrapper()
    this.filter = makeFilter()
    this.personalAgendaToggle = makeAgendaToggle(this.state.personalAgenda)
    this.toIcalButton = makeIcalButton()
    this.fullscreenButton = makeFullscreenToggle(this.state.fullscreen)
    this.clearButton = makeClearButton()
    this.helpButton = makeHelpButton()
    this.compactModeToggle = makeCompactToggle(this.state.viewMode === 'compact')

    // Append the elements in order
    this.toolbar.append(
      this.compactModeToggle,
      this.filter, this.personalAgendaToggle,
      this.toIcalButton, this.fullscreenButton, this.clearButton, this.helpButton
    )

    // Attach event listeners
    this.setupEventListeners()
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
   * Sets up event listeners for the buttons and other elements on the toolbar.
   */
  private setupEventListeners () {
    // Filtering
    this.filter.addEventListener('keyup', () => {
      this.state.query = this.filter.value
      this.callbacks.onFilter(this.state.query)
    })

    this.toIcalButton.addEventListener('click', () => {
      this.callbacks.onClick('ical')
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
      this.state.personalAgenda = !this.state.personalAgenda
      const agenda = this.state.personalAgenda
      this.personalAgendaToggle = makeAgendaToggle(agenda, this.personalAgendaToggle)
      this.callbacks.onToggle('personal-agenda', agenda)
    })

    this.fullscreenButton.addEventListener('click', event => {
      this.state.fullscreen = !this.state.fullscreen
      const fs = this.state.fullscreen
      this.fullscreenButton = makeFullscreenToggle(fs, this.fullscreenButton)
      this.callbacks.onToggle('fullscreen', this.state.fullscreen)
    })

    this.compactModeToggle.addEventListener('click', event => {
      this.state.viewMode = this.state.viewMode === 'compact' ? 'full' : 'compact'
      const compact = this.state.viewMode === 'compact'
      this.compactModeToggle = makeCompactToggle(compact, this.compactModeToggle)
      this.callbacks.onToggle('viewMode', compact)
    })
  }
}
