import { CSVRecord } from "../csv"

/**
 * Creates and shows a dialog showing details for the provided event.
 *
 * @param   {CSVRecord}  event  The event to detail
 */
export function showEventDetailsModal (event: CSVRecord): void {
  const dialog = document.createElement('dialog')
  dialog.classList.add('conferia-dialog', 'conferia-event-details')

  const title = document.createElement('h3')
  title.classList.add('cf-event-title')
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
    const loc = document.createElement('p')
    loc.classList.add('location')
    loc.textContent = event.location
    dialog.appendChild(loc)
  }

  const content = generateEventDOMStructure(event)
  dialog.appendChild(content)

  const idElem = document.createElement('p')
  idElem.classList.add('event-id')
  idElem.textContent = event.id
  dialog.appendChild(idElem)

  const closeButton = document.createElement('button')
  closeButton.classList.add('close-button')
  closeButton.textContent = 'Close'
  closeButton.addEventListener('click', () => dialog.close())
  dialog.appendChild(closeButton)

  document.body.appendChild(dialog)
  dialog.addEventListener('close', () => {
    document.body.removeChild(dialog)
  })
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

  const time = document.createElement('p')
  time.classList.add('time')
  wrapper.appendChild(time)
  const date = event.dateStart.toLocaleString({ dateStyle: 'medium' })
  const fromString = event.dateStart.toLocaleString({ timeStyle: 'short' })
  const toString = event.dateEnd.toLocaleString({ timeStyle: 'short' })
  time.textContent = `${date}, ${fromString} – ${toString}`

  if (event.chair !== undefined && event.chair !== '') {
    const chair = document.createElement('p')
    chair.classList.add('chair')
    chair.textContent = 'Chair: ' + event.chair
    wrapper.appendChild(chair)
  }

  if (event.type === 'session') {
    for (const pres of event.presentations) {
      const details = document.createElement('details')
      details.classList.add('presentation')

      const summary = document.createElement('summary')
      details.appendChild(summary)

      const title = document.createElement('strong')
      title.textContent = pres.title
      summary.appendChild(title)

      const author = document.createElement('p')
      author.classList.add('author')
      author.textContent = pres.author
      summary.appendChild(author)

      const abstract = document.createElement('p')
      abstract.classList.add('abstract')
      abstract.textContent = pres.abstract
      details.appendChild(abstract)

      wrapper.appendChild(details)
      wrapper.appendChild(document.createElement('hr'))
    }
  }

  if (event.type === 'keynote' || event.type === 'single' || event.type === 'special') {
    const author = document.createElement('p')
    author.classList.add('author')
    author.textContent = event.author
    wrapper.appendChild(author)

    const abstract = document.createElement('p')
    abstract.classList.add('abstract')
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
  const div = document.createElement('div')
  div.classList.add('dialog-content-wrapper')
  return div
}
