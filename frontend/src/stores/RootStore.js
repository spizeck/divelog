// stores/RootStore.js
import { flow, makeAutoObservable } from 'mobx'
import api from '../utils/api'

class RootStore {
  loading = true
  loggedIn = false
  username = ''
  firstName = ''
  preferedUnits = ''
  token = localStorage.getItem('token') || null

  constructor () {
    makeAutoObservable(this)
  }

  resetState() {
    this.setLoggedIn(false)
    this.setUsername('')
    this.setFirstName('')
    this.setPreferedUnits('')
    this.setToken(null)
    localStorage.removeItem('token')
  }

  checkLogin = flow(function * () {
    if (this.token) {
      // check if the token is valid by attempting to retrieve the user's data
      try {
        const response = yield api.getCurrentUser(this.token)
        if (response.data.status === 200) {
          this.setLoggedIn(true)
          this.setUsername(response.data.username)
          this.setFirstName(response.data.first_name)
        } else {
          this.resetState()
        }
      } catch (error) {
        this.resetState()
      }
    } else {
      this.setLoggedIn(false)
    }
    this.setLoading(false)
  })

  login = flow(function* (username, password) {
    try {
      const response = yield api.login(username, password)
      if (response.data.status === 200) {
        this.setLoggedIn(true)
        this.setUsername(response.data.username)
        this.setFirstName(response.data.first_name)
        this.setPreferedUnits(response.data.prefered_units)
        this.setToken(response.data.token)
        localStorage.setItem('token', response.data.token)
      } else {
        this.resetState()
      }
    } catch (error) {
      this.resetState()
    }
  })

  logout = flow(function* () {
    try {
      const response = yield api.logout(this.token)
      if (response.data.status === 200) {
        this.resetState()
      } else {
        this.resetState()
      }
    } catch (error) {
      this.resetState()
    }
  })

  setLoading (value) {
    this.loading = value
  }

  setLoggedIn (value) {
    this.loggedIn = value
  }

  setUsername (value) {
    this.username = value
  }

  setToken (value) {
    this.token = value
  }

  setFirstName (value) {
    this.firstName = value
  }

  setPreferedUnits (value) {
    this.preferedUnits = value
  }
  // Additional actions and state variables can be added as needed
}

export default RootStore
