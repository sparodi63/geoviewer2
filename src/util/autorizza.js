import getAuth from "../services/getAuth"

export default function autorizza(ruolo, test) {
  getAuth(ruolo, test).then(data => {
    return data
  })
}
