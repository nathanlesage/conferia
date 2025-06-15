// Toolbar related DOM structure generation
import slashIcon from '../icons/slash.svg'
import calendarIcon from '../icons/calendar.svg'
import { dom } from './util'

export interface ToolbarDOMStructure {
  toolbar: HTMLDivElement
  filter: HTMLInputElement
  personalAgendaToggle: HTMLInputElement
  toIcalButton: HTMLButtonElement
  fullscreenButton: HTMLButtonElement
  clearButton: HTMLButtonElement
}

export function generateToolbarStructure (): ToolbarDOMStructure {
  const toolbar = dom('div', undefined, { id: 'conferia-toolbar' })

  const filter = dom('input', undefined, { type: 'search', placeholder: 'Search…' })
  toolbar.appendChild(filter)

  const agendaLabel = dom('label')
  const personalAgendaToggle = dom('input', undefined, { type: 'checkbox' })
  agendaLabel.appendChild(personalAgendaToggle)
  agendaLabel.appendChild(new Text('Only Personal Agenda'))

  toolbar.appendChild(agendaLabel)

  const toIcalButton = dom('button', undefined, { title: 'Add to calendar' })
  toIcalButton.innerHTML = calendarIcon
  toolbar.appendChild(toIcalButton)

  const fullscreenButton = dom('button')
  toolbar.appendChild(fullscreenButton)

  const clearButton = dom('button', undefined, { title: 'Clear data…' })
  clearButton.innerHTML = slashIcon
  toolbar.appendChild(clearButton)

  return {
    toolbar,
    filter, personalAgendaToggle,
    toIcalButton, fullscreenButton, clearButton
  }
}
