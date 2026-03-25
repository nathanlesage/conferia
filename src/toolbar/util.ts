import slashIcon from '../icons/slash.svg'
import helpIcon from '../icons/help-circle.svg'
import calendarIcon from '../icons/calendar.svg'
import bookmarkIcon from '../icons/bookmark.svg'
import enterFullscreenIcon from '../icons/enter-fullscreen.svg'
import exitFullscreenIcon from '../icons/exit-fullscreen.svg'
import { dom } from '../dom/util'

/**
 * Creates the toolbar wrapper element
 */
export function makeToolbarWrapper () {
  return dom('div', undefined, { id: 'conferia-toolbar' })
}

/**
 * Creates a toolbar filter element
 */
export function makeFilter () {
  return dom('input', undefined, { type: 'search', placeholder: 'Search…' })
}

/**
 * Creates the agenda toggle element
 *
 * @param   {boolean}  showAgenda  Whether to preset it as active
 */
export function makeAgendaToggle (showAgenda: boolean) {
  const toggle = dom('button', undefined, { title: 'Only personal agenda' })
  toggle.innerHTML = bookmarkIcon
  toggle.classList.toggle('active', showAgenda)
  return toggle
}

/**
 * Creates the iCal button
 */
export function makeIcalButton () {
  const toIcalButton = dom('button', undefined, { title: 'Add to calendar' })
  toIcalButton.innerHTML = calendarIcon
  return toIcalButton
}

/**
 * Creates the fullscreen button
 *
 * @param   {boolean}  isFs  Whether to preset it as active
 */
export function makeFullscreenButton (isFs: boolean) {
  const fullscreenButton = dom('button')
  fullscreenButton.title = isFs ? 'Exit Fullscreen' : 'Enter Fullscreen'
  fullscreenButton.innerHTML = isFs ? exitFullscreenIcon : enterFullscreenIcon
  fullscreenButton.classList.toggle('active',isFs)
  return fullscreenButton
}

/**
 * Creates the clear button element
 */
export function makeClearButton () {
  const clearButton = dom('button', undefined, { title: 'Clear data…' })
  clearButton.innerHTML = slashIcon
  return clearButton
}

/**
 * Creates the help button
 */
export function makeHelpButton () {
  const helpButton = dom('button', undefined, { title: 'Help' })
  helpButton.innerHTML = helpIcon
  return helpButton
}
