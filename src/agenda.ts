import { askUser } from "./dom/ask-user"

/**
 * Defines the LocalStorage objects used to persist the user's agenda.
 */
interface StorageAPI {
  /**
   * A list of event IDs (the hashes)
   */
  itemIDs: string[]

  /**
   * Remembers whether the agenda has already shown the intro explaining how the
   * agenda works.
   */
  hasShownIntro: boolean
}

/**
 * The key in the local storage under which the agenda is saved.
 */
const AGENDA_ITEM_KEY = 'conferia-agenda'

/**
 * Shows a dialog box that explains to the user how the agenda works.
 */
function showIntroForUser () {
  const introText = `You have added your first element to your personal agenda.
Your personal agenda allows you to bookmark or star various events and view only
those elements, allowing you to quickly see where you need to go next. Your
bookmarks are persisted on your device into what is called "local storage." This
means that your bookmarked events will be remembered even when you close this
tab. However, the events are only stored on your device, meaning if you open
this agenda on a different device, it won't remember them. You can export and
import your agenda to transfer it between devices.`

  askUser('Your Personalized Agenda', introText, ['Ok'])
}

/**
 * Manages the user's personal agenda.
 */
export class Agenda {
  /**
   * The item IDs part of the user's personal agenda.
   */
  private itemIDs: string[]

  /**
   * Whether the controller has shown the intro to the user.
   */
  private hasShownIntro: boolean

  /**
   * Creates a new Agenda object. NOTE: Should only be 1 per Conferia instance.
   */
  constructor () {
    this.hasShownIntro = false
    this.itemIDs = []

    // Retrieve the persisted personal agenda if applicable.
    const agenda = window.localStorage.getItem(AGENDA_ITEM_KEY)

    if (agenda !== null && agenda.trim() !== '') {
      const parsed: StorageAPI = JSON.parse(agenda)
      this.itemIDs = parsed.itemIDs
      this.hasShownIntro = parsed.hasShownIntro
    }

    this.persistToStorage() // If the item wasn't set yet
  }

  /**
   * Adds an item to the agenda. This function also shows the intro to the user
   * if that hasn't happened yet.
   *
   * @param   {string}  id  The ID to add
   */
  public addItem (id: string) {
    if (!this.hasShownIntro) {
      showIntroForUser()
      this.hasShownIntro = true
      this.persistToStorage()
    }

    if (!this.itemIDs.includes(id)) {
      this.itemIDs.push(id)
      this.persistToStorage()
    }
  }

  /**
   * Removes an item from the personal agenda.
   *
   * @param   {string}  id  The ID to remove
   */
  public removeItem (id: string) {
    if (this.itemIDs.includes(id)) {
      this.itemIDs.splice(this.itemIDs.indexOf(id), 1)
      this.persistToStorage()
    }
  }

  /**
   * Clears the personal agenda entirely. This function also asks for
   * confirmation.
   */
  public clearPersonalAgenda () {
    askUser(
      'Clear Personal Agenda?',
      'This action will reset your entire personal agenda. This is an irreversable action. Proceed?',
      ['Yes, clear personal agenda', 'Cancel']
    ).then(response => {
      if (response === 0) {
        // Clear agenda
        this.itemIDs = []
        this.persistToStorage()
      }
    })
  }

  /**
   * Resets the "has shown intro" flag so that the next time the user adds an
   * item to their agenda, they will see the intro again.
   */
  public resetHasShown () {
    this.hasShownIntro = false
    this.persistToStorage()
  }

  /**
   * Returns true if the provided ID is part of the agenda.
   *
   * @param   {string}  id  The item ID to query
   *
   * @return  {boolean}      True if the item is on the agenda.
   */
  public hasItem (id: string): boolean {
    return this.itemIDs.includes(id)
  }

  /**
   * Returns all item IDs currently part of the user's agenda.
   *
   * @return  {string[]}  The item IDs
   */
  public getItems (): string[] {
    return this.itemIDs
  }

  // TODO: Implement import/export

  /**
   * Persists the current state of the agenda to storage.
   */
  private persistToStorage () {
    const toStore: StorageAPI = {
      itemIDs: this.itemIDs,
      hasShownIntro: this.hasShownIntro
    }
    window.localStorage.setItem(AGENDA_ITEM_KEY, JSON.stringify(toStore))
  }
}
