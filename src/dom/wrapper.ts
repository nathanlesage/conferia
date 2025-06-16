import { generateDayGutter } from "./day-gutter"
import { generateScheduleBoard } from "./schedule-board"
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
    const hasFullscreen = document.fullscreenElement !== null
    const isWrapperFullscreen = document.fullscreenElement === wrapper

    if (hasFullscreen && !isWrapperFullscreen) {
      return // Something else has fullscreen, don't interfere
    } else if (hasFullscreen && isWrapperFullscreen) {
      document.exitFullscreen()
        .catch(err => console.error('Could not exit Conferia.js fullscreen', err))
        .then(() => {
          fullscreenButton.innerHTML = enterFullscreenIcon
          fullscreenButton.title = 'Enter Fullscreen'
        })
    } else {
      wrapper.requestFullscreen()
        .catch(err => console.error('Conferia could not enter fullscreen', err))
        .then(() => {
          fullscreenButton.innerHTML = exitFullscreenIcon
          fullscreenButton.title = 'Exit Fullscreen'
        })
    }
  })

  return {
    wrapper, timeGutter, dayGutter, scheduleBoard,
    filter, personalAgendaToggle, toIcalButton, clearButton
  }
}

/**
 * Generates the schedule board wrapper
 *
 * @return  {HTMLDivElement}  The wrapper DIV
 */
function generateScheduleWrapper (): HTMLDivElement {
  return dom('div', undefined, { id: 'conferia-schedule-wrapper' })
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
  const div = dom('div', undefined, { id: 'conferia-wrapper' })
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
