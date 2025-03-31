import { DateTime } from "luxon"
import { getTimeOffset } from "../util/time-helpers"

const MINIMUM_TICK_HEIGHT = 30

export function generateTimeGutter (): HTMLDivElement {
  const div = document.createElement('div')
  div.setAttribute('id', 'conferia-time-gutter')
  return div
}

export function updateGutterTicks (timeGutter: HTMLElement, startTime: DateTime, endTime: DateTime, timeScaleFactor: number): void {
  const secondsPerDay = getTimeOffset(endTime, startTime)
  const pxPerSecond = 1 / timeScaleFactor
  // NOTE: Ticks should increase or decrease by intervals of 300 seconds (5 minutes)
  let tickSize = 300
  while (tickSize * pxPerSecond < MINIMUM_TICK_HEIGHT) {
    tickSize += 300
  }

  const tickCount = Math.ceil(secondsPerDay / tickSize)
  // Update the time Gutter accordingly. First, the height. Then, the ticks.
  timeGutter.innerHTML = ''
  // One tick per shortest interval
  timeGutter.style = `height: ${(tickCount + 1) * tickSize / timeScaleFactor}px;`
  for (let i = 0; i <= tickCount; i++) {
    const tick = document.createElement('div')
    tick.classList.add('tick', 'time')
    tick.style = `height: ${tickSize / timeScaleFactor}px;`
    const tickTime = startTime.plus({ seconds: i * tickSize })
    tick.textContent = tickTime.toLocaleString({ timeStyle: 'short', hourCycle: 'h24' })
    timeGutter.appendChild(tick)
  }
}
