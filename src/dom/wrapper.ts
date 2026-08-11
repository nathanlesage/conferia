import { generateDayGutter } from "./day-gutter"
import { generateScheduleBoard, generateScheduleWrapper } from "./schedule-board"
import { generateTimeGutter } from "./time-gutter"
import radioIcon from '../icons/radio.svg'
import pkg from "../../package.json"
import { dom } from "./util"

export interface DOMStructure {
  wrapper: HTMLDivElement
  scheduleWrapper: HTMLDivElement
  timeGutter: HTMLDivElement
  dayGutter: HTMLDivElement
  scheduleBoard: HTMLDivElement
  liveActions: HTMLDivElement
  liveActionsStatusMessage: HTMLSpanElement
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

  const { footer, liveActions, liveActionsStatusMessage } = generateFooterDOM()
  wrapper.appendChild(footer)

  return {
    wrapper,
    scheduleWrapper, timeGutter, dayGutter, scheduleBoard,
    liveActions, liveActionsStatusMessage
  }
}

/**
 * Generates the Conferia.js footer
 *
 * @return  {HTMLDivElement}  The footer DIV
 */
function generateFooterDOM (): { footer: HTMLDivElement, liveActions: HTMLDivElement, liveActionsStatusMessage: HTMLSpanElement } {
  const footer = dom('div', undefined, { id: 'conferia-footer' })

  // Info-string
  const copy = dom('span', undefined, { id: 'cf-footer-info' })
  copy.innerHTML = `Powered by <a href="https://nathanlesage.github.io/conferia/" target="_blank">Conferia.js</a> | &copy; 2026 | <a href="https://nathanlesage.github.io/conferia/users-guide" target="_blank">User‘s Guide</a>`
  footer.appendChild(copy)

  footer.appendChild(dom('div', 'footer-spacer'))

  // Space for dynamic elements
  const liveActions = dom('div', undefined, { id: 'cf-footer-live' })
  liveActions.innerHTML = `${radioIcon}`
  liveActions.title = 'Click to toggle between auto-scrolling as the event progresses and manually scrolling'
  const liveActionsStatusMessage = dom('span', 'cf-live-action-status')
  liveActions.appendChild(liveActionsStatusMessage)
  footer.appendChild(liveActions)

  // Version
  const ver = dom('span', undefined, { id: 'cf-version' })
  ver.textContent = 'v' + pkg.version
  footer.appendChild(ver)

  return { footer, liveActions, liveActionsStatusMessage }
}
