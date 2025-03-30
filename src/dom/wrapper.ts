import { generateDayGutter } from "./day-gutter"
import { generateScheduleBoard } from "./schedule-board"
import { generateTimeGutter } from "./time-gutter"
import { generateToolbarStructure } from "./toolbar"

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

export function generateDOMStructure (title?: string): DOMStructure {
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

  return {
    wrapper, timeGutter, dayGutter, scheduleBoard,
    filter, personalAgendaToggle, toIcalButton
  }
}

function generateScheduleWrapper (): HTMLDivElement {
  const div = document.createElement('div')
  div.setAttribute('id', 'conferia-schedule-wrapper')
  return div
}

function generateWrapper (title?: string): HTMLDivElement {
  const div = document.createElement('div')
  div.setAttribute('id', 'conferia-wrapper')

  if (title !== undefined) {
    const h1 = document.createElement('h1')
    h1.textContent = title
    div.appendChild(h1)
  }

  return div
}
