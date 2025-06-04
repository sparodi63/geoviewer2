import axios from 'axios'

export default async function() {
  const url = '/geoservices/REST/risknat/ds_list'
  const response = await axios.get(url)
  return response.data.data
}
