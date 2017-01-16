export default function createElement (tagName, elementId, containterId, clear) {
  'use strict'
  const container = document.getElementById(containterId)

  if (clear) {
    const el = document.getElementById(elementId)
    if (el) {
      el.remove()
    }
  }
  const el = document.createElement(tagName)
  el.id = elementId
  container.appendChild(el)
  return el
}
