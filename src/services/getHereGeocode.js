import axios from 'axios'
import globals from '../globals'

export default function(query) {
  const params = {
    app_id: 'uHFYCdocrLoinMf8j6RK',
    app_code: 'XKQe3be7-30iGWPuh3dbtQ',
    mapview: '7.43,43.75;10.00,44.70',
    searchtext: query,
  }

  return axios.get(globals.HERE_GEOCODE_PROXY, { params: params }).then(response => {
    return response.data.Response.View[0].Result.map(result => {
      return {
        relevance: result.Relevance,
        match_level: result.MatchLevel,
        match_type: result.MatchType,
        formatted_address: result.Location.Address.Label,
        place_id: result.Location.LocationId,
        geometry: { location: { lat: result.Location.DisplayPosition.Latitude, lng: result.Location.DisplayPosition.Longitude } },
      }
    })
  })
}
