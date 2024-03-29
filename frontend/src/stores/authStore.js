import { flow, makeAutoObservable } from 'mobx'
import api from '../utils/api'

class AuthStore {
  token = null
  loggedIn = false
  loginMessage = ''
  errorMessage = ''

  constructor (rootStore) {
    this.rootStore = rootStore
    makeAutoObservable(this)
    this.token = localStorage.getItem('token') || null
    this.loggedIn = localStorage.getItem('loggedIn') === 'true' || false
    this.loginMessage = ''
    this.errorMessage = ''
  }

  login = flow(
    function* (username, password) {
      this.startAuthProcess()
      try {
        const response = username.includes('@')
          ? yield api.loginWithEmail(username, password)
          : yield api.loginWithUsername(username, password)
        this.handleSuccessfulLogin(response)
        yield this.fetchUserData()
      } catch (error) {
        this.handleAuthError(error)
      } finally {
        this.endAuthProcess()
      }
    }.bind(this)
  )

  logout = flow(
    function* () {
      this.startAuthProcess()
      try {
        const response = yield api.logout()
        if (response.status === 200) {
          this.handleSuccessfulLogout()
        } else {
          throw new Error(response.message)
        }
      } catch (error) {
        this.handleAuthError(error)
      } finally {
        this.endAuthProcess()
      }
    }.bind(this)
  )

  register = flow(
    function* (username, email, password, firstName, preferredUnits) {
      this.startAuthProcess()
      try {
        yield api.register(username, email, password, firstName, preferredUnits)
      } catch (error) {
        this.handleAuthError(error)
        throw error
      } finally {
        this.endAuthProcess()
      }
    }.bind(this)
  )

  forgotPassword = flow(
    function* (email) {
      this.startAuthProcess()
      try {
        return yield api.forgotPassword(email);
      } catch (error) {
        this.handleAuthError(error)
      } finally {
        this.endAuthProcess()
      }
    }.bind(this)
  )

  updateUser = flow(
    function* (userData) {
      this.startAuthProcess()
      try {
        yield api.updateUser(userData)
      } catch (error) {
        this.handleAuthError(error)
      } finally {
        this.endAuthProcess()
      }
    }.bind(this)
  )

  changePassword = flow(
    function* (token, newPassword) {
      this.startAuthProcess()
      try {
        return yield api.resetPassword(token, newPassword)
      } catch (error) {
        this.handleAuthError(error)
      } finally {
        this.endAuthProcess()
      }
    }.bind(this)
  )

  startAuthProcess () {
    this.authStatus = 'pending'
    this.loginMessage = ''
    this.errorMessage = ''
  }

  endAuthProcess () {
    this.authStatus = 'idle'
  }

  handleSuccessfulLogin (response) {
    this.token = response.token
    this.loggedIn = true
    this.loginMessage = response.message
    this.errorMessage = null
    localStorage.setItem('token', this.token)
    localStorage.setItem('loggedIn', true)
  }

  handleSuccessfulLogout () {
    this.token = null
    this.loggedIn = false
    localStorage.clear()
  }

  async fetchUserData () {
    try {
      await this.rootStore.userStore.fetchUserData()
    } catch (error) {
      console.error('Failed to fetch user data after login', error)
    }
  }

  handleAuthError (error) {
    this.authStatus = 'error'
    this.errorMessage = error.message
  }

  setErrorMessage (value) {
    this.errorMessage = value
  }
}

export default AuthStore
