import { Agenda } from "../agenda"
import { CSVRecord } from "../csv"
import bookmarkIcon from '../icons/bookmark.svg'

export function generateScheduleBoard (): HTMLDivElement {
  const div = document.createElement('div')
  div.setAttribute('id', 'conferia-schedule-board')
  return div
}

export function updateScheduleBoard (scheduleBoard: HTMLElement, dayWidth: number, timeWidth: number) {
  scheduleBoard.style = `background-size: ${dayWidth}px ${timeWidth}px;
    background-image:
    repeating-linear-gradient(90deg, transparent, transparent ${dayWidth - 1}px, var(--schedule-board-grid) ${dayWidth - 1}px, var(--schedule-board-grid) ${dayWidth}px),
    repeating-linear-gradient(0deg, transparent, transparent ${timeWidth - 1}px, var(--schedule-board-grid) ${timeWidth - 1}px, var(--schedule-board-grid) ${timeWidth}px);`
}

export function generateEventCard (event: CSVRecord, agenda: Agenda): HTMLDivElement {
  const card = document.createElement('div')
  card.classList.add('event', event.type)
  card.style.position = 'absolute'

  // Card header
  // ==========================================
  const header = document.createElement('div')
  header.classList.add('event-header')
  card.appendChild(header)

  const title = document.createElement('h3')
  title.classList.add('title')
  title.textContent = event.title
  header.appendChild(title)

  if (event.location !== undefined) {
    const loc = document.createElement('p')
    loc.classList.add('location')
    loc.textContent = event.location
    header.appendChild(loc)
  }

  // Card content
  // ==========================================
  const content = document.createElement('div')
  content.classList.add('content')
  card.appendChild(content)

  if (event.type === 'session') {
    const ol = document.createElement('ol')
    ol.classList.add('presentation-list')
    for (const presentation of event.presentations) {
      const li = document.createElement('li')
      li.textContent = presentation.title
      ol.appendChild(li)
    }
    content.appendChild(ol)
  }

  // Card footer
  // ==========================================
  const footer = document.createElement('div')
  footer.classList.add('event-footer')
  card.appendChild(footer)

  // Footer information
  const idElem = document.createElement('p')
  idElem.classList.add('event-id')
  idElem.textContent = event.id
  footer.appendChild(idElem)

  const bookmarkItem = document.createElement('div')
  bookmarkItem.classList.add('bookmark')
  bookmarkItem.innerHTML = bookmarkIcon
  card.classList.toggle('bookmarked', agenda.hasItem(event.id))
  bookmarkItem.addEventListener('click', evt => {
    evt.preventDefault()
    evt.stopPropagation()
    if (agenda.hasItem(event.id)) {
      agenda.removeItem(event.id)
    } else {
      agenda.addItem(event.id)
    }
    card.classList.toggle('bookmarked', agenda.hasItem(event.id))
  })
  footer.appendChild(bookmarkItem)
  return card
}
