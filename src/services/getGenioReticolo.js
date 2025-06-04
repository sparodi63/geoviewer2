import axios from 'axios'

export default async function (cod, count) {
  const url = `/geoservices/REST/genioweb/reticolo/${cod}/${count}`
  const response = await axios.get(url)
  return response.data.data
}
