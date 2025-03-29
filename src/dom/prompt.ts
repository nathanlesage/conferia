// Utility function to prompt the user

export function promptUser (title: string, message: string, buttonText: string = 'Ok') {
  const dialog = document.createElement('dialog')

  const titleElem = document.createElement('h3')
  titleElem.textContent = title
  titleElem.classList.add('title')
  dialog.appendChild(titleElem)

  const content = document.createElement('div')
  content.textContent = message
  dialog.appendChild(content)

  const closeButton = document.createElement('button')
  closeButton.classList.add('close-button')
  closeButton.textContent = buttonText
  closeButton.addEventListener('click', () => dialog.close())
  dialog.appendChild(closeButton)

  document.body.appendChild(dialog)
  dialog.addEventListener('close', () => {
    document.body.removeChild(dialog)
  })
  dialog.showModal()
}
