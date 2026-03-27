import { generateDayGutter } from "./day-gutter"
import { generateScheduleBoard, generateScheduleWrapper } from "./schedule-board"
import { generateTimeGutter } from "./time-gutter"
import pkg from "../../package.json"
import { dom } from "./util"

export interface DOMStructure {
  wrapper: HTMLDivElement
  scheduleWrapper: HTMLDivElement
  timeGutter: HTMLDivElement
  dayGutter: HTMLDivElement
  scheduleBoard: HTMLDivElement
}

/**
 * Generates the primary Conferia.js DOM structure.
 *
 * @param   {string}        title      The optional title
 *
 * @return  {DOMStructure}             The DOM structure
 */
export function generateDOMStructure (title?: string): DOMStructure {
  const wrapper = generateWrapper(title)
  const dayGutter = generateDayGutter()
  const timeGutter = generateTimeGutter()
  const scheduleWrapper = generateScheduleWrapper()
  const scheduleBoard = generateScheduleBoard()

  scheduleWrapper.appendChild(dayGutter)
  scheduleWrapper.appendChild(timeGutter)
  scheduleWrapper.appendChild(scheduleBoard)
  wrapper.appendChild(scheduleWrapper)

  const footer = generateFooter()
  wrapper.appendChild(footer)

  return {
    wrapper, scheduleWrapper, timeGutter, dayGutter, scheduleBoard
  }
}

/**
 * Generates the outer wrapper
 *
 * @param   {string}          title      The optional title
 * @param   {string}          maxHeight  The optional max Height property
 *
 * @return  {HTMLDivElement}             The wrapper DIV
 */
function generateWrapper (title?: string, maxHeight?: string): HTMLDivElement {
  const div = dom('div', undefined, { id: 'conferia-wrapper', role: 'presentation' })
  if (maxHeight !== undefined) {
    div.style.maxHeight = maxHeight
  }

  if (title !== undefined) {
    const h1 = dom('h1')
    h1.textContent = title
    div.appendChild(h1)
  }

  return div
}

/**
 * Generates the Conferia.js footer
 *
 * @return  {HTMLDivElement}  The footer DIV
 */
function generateFooter (): HTMLDivElement {
  const div = dom('div', undefined, { id: 'conferia-footer' })

  const copy = dom('span')
  copy.innerHTML = `Powered by <a href="https://nathanlesage.github.io/conferia/" target="_blank">Conferia.js</a> | &copy; 2026 | <a href="https://nathanlesage.github.io/conferia/users-guide" target="_blank">User‘s Guide</a>`
  div.appendChild(copy)

  const ver = dom('span', undefined, { id: 'cf-version' })
  ver.textContent = 'v' + pkg.version
  div.appendChild(ver)

  return div
}
