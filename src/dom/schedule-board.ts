import { Agenda } from "../agenda"
import { CSVRecord } from "../csv"
import bookmarkIcon from '../icons/bookmark.svg'
import { dom } from "./util"

/**
 * Utility function to define the aria event type for the Dom
 *
 * @param   {CSVRecord}  event  The event record
 *
 * @return  {string}            The Aria label
 */
function getAriaEventType (event: CSVRecord): string {
  if (event.type === 'keynote') {
    return 'Keynote'
  } else if (event.type === 'session') {
    return 'Parallel Session'
  } else if (event.type === 'special') {
    return 'Special Event'
  } else {
    return 'Event'
  }
}

/**
 * Generates the schedule board wrapper
 *
 * @return  {HTMLDivElement}  The wrapper DIV
 */
export function generateScheduleWrapper (): HTMLDivElement {
  return dom('div', undefined, { id: 'conferia-schedule-wrapper', role: 'presentation' })
}

/**
 * Generate the schedule board DOM wrapper
 */
export function generateScheduleBoard (): HTMLDivElement {
  return dom('div', undefined, {
    id: 'conferia-schedule-board',
    role: 'region',
    'aria-label': 'Agenda'
  })
}

/**
 * Update the schedule board's background size according to the day and time sizes.
 *
 * @param   {HTMLElement}  scheduleBoard  The schedule board
 * @param   {number}       dayWidth       The width of a day in px
 * @param   {number}       timeWidth      The height of a time slice in px
 */
export function updateScheduleBoard (scheduleBoard: HTMLElement, dayWidth: number, timeWidth: number) {
  scheduleBoard.style = `background-size: ${dayWidth}px ${timeWidth}px;
    background-image:
    repeating-linear-gradient(90deg, transparent, transparent ${dayWidth - 1}px, var(--schedule-board-grid) ${dayWidth - 1}px, var(--schedule-board-grid) ${dayWidth}px),
    repeating-linear-gradient(0deg, transparent, transparent ${timeWidth - 1}px, var(--schedule-board-grid) ${timeWidth - 1}px, var(--schedule-board-grid) ${timeWidth}px);`
}

/**
 * Draws vertical day dividers between each day to visually distinguish the days
 *
 * @param   {HTMLElement}  scheduleBoard  The schedule board
 * @param   {number}       columnWidth    How wide the columns are in pixels
 * @param   {string[][]}   colsPerDay     Indicates whether there are subcols
 */
export function drawVerticalDayDividers (scheduleBoard: HTMLElement, columnWidth: number, colsPerDay: string[][]) {
  const dividerWidth = 6

  for (let day = 1; day < colsPerDay.length; day++) {
    const prevColumnsOffset = colsPerDay.slice(0, day).reduce((prev, cur) => prev + Math.max(cur.length, 1), 0)
    const div = dom('div', 'cf-day-divider')
    div.style.width = `${dividerWidth}px`
    div.style.left = `${prevColumnsOffset * columnWidth - dividerWidth / 2}px`
    scheduleBoard.appendChild(div)
  }
}

/**
 * Generates a card for a provided event.
 *
 * @param   {CSVRecord}       event   The event to turn into a card
 * @param   {Agenda}          agenda  The personal agenda controller
 *
 * @return  {HTMLDivElement}          The event card element
 */
export function generateEventCard (event: CSVRecord, agenda: Agenda): HTMLDivElement {
  const card = dom('div', ['event', event.type], {
    tabindex: '0',
    role: 'button',
    'aria-label': `${getAriaEventType(event)}: ${event.title}; ${event.dateStart.toLocaleString({ dateStyle: 'full', timeStyle: 'short' })} in ${event.location === '' ? 'No location' : event.location}`
  })
  card.style.position = 'absolute'

  // Card header
  // ==========================================
  const header = dom('div', 'event-header')
  card.appendChild(header)

  const title = dom('h3', 'cf-event-title', { id: `title-${event.id}` })
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
