
export default function (options) {
  let elType = options.elType || 'div'
  let containerId = options.containerId || 'gv-container'
  let elId = options.elId
  let clear = options.clear

  if (clear && document.getElementById(elId)) {
    document.getElementById(elId).remove()
  }

  const el = document.createElement(elType)
  el.id = elId
  if (document.getElementById(containerId)) {
    document.getElementById(containerId).appendChild(el)
  } else {
    console.log(`Elemento ${containerId} non trovato faccio mount su body`)
    document.body.appendChild(el)
  }

  return el
}
