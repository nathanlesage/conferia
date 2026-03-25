import { DateTime } from "luxon"
import { dom } from "./util"

/**
 * Generates the day gutter wrapper element
 */
export function generateDayGutter (): HTMLDivElement {
  return dom('div', undefined, { id: 'conferia-day-gutter', role: 'presentation' })
}

/**
 * Updates the gutter ticks within the day gutter element according to the state.
 *
 * @param   {HTMLElement}  dayGutter     The gutter element
 * @param   {DateTime}     startDay      The start day
 * @param   {number}       totalDays     Total number of days
 * @param   {number}       colWidth      The total width per column
 * @param   {string[]}     dayLocations  The locations per day (to calculate sub-columns)
 */
export function updateGutterTicks (dayGutter: HTMLElement, startDay: DateTime, totalDays: number, colWidth: number, dayLocations?: Array<string[]>): void {
  dayGutter.innerHTML = ''
  for (let i = 0; i < totalDays; i++) {
    // Ensure we have at least one column. dayLocations.length may be 0 if on a
    // day there are only no-location events.
    const nSubCols = dayLocations !== undefined ? Math.max(1, dayLocations[i].length) : 1
    const thisDay = startDay.plus({ days: i })
    const dayTick = dom('div', 'tick day', { role: 'presentation' })
    dayTick.style.width = `${colWidth * nSubCols}px`

    const content = dom('span', 'content')
    content.textContent = thisDay.toLocaleString({ weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
    dayTick.appendChild(content)

    dayGutter.appendChild(dayTick)
  }
}
