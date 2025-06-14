import { askUser } from "./dom/ask-user"

interface StorageAPI {
  itemIDs: string[]
  hasShownIntro: boolean
}

const AGENDA_ITEM_KEY = 'conferia-agenda'

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

export class Agenda {
  private itemIDs: string[]
  private hasShownIntro: boolean

  constructor () {
    this.hasShownIntro = false
    this.itemIDs = []

    const agenda = window.localStorage.getItem(AGENDA_ITEM_KEY)

    if (agenda !== null && agenda.trim() !== '') {
      const parsed: StorageAPI = JSON.parse(agenda)
      this.itemIDs = parsed.itemIDs
      this.hasShownIntro = parsed.hasShownIntro
    }

    this.persistToStorage() // If the item wasn't set yet
  }

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

  public removeItem (id: string) {
    if (this.itemIDs.includes(id)) {
      this.itemIDs.splice(this.itemIDs.indexOf(id), 1)
      this.persistToStorage()
    }
  }

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

  public resetHasShown () {
    this.hasShownIntro = false
    this.persistToStorage()
  }

  public hasItem (id: string) {
    return this.itemIDs.includes(id)
  }

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
