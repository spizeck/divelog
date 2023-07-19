// stores/RootStore.js
import { flow, makeAutoObservable } from 'mobx'
import UserStore from './userStore'
import AuthStore from './authStore'
import api from '../utils/api'

class RootStore {
  userStore
  authStore
  loading = true
  loggedIn = false
  token = null

  constructor () {
    this.userStore = new UserStore()
    this.authStore = new AuthStore()
    makeAutoObservable(this)
    this.checkLogin = this.checkLogin.bind(this)
    this.token = localStorage.getItem('token') || null
  }

  resetState () {
    this.setLoggedIn(false)
    this.setUsername('')
    this.setFirstName('')
    this.setPreferedUnits('')
    this.setToken(null)
    localStorage.removeItem('token')
    this.setLoading(false)
  }

  checkLogin = flow(function* () {
    try {
      if (this.token) {
        // check if the token is valid by attempting to retrieve the user's data
        const response = yield api.getCurrentUser(this.token)
        if (response.data.status === 200) {
          this.setLoggedIn(true)
          this.setUsername(response.data.username)
          this.setFirstName(response.data.first_name)
          this.setPreferedUnits(response.data.prefered_units)
        } else {
          this.resetState()
        }
      } else {
        this.setLoggedIn(false)
      }
    } catch (error) {
      this.resetState()
    } finally {
      this.setLoading(false)
    }
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

  setToken (value) {
    this.token = value
  }
}

export default RootStore
