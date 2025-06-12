import { generateDayGutter } from "./day-gutter"
import { generateScheduleBoard } from "./schedule-board"
import { generateTimeGutter } from "./time-gutter"
import { generateToolbarStructure } from "./toolbar"
import pkg from "../../package.json"

export interface DOMStructure {
  wrapper: HTMLDivElement
  timeGutter: HTMLDivElement
  dayGutter: HTMLDivElement
  scheduleBoard: HTMLDivElement
  // Toolbar interactive elements
  filter: HTMLInputElement
  personalAgendaToggle: HTMLInputElement
  toIcalButton: HTMLButtonElement
}

/**
 * Generates the primary Conferia.js DOM structure.
 *
 * @param   {string}        title      The optional title
 * @param   {string}        maxHeight  An optional max height string (e.g., `100vh`)
 *
 * @return  {DOMStructure}             The DOM structure
 */
export function generateDOMStructure (title?: string, maxHeight?: string): DOMStructure {
  const wrapper = generateWrapper(title)
  const dayGutter = generateDayGutter()
  const timeGutter = generateTimeGutter()
  const scheduleWrapper = generateScheduleWrapper()
  const scheduleBoard = generateScheduleBoard()

  const { toolbar, filter, personalAgendaToggle, toIcalButton } = generateToolbarStructure()
  wrapper.appendChild(toolbar)

  scheduleWrapper.appendChild(dayGutter)
  scheduleWrapper.appendChild(timeGutter)
  scheduleWrapper.appendChild(scheduleBoard)
  wrapper.appendChild(scheduleWrapper)

  const footer = generateFooter()
  wrapper.appendChild(footer)

  return {
    wrapper, timeGutter, dayGutter, scheduleBoard,
    filter, personalAgendaToggle, toIcalButton
  }
}

/**
 * Generates the schedule board wrapper
 *
 * @return  {HTMLDivElement}  The wrapper DIV
 */
function generateScheduleWrapper (): HTMLDivElement {
  const div = document.createElement('div')
  div.setAttribute('id', 'conferia-schedule-wrapper')
  return div
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
  const div = document.createElement('div')
  div.setAttribute('id', 'conferia-wrapper')
  if (maxHeight !== undefined) {
    div.style.maxHeight = maxHeight
  }

  if (title !== undefined) {
    const h1 = document.createElement('h1')
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
  const div = document.createElement('div')
  div.setAttribute('id', 'conferia-footer')

  const copy = document.createElement('span')
  copy.innerHTML = `Powered by <a href="https://nathanlesage.github.io/conferia/" target="_blank">Conferia.js</a> ${pkg.version} | &copy; 2025 | <a href="https://nathanlesage.github.io/conferia/users-guide.html" target="_blank">User‘s Guide</a>`
  div.appendChild(copy)

  return div
}
