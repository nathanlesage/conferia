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

/**
 * Returns a div element, if found by selector. Wraps querySelector to make it
 * shorter and still properly typed.
 *
 * @param   {HTMLElementTagNameMap} tagName   The type of element, Div by default
 * @param   {HTMLElement}           elem      The element to search in
 * @param   {string}                selector  The selector to search for
 *
 * @return  {HTMLDivElement|null}             The element, if found, otherwise null.
 */
export function get<K extends keyof HTMLElementTagNameMap> (tagName: K, elem: HTMLElement, selector: string): HTMLElementTagNameMap[K]|null {
  return elem.querySelector<HTMLElementTagNameMap[K]>(selector)
}

/**
 * Takes a source and a target element, and appends the source element to the
 * target using `appendChild`, but only if the source is not yet attached to
 * target as a direct child.
 *
 * @param   {HTMLElement}  child  The source element to attach
 * @param   {HTMLElement}  parent  The target to attach source to
 */
export function maybeAppend (child: HTMLElement, parent: HTMLElement) {
  if (!parent.contains(child)) {
    parent.appendChild(child)
  }
}
