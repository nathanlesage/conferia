/**
 * Utility function that allows creation of DOM elements in a more ergonomic way
 * than the default document.createElement way.
 *
 * @param   {HTMLElementTagNameMap}  tagName  The tag name
 * @param   {string[][]}             classes  Optional classes to add
 * @param   {Record<string, string>} attr     Attributes to set
 *
 * @return  {HTMLElement}                     The HTML Element
 */
export function dom<K extends keyof HTMLElementTagNameMap>(tagName: K, classes?: string|string[], attr?: Record<string, string>): HTMLElementTagNameMap[K] {
  const elem = document.createElement(tagName)
  if (typeof classes === 'string') {
    elem.classList.value = classes
  } else if (Array.isArray(classes)) {
    elem.classList.add(...classes)
  }

  if (attr !== undefined) {
    for (const prop in attr) {
      elem.setAttribute(prop, attr[prop])
    }
  }

  return elem
}
