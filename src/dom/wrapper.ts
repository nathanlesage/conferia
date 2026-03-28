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
 * Generates a header structure that can be inserted on the page.
 *
 * @param   {string}         title  The title
 * @param   {string}         intro  The intro
 *
 * @return  {HTMLElement[]}         The generated DOM elements
 */
export function generateHeader (title?: string, intro?: string): HTMLElement[] {
  const elems: HTMLElement[] = []

  if (title !== undefined && title.trim() !== '') {
    const h1 = dom('h1')
    h1.textContent = title.trim()
    elems.push(h1)
  }

  if (intro !== undefined && intro.trim() !== '') {
    const p = dom('p')
    p.textContent = intro.trim()
    elems.push(p)
  }

  return elems
}

/**
 * Generates the primary Conferia.js DOM structure.
 *
 * @param   {HTMLDivElement}  toolbar  The toolbar DOM, which is generated elsewhere
 *
 * @return  {DOMStructure}             The DOM structure
 */
export function generateDOMStructure (toolbar: HTMLDivElement): DOMStructure {
  const wrapper = dom('div', undefined, { id: 'conferia-wrapper', role: 'presentation' })

  const dayGutter = generateDayGutter()
  const timeGutter = generateTimeGutter()
  const scheduleBoard = generateScheduleBoard()

  const scheduleWrapper = generateScheduleWrapper()
  scheduleWrapper.appendChild(dayGutter)
  scheduleWrapper.appendChild(timeGutter)
  scheduleWrapper.appendChild(scheduleBoard)

  wrapper.appendChild(toolbar)
  wrapper.appendChild(scheduleWrapper)

  const footer = generateFooter()
  wrapper.appendChild(footer)

  return {
    wrapper, scheduleWrapper, timeGutter, dayGutter, scheduleBoard
  }
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
