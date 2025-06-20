import { DateTime } from "luxon"
import { getTimeOffset } from "../util/time-helpers"
import { dom } from "./util"

const MINIMUM_TICK_HEIGHT = 25

export function generateTimeGutter (): HTMLDivElement {
  return dom('div', undefined, { id: 'conferia-time-gutter', role: 'presentation' })
}

/**
 * Updates the time gutter to reflect the full range of times
 *
 * @param   {HTMLElement}  timeGutter  The time gutter DOM element
 * @param   {DateTime}     startTime   The earliest time available
 * @param   {DateTime}     endTime     The latest time available
 * @param   {number}       pps         Pixels per second (of height)
 */
export function updateGutterTicks (timeGutter: HTMLElement, startTime: DateTime, endTime: DateTime, pps: number): void {
  const secondsPerDay = getTimeOffset(endTime, startTime)
  // NOTE: Ticks should increase or decrease by intervals of 300 seconds (5 minutes)
  let tickSize = 300
  while (tickSize * pps < MINIMUM_TICK_HEIGHT) {
    tickSize += 300
  }

  const tickCount = Math.ceil(secondsPerDay / tickSize)
  // Update the time Gutter accordingly. First, the height. Then, the ticks.
  timeGutter.innerHTML = ''
  // One tick per shortest interval
  timeGutter.style = `height: ${(tickCount + 1) * tickSize * pps}px;`
  for (let i = 0; i <= tickCount; i++) {
    const tick = dom('div', 'tick time', { role: 'presentation' })
    tick.style = `height: ${tickSize * pps}px;`
    const tickTime = startTime.plus({ seconds: i * tickSize })
    tick.textContent = tickTime.toLocaleString({ timeStyle: 'short', hourCycle: 'h24' })
    timeGutter.appendChild(tick)
  }
}
