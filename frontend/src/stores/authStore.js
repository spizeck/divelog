import { flow, makeAutoObservable } from 'mobx'
import api from '../utils/api'

class AuthStore {
  rootStore
  loggedIn = false
  token = null
  authStatus = 'idle' // 'idle' | 'pending' | 'error'
  errorMessage = ''

  constructor (rootStore) {
    this.rootStore = rootStore
    makeAutoObservable(this)
    this.token = localStorage.getItem('token') || null
    this.loggedIn = localStorage.getItem('loggedIn') === 'true' || false
  }

  login = flow(
    function* (username, password) {
      this.startAuthProcess()
      try {
        const response = username.includes('@')
          ? yield api.loginWithEmail(username, password)
          : yield api.loginWithUsername(username, password)

        if (response.status !== 200) {
          throw new Error(response.message)
        }

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
        const response = yield api.register(
          username,
          email,
          password,
          firstName,
          preferredUnits
        )
        if (response.status !== 201) {
          throw new Error(response.message)
        }
      } catch (error) {
        this.handleAuthError(error)
      } finally {
        this.endAuthProcess()
      }
    }.bind(this)
  )

  resetPassword = flow(
    function* (email) {
      this.startAuthProcess()
      try {
        const response = yield api.forgotPassword(email)
        if (response.status !== 200) {
          throw new Error(response.message)
        }
      } catch (error) {
        this.handleAuthError(error)
      } finally {
        this.endAuthProcess()
      }
    }.bind(this)
  )

  updateUser = flow(
    function* (token, userData) {
      this.startAuthProcess()
      try {
        const response = yield api.updateUser(token, userData)
        if (response.status !== 200) {
          throw new Error(response.message)
        }
      } catch (error) {
        this.handleAuthError(error)
      } finally {
        this.endAuthProcess()
      }
    }.bind(this)
  )

  startAuthProcess () {
    this.authStatus = 'pending'
  }

  endAuthProcess () {
    this.authStatus = 'idle'
  }

  handleSuccessfulLogin (response) {
    this.token = response.token
    this.loggedIn = true
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
    console.error('Auth error: ', error)
  }

  setErrorMessage (value) {
    this.errorMessage = value
  }
}

export default AuthStore
