import getAuth from "../services/getAuth"

export default function autorizza(app, ruolo, test) {
  getAuth(app, ruolo, test).then(data => {
    return data
  })
}
