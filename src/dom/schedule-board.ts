import { DateTime } from "luxon"
import { Agenda } from "../agenda"
import { CSVRecord } from "../csv"
import bookmarkIcon from '../icons/bookmark.svg'
import { getTimeOffset } from "../util/time-helpers"
import { dom } from "./util"

export function generateScheduleBoard (): HTMLDivElement {
  return dom('div', undefined, { id: 'conferia-schedule-board' })
}

export function updateScheduleBoard (scheduleBoard: HTMLElement, dayWidth: number, timeWidth: number) {
  scheduleBoard.style = `background-size: ${dayWidth}px ${timeWidth}px;
    background-image:
    repeating-linear-gradient(90deg, transparent, transparent ${dayWidth - 1}px, var(--schedule-board-grid) ${dayWidth - 1}px, var(--schedule-board-grid) ${dayWidth}px),
    repeating-linear-gradient(0deg, transparent, transparent ${timeWidth - 1}px, var(--schedule-board-grid) ${timeWidth - 1}px, var(--schedule-board-grid) ${timeWidth}px);`
}

export function drawVerticalDayDividers (startTime: DateTime, endTime: DateTime, scheduleBoard: HTMLElement, columnWidth: number, colsPerDay: string[][], pps: number) {
  const secondsPerDay = getTimeOffset(endTime, startTime)
  const dividerHeight = secondsPerDay * pps
  const dividerWidth = 6

  for (let day = 1; day < colsPerDay.length; day++) {
    const prevColumnsOffset = colsPerDay.slice(0, day).reduce((prev, cur) => prev + Math.max(cur.length, 1), 0)
    const div = dom('div', 'cf-day-divider')
    div.style.width = `${dividerWidth}px`
    div.style.height = `${dividerHeight}px`
    div.style.top = '0px'
    div.style.left = `${prevColumnsOffset * columnWidth - dividerWidth / 2}px`
    scheduleBoard.appendChild(div)
  }
}

export function generateEventCard (event: CSVRecord, agenda: Agenda): HTMLDivElement {
  const card = dom('div', ['event', event.type])
  card.style.position = 'absolute'

  // Card header
  // ==========================================
  const header = dom('div', 'event-header')
  card.appendChild(header)

  const title = dom('h3', 'cf-event-title')
  title.textContent = event.title
  header.appendChild(title)

  if (event.location !== undefined) {
    const loc = dom('p', 'location')
    loc.textContent = event.location
    header.appendChild(loc)
  }

  // Card content
  // ==========================================
  const content = dom('div', 'event-content')
  card.appendChild(content)

  if (event.type === 'session') {
    const ol = dom('ol', 'presentation-list')
    for (const presentation of event.presentations) {
      const li = dom('li')
      li.textContent = presentation.title
      ol.appendChild(li)
    }
    content.appendChild(ol)
  } else if (event.type === 'keynote' || event.type === 'single') {
    const author = dom('p', 'author')
    author.textContent = event.author
    content.appendChild(author)
  }

  // Card footer
  // ==========================================
  const footer = dom('div', 'event-footer')
  card.appendChild(footer)

  // Footer information
  const idElem = dom('p', 'event-id')
  idElem.textContent = event.id
  footer.appendChild(idElem)

  const bookmarkItem = dom('div', 'bookmark')
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
