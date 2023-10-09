import { flow, makeAutoObservable } from 'mobx'
import api from '../utils/api'

class UserStore {
  username = ''
  firstName = ''
  preferredUnits = ''
  approved = false
  admin = false
  email = ''
  userStatus = 'idle' // 'idle' | 'pending' | 'error'
  errorMessage = ''

  constructor (rootStore) {
    makeAutoObservable(this)
    this.rootStore = rootStore
    this.username = this.retrieveFromLocalStorage('username')
    this.firstName = this.retrieveFromLocalStorage('firstName')
    this.preferredUnits = this.retrieveFromLocalStorage('preferredUnits')
    this.approved = this.retrieveFromLocalStorage('approved') === 'true'
    this.admin = this.retrieveFromLocalStorage('admin') === 'true'
    this.email = this.retrieveFromLocalStorage('email')
    this.userStatus = 'idle' // 'idle' | 'pending' | 'error'
    this.errorMessage = ''
  }

  retrieveFromLocalStorage (key) {
    return localStorage.getItem(key) || ''
  }

  updateLocalStorage (key, value) {
    localStorage.setItem(key, value)
  }

  clearUserData () {
    localStorage.clear()
  }

  _startStatus () {
    this.userStatus = 'pending'
  }

  _errorHelper (error) {
    this.userStatus = 'error'
    console.error('User error:', error)
  }

  updateValue (key, value) {
    this[key] = value
    this.updateLocalStorage(key, value)
  }

  setErrorMessage (value) {
    this.errorMessage = value
  }

  fetchUserData = flow(
    function* () {
      this._startStatus()
      if (!this.rootStore.authStore.token) {
        this.userStatus = 'idle'
        return
      }

      try {
        const response = yield api.getCurrentUser(
          this.rootStore.authStore.token
        )
        ;[
          'username',
          'firstName',
          'approved',
          'admin',
          'preferredUnits',
          'email'
        ].forEach(key => {
          this.updateValue(key, response[key])
        })
      } catch (error) {
        if (
          error.message.includes('401') ||
          error.message.includes('Unauthorized')
        ) {
          this._errorHelper(
            new Error('Your session has expired. Please log in again.')
          )
          this.rootStore.authStore.logout()
        } else {
          this._errorHelper(error)
        }
      } finally {
        this.userStatus = 'idle'
      }
    }.bind(this)
  )
}

export default UserStore
