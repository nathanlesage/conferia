// Toolbar related DOM structure generation
import slashIcon from '../icons/slash.svg'
import helpIcon from '../icons/help-circle.svg'
import calendarIcon from '../icons/calendar.svg'
import { dom } from './util'
import { askUser } from './ask-user'

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

  const helpButton = dom('button', undefined, { title: 'Help' })
  helpButton.innerHTML = helpIcon
  toolbar.appendChild(helpButton)

  // We can handle the help button directly here.
  helpButton.addEventListener('click', () => {
    askUser(
      'About Conferia.js',
      `This conference utilizes the Free and Open Source framework Conferia.js to implement an interactive agenda. Conferia allows you to browse the program effortlessly, search for events, and even bookmark sessions and export them into your personal calendar. Conferia.js has a manual that explains its features and how to use them.`,
      [
        'Open documentation',
        'Close'
      ]
    ).then(response => {
      if (response === 0) {
        // User wants to open the documentation -> redirect them to the documentation.
        // NOTE: We have to do this little anchor element programmatic click dance
        // because Safari on iOS again does not allow opening a new tab using window.open.
        const a = dom('a', undefined, { href: 'https://nathanlesage.github.io/conferia/users-guide/', target: '_blank' })
        document.body.appendChild(a)
        a.addEventListener('mouseup', event => {
          document.body.removeChild(a)
        })
        a.click()
      }
    })
  })

  return {
    toolbar,
    filter, personalAgendaToggle,
    toIcalButton, fullscreenButton, clearButton
  }
}
