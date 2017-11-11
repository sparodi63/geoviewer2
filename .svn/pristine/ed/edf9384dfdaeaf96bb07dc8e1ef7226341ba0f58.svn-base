export default function getUrlParam (paramName) {
  var results = new RegExp('[\\?&]' + paramName + '=([^&#]*)').exec(window.location.href)
  return results ? decodeURIComponent(results[1]) : null
}
