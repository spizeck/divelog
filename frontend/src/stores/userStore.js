import { flow, makeAutoObservable } from 'mobx'
import api from '../utils/api'

class UserStore {
  constructor (rootStore) {
    makeAutoObservable(this)
    this.rootStore = rootStore
    this.username = this.retrieveFromLocalStorage('username')
    this.firstName = this.retrieveFromLocalStorage('firstName')
    this.preferredUnits = this.retrieveFromLocalStorage('preferredUnits')
    this.approved = this.retrieveFromLocalStorage('approved') === 'true'
    this.admin = this.retrieveFromLocalStorage('admin') === 'true'
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
    console.log(error)
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
        this.status = 'idle'
        return
      }

      try {
        const response = yield api.getCurrentUser(
          this.rootStore.authStore.token
        )
        if (response.status === 200) {
          ;[
            'username',
            'firstName',
            'approved',
            'admin',
            'preferredUnits'
          ].forEach(key => {
            this.updateValue(key, response[key])
          })

          return response
        } else if (response.status === 401) {
          this.errorMessage = 'Unauthorized access. Please log in again.' // You can customize this message
          this.rootStore.authStore.logout()
          return response
        } else {
          this._errorHelper(new Error(response.message))
          return response
        }
      } catch (error) {
        if (error.message === '401') {
          this._errorHelper(
            new Error('Your session has expired. Please log in again.')
          )
          this.rootStore.authStore.logout()
          return
        } else {
          this._errorHelper(error)
          return error
        }
      }
    }.bind(this)
  )
}

export default UserStore
