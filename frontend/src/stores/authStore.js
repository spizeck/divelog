import { flow, makeAutoObservable } from 'mobx'
import api from '../utils/api'

class AuthStore {
  rootStore
  loggedIn = false
  token = null
  authStatus = 'idle' // 'idle' | 'pending' | 'error'
  errorMessage = null
  logoutMessage = null
  loginMessage = null

  constructor (rootStore) {
    this.rootStore = rootStore
    makeAutoObservable(this)
    this.token = localStorage.getItem('token') || null
    this.loggedIn = localStorage.getItem('loggedIn') === 'true' || false
  }

  // private login helper function
  _loginHelper = response => {
    this.token = response.data.token
    this.loggedIn = true
    this.loginMessage = 'You have been successfully logged in'
    localStorage.setItem('token', this.token)
    localStorage.setItem('loggedIn', true)
    this.authStatus = 'idle'
  }

  // private logout helper function
  _logoutHelper = () => {
    this.token = null
    this.loggedIn = false
    this.logoutMessage = 'You have been successfully logged out'
    localStorage.removeItem('token')
    localStorage.removeItem('loggedIn')
    this.authStatus = 'idle'
  }

  // private error helper function
  _errorHelper = error => {
    this.authStatus = 'error'
    this.errorMessage = error.message
  }

  // private status helper function
  _startStatus () {
    this.authStatus = 'pending'
    this.errorMessage = null
  }

  // login function that accepts either a username or email
  login = flow(
    function* (username, password) {
      console.log("Starting login")
      this._startStatus()
      try {
        // Check if the username has an @ in it
        if (username.includes('@')) {
          const response = yield api.loginWithEmail(username, password)
          if (response.data.status === 200) {
            this._loginHelper(response)
          }
        } else {
          const response = yield api.loginWithUsername(username, password)
          if (response.data.status === 200) {
            this._loginHelper(response)
          }
        }
      } catch (error) {
        this._errorHelper(error)
      }
    }.bind(this)
  )

  // logout function
  logout = flow(
    function* () {
      this._startStatus()
      try {
        const response = yield api.logout()
        if (response.data.status === 200) {
          this._logoutHelper()
        }
      } catch (error) {
        this._errorHelper(error)
      }
    }.bind(this)
  )

  // register function that does not login the user after registering
  register = flow(
    function* (username, email, password, firstName, preferredUnits) {
      this._startStatus()
      try {
        const response = yield api.register(
          username,
          email,
          password,
          firstName,
          preferredUnits
        )
        if (response.data.status === 200) {
          this.authStatus = 'idle'
        }
      } catch (error) {
        this._errorHelper(error)
      }
    }.bind(this)
  )
}

export default AuthStore
