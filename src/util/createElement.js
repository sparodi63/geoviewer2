
export default function ({
    elType = 'div',
    elId,
    containterId = 'gv-container',
    clear
  })
{
  if (clear && document.getElementById(elId)) {
    document.getElementById(elId).remove()
  }

  const el = document.createElement(elType)
  el.id = elId
  document.getElementById(containterId).appendChild(el)

  return el
}
