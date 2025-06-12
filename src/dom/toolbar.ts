// Toolbar related DOM structure generation

export interface ToolbarDOMStructure {
  toolbar: HTMLDivElement
  filter: HTMLInputElement
  personalAgendaToggle: HTMLInputElement
  toIcalButton: HTMLButtonElement
  fullscreenButton: HTMLButtonElement
}

export function generateToolbarStructure (): ToolbarDOMStructure {
  const toolbar = document.createElement('div')
  toolbar.setAttribute('id', 'conferia-toolbar')

  const filter = document.createElement('input')
  filter.setAttribute('type', 'search')
  filter.setAttribute('placeholder', 'Search…')
  toolbar.appendChild(filter)

  const agendaLabel = document.createElement('label')
  const personalAgendaToggle = document.createElement('input')
  personalAgendaToggle.setAttribute('type', 'checkbox')
  agendaLabel.appendChild(personalAgendaToggle)
  agendaLabel.appendChild(new Text('Only Personal Agenda'))

  toolbar.appendChild(agendaLabel)

  const toIcalButton = document.createElement('button')
  toIcalButton.textContent = 'Add to calendar'
  toolbar.appendChild(toIcalButton)

  const fullscreenButton = document.createElement('button')
  toolbar.appendChild(fullscreenButton)

  return { toolbar, filter, personalAgendaToggle, toIcalButton, fullscreenButton }
}
