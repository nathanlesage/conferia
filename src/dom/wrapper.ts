import { generateDayGutter } from "./day-gutter"
import { generateScheduleBoard, generateScheduleWrapper } from "./schedule-board"
import { generateTimeGutter } from "./time-gutter"
import { generateToolbarStructure } from "./toolbar"
import pkg from "../../package.json"
import enterFullscreenIcon from '../icons/enter-fullscreen.svg'
import exitFullscreenIcon from '../icons/exit-fullscreen.svg'
import { dom } from "./util"

export interface DOMStructure {
  wrapper: HTMLDivElement
  timeGutter: HTMLDivElement
  dayGutter: HTMLDivElement
  scheduleBoard: HTMLDivElement
  // Toolbar interactive elements
  filter: HTMLInputElement
  personalAgendaToggle: HTMLInputElement
  toIcalButton: HTMLButtonElement
  clearButton: HTMLButtonElement
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

  const {
    toolbar,
    filter, personalAgendaToggle,
    toIcalButton, fullscreenButton, clearButton
  } = generateToolbarStructure()
  wrapper.appendChild(toolbar)

  scheduleWrapper.appendChild(dayGutter)
  scheduleWrapper.appendChild(timeGutter)
  scheduleWrapper.appendChild(scheduleBoard)
  wrapper.appendChild(scheduleWrapper)

  const footer = generateFooter()
  wrapper.appendChild(footer)

  // Hook shortcuts
  document.addEventListener('keydown', event => {
    const cmdOrCtrl = event.metaKey || event.ctrlKey

    if (cmdOrCtrl && event.key === 'f') {
      event.preventDefault()
      event.stopPropagation()
      filter.focus()
    }
  })

  // Initial state preset for the fullscreen button
  fullscreenButton.innerHTML = enterFullscreenIcon
  fullscreenButton.title = 'Enter Fullscreen'

  fullscreenButton.addEventListener('click', event => {
    if (wrapper.classList.contains('fullscreen')) {
      wrapper.classList.remove('fullscreen')
      fullscreenButton.innerHTML = enterFullscreenIcon
      fullscreenButton.title = 'Enter Fullscreen'
    } else {
      wrapper.classList.add('fullscreen')
      fullscreenButton.innerHTML = exitFullscreenIcon
      fullscreenButton.title = 'Exit Fullscreen'
    }
  })

  return {
    wrapper, timeGutter, dayGutter, scheduleBoard,
    filter, personalAgendaToggle, toIcalButton, clearButton
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
  copy.innerHTML = `Powered by <a href="https://nathanlesage.github.io/conferia/" target="_blank">Conferia.js</a> | &copy; 2025 | <a href="https://nathanlesage.github.io/conferia/users-guide" target="_blank">User‘s Guide</a>`
  div.appendChild(copy)

  const ver = dom('span', undefined, { id: 'cf-version' })
  ver.textContent = 'v' + pkg.version
  div.appendChild(ver)

  return div
}
