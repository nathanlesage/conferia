import { DateTime } from "luxon"

export function generateDayGutter (): HTMLDivElement {
  const div = document.createElement('div')
  div.setAttribute('id', 'conferia-day-gutter')
  return div
}

export function updateGutterTicks (dayGutter: HTMLElement, startDay: DateTime, totalDays: number, colWidth: number, dayLocations?: Array<string[]>): void {
  dayGutter.innerHTML = ''
  for (let i = 0; i < totalDays; i++) {
    const nSubCols = dayLocations !== undefined ? dayLocations[i].length : 1
    const thisDay = startDay.plus({ days: i })
    const dayTick = document.createElement('div')
    dayTick.classList.add('tick', 'day')
    dayTick.textContent = thisDay.toLocaleString({ weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
    dayTick.style.width = `${colWidth * nSubCols}px`
    dayGutter.appendChild(dayTick)
  }
}
