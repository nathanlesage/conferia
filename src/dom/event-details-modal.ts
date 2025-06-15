import { CSVRecord } from "../csv"
import { dom } from "./util"
import bookmarkIcon from '../icons/bookmark.svg'
import { Conferia } from "../conferia"

/**
 * Creates and shows a dialog showing details for the provided event.
 *
 * @param   {CSVRecord}  event  The event to detail
 */
export function showEventDetailsModal (event: CSVRecord, conferia: Conferia): void {
  const dialog = dom('dialog', 'conferia-dialog conferia-event-details')

  const title = dom('h3', 'cf-event-title')
  switch (event.type) {
    case 'keynote':
      title.textContent = 'Keynote: ' + event.title
      break
    case 'session':
      title.textContent = 'Session: ' + event.title
      break
    default:
      title.textContent = event.title
  }
  dialog.appendChild(title)

  if (event.location !== undefined) {
    const loc = dom('p', 'location')
    loc.textContent = event.location
    dialog.appendChild(loc)
  }

  const content = generateEventDOMStructure(event)
  dialog.appendChild(content)

  const idElem = dom('p', 'event-id')
  idElem.textContent = event.id
  dialog.appendChild(idElem)

  // Bookmarking Capabilities
  const bookmarkButton = dom('div', 'bookmark')
  if (conferia.agenda.hasItem(event.id)) {
    bookmarkButton.classList.add('bookmarked')
  }

  bookmarkButton.innerHTML = bookmarkIcon
  dialog.appendChild(bookmarkButton)
  bookmarkButton.addEventListener('click', () => {
    if (conferia.agenda.hasItem(event.id)) {
      conferia.agenda.removeItem(event.id)
      bookmarkButton.classList.remove('bookmarked')
    } else {
      conferia.agenda.addItem(event.id)
      bookmarkButton.classList.add('bookmarked')
    }
    conferia.updateUI()
  })
  // End Bookmarking

  // Dialog closing
  const closeButton = dom('button', 'close-button')
  closeButton.textContent = 'Close'
  closeButton.addEventListener('click', () => dialog.close())
  dialog.appendChild(closeButton)

  const closeDialog = (event: Event|MouseEvent) => {
    if (event instanceof MouseEvent) {
      const { top, right, bottom, left } = dialog.getBoundingClientRect()
      if (
        event.clientX >= left && event.clientX <= right &&
        event.clientY >= top && event.clientY <= bottom
      ) {
        return // Do not close dialog
      }
    }
    document.body.removeChild(dialog)
    document.removeEventListener('mouseup', closeDialog)
  }

  document.body.appendChild(dialog)
  dialog.addEventListener('close', closeDialog)
  document.addEventListener('mouseup', closeDialog)
  dialog.showModal()
}

/**
 * Generates a content DOM structure for use in dialogs for events
 *
 * @param   {CSVRecord}  event  The event to detail
 *
 * @return  {HTMLElement}            The content DOM
 */
function generateEventDOMStructure (event: CSVRecord): HTMLElement {
  const wrapper = generateDialogWrapper()

  const time = dom('p', 'time')
  wrapper.appendChild(time)
  const date = event.dateStart.toLocaleString({ dateStyle: 'medium' })
  const fromString = event.dateStart.toLocaleString({ timeStyle: 'short' })
  const toString = event.dateEnd.toLocaleString({ timeStyle: 'short' })
  time.textContent = `${date}, ${fromString} – ${toString}`

  if (event.chair !== undefined && event.chair !== '') {
    const chair = dom('p', 'chair')
    chair.textContent = 'Chair: ' + event.chair
    wrapper.appendChild(chair)
  }

  if (event.type === 'session') {
    for (const pres of event.presentations) {
      const details = dom('details', 'presentation')

      const summary = dom('summary')
      details.appendChild(summary)

      const title = dom('strong')
      title.textContent = pres.title
      summary.appendChild(title)

      const author = dom('p', 'author')
      author.textContent = pres.author
      summary.appendChild(author)

      const abstract = dom('p', 'abstract')
      abstract.textContent = pres.abstract
      details.appendChild(abstract)

      wrapper.appendChild(details)
      wrapper.appendChild(dom('hr'))
    }
  }

  if (event.type === 'keynote' || event.type === 'single' || event.type === 'special') {
    const author = dom('p', 'author')
    author.textContent = event.author
    wrapper.appendChild(author)

    const abstract = dom('p', 'abstract')
    abstract.textContent = event.abstract
    wrapper.appendChild(abstract)
  }

  return wrapper
}

/**
 * Generates a wrapper for a dialog.
 *
 * @return  {HTMLElement}  The content div
 */
function generateDialogWrapper () {
  return dom('div', 'dialog-content-wrapper')
}
