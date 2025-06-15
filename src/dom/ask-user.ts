// Utility to ask the user using a dialog

import { dom } from "./util"

/**
 * Shows a dialog to the user asking to click one of the buttons. The promise
 * resolves with either the clicked button ID, or undefined if the dialog was
 * closed without clicking a button.
 *
 * @param   {string}                     title    The dialog title
 * @param   {string}                     message  The dialog message
 * @param   {string[]}                   buttons  The button labels
 *
 * @return  {Promise<number|undefined>}           The button ID, or undefined
 */
export async function askUser (title: string, message: string, buttons: string[]): Promise<number|undefined> {
  return new Promise((resolve, reject) => {
    const dialog = dom('dialog', 'conferia-dialog')

    const titleElem = dom('h3', 'title')
    titleElem.textContent = title
    dialog.appendChild(titleElem)

    const content = dom('div')
    content.textContent = message
    dialog.appendChild(content)

    const buttonGroup = dom('div', 'button-group')
    dialog.appendChild(buttonGroup)

    for (let i = 0; i < buttons.length; i++) {
      const buttonElement = document.createElement('button')
      buttonElement.textContent = buttons[i]
      buttonElement.addEventListener('click', () => {
        resolve(i)
        dialog.close()
      })
      buttonGroup.appendChild(buttonElement)
    }

    document.body.appendChild(dialog)
    dialog.addEventListener('close', () => {
      resolve(undefined)
      document.body.removeChild(dialog)
    })
    dialog.showModal()
  })
}
