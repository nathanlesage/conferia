import { DateTime } from "luxon"
import { dom } from "./util"

export function generateDayGutter (): HTMLDivElement {
  return dom('div', undefined, { id: 'conferia-day-gutter', role: 'presentation' })
}

export function updateGutterTicks (dayGutter: HTMLElement, startDay: DateTime, totalDays: number, colWidth: number, dayLocations?: Array<string[]>): void {
  dayGutter.innerHTML = ''
  for (let i = 0; i < totalDays; i++) {
    // Ensure we have at least one column. dayLocations.length may be 0 if on a
    // day there are only no-location events.
    const nSubCols = dayLocations !== undefined ? Math.max(1, dayLocations[i].length) : 1
    const thisDay = startDay.plus({ days: i })
    const dayTick = dom('div', 'tick day', { role: 'presentation' })
    dayTick.textContent = thisDay.toLocaleString({ weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
    dayTick.style.width = `${colWidth * nSubCols}px`
    dayGutter.appendChild(dayTick)
  }
}
