import slashIcon from '../icons/slash.svg'
import helpIcon from '../icons/help-circle.svg'
import calendarIcon from '../icons/calendar.svg'
import bookmarkIcon from '../icons/bookmark.svg'
import enterFullscreenIcon from '../icons/enter-fullscreen.svg'
import exitFullscreenIcon from '../icons/exit-fullscreen.svg'
import minimizeIcon from '../icons/minimize-2.svg'
import maximizeIcon from '../icons/maximize-2.svg'
import chevronLeftIcon from '../icons/chevron-left.svg'
import chevronRightIcon from '../icons/chevron-right.svg'
import { dom } from '../dom/util'
import { ApplicationState } from '../state'

/**
 * Makes a toolbar spacer
 */
export function makeSpacer () {
  return dom('div', 'toolbar-spacer')
}

/**
 * Generates a day selector item.
 *
 * @param  {ApplicationState}  state     The application state
 * @param  {HTMLDivElement}    selector  A previously generated selector
 */
export function makeDaySelector (state: ApplicationState, selector?: HTMLDivElement) {
  if (selector === undefined) {
    selector = dom('div', 'day-selector')
    const day = dom('span', 'day-indicator')
    
    const prev = dom('button', undefined, { title: 'Previous day' })
    prev.innerHTML = chevronLeftIcon
    const next = dom('button', undefined, { title: 'Next day' })
    next.innerHTML = chevronRightIcon
    
    selector.append(prev, day, next)
  }

  // Conditionally show this element in compact mode
  selector.style.display = state.get('viewMode') === 'compact' ? '' : 'none'

  // Update the day indicator
  const day = selector.querySelector('.day-indicator')
  if (day !== null) {
    day.textContent = state.get('compactDay').toLocaleString({ month: 'short', day: 'numeric' })
  }

  return selector
}

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
 * Creates the iCal button
 */
export function makeIcalButton () {
  const toIcalButton = dom('button', undefined, { title: 'Add to calendar' })
  toIcalButton.innerHTML = calendarIcon
  return toIcalButton
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

/**
 * Creates the agenda toggle element. Pass a previously generated button as the
 * second argument to update it.
 *
 * @param  {boolean}            showAgenda  Whether to preset it as active
 * @param  {HTMLButtonElement}  button      The previously generated button
 */
export function makeAgendaToggle (showAgenda: boolean, button?: HTMLButtonElement) {
  if (button === undefined) {
    button = dom('button')
  }

  button.title = 'Only personal agenda'
  button.innerHTML = bookmarkIcon
  button.classList.toggle('active', showAgenda)
  return button
}

/**
 * Creates the fullscreen button. Pass a previously generated button as the
 * second argument to update it.
 *
 * @param   {boolean}            isFs    Whether to preset it as active
 * @param   {HTMLButtonElement}  button  The previously generated button
 *
 * @return  {HTMLButtonElement}          The button
 */
export function makeFullscreenToggle (isFs: boolean, button?: HTMLButtonElement) {
  if (button === undefined) {
    button = dom('button')
  }

  button.title = isFs ? 'Exit Fullscreen' : 'Enter Fullscreen'
  button.innerHTML = isFs ? exitFullscreenIcon : enterFullscreenIcon
  button.classList.toggle('active', isFs)
  return button
}

/**
 * Generates a compact toggle. Pass a previously generated button as the second
 * argument to update it.
 *
 * @param   {boolean}            compact  Whether the button is active
 * @param   {HTMLButtonElement}  button   The previous button element
 *
 * @return  {HTMLButtonElement}                      The button
 */
export function makeCompactToggle (compact: boolean, button?: HTMLButtonElement) {
  if (button === undefined) {
    button = dom('button')
  }

  button.title = compact ? 'Show all days' : 'Show single day'
  button.innerHTML = compact ? maximizeIcon : minimizeIcon
  button.classList.toggle('active', compact)
  return button
}
