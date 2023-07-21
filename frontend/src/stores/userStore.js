import { flow, makeAutoObservable } from 'mobx'
import api from '../utils/api'

class UserStore {
  rootStore
  username = localStorage.getItem('username') || ""
  firstName = localStorage.getItem('firstName') || ""
  preferedUnits = localStorage.getItem('preferedUnits') || ""
  approved = localStorage.getItem('approved') === 'true' || false
  admin = localStorage.getItem('admin') === 'true' || false
  userStatus = 'idle' // 'idle' | 'pending' | 'error'
  errorMessage = null

  constructor (rootStore) {
    this.rootStore = rootStore
    makeAutoObservable(this)
  }

  // private error helper function
  _errorHelper = error => {
    this.userStatus = 'error'
    this.errorMessage = error.message
  }

  // private status helper function
  _startStatus = () => {
    this.userStatus = 'pending'
    this.errorMessage = null
  }

  // Setters
  setUsername (value) {
    this.username = value
    localStorage.setItem('username', value)
  }

  setFirstName (value) {
    this.firstName = value
    localStorage.setItem('firstName', value)
  }

  setPreferedUnits (value) {
    this.preferedUnits = value
    localStorage.setItem('preferedUnits', value)
  }

  setApproved (value) {
    this.approved = value
    localStorage.setItem('approved', value)
  }

  setAdmin (value) {
    this.admin = value
    localStorage.setItem('admin', value)
  }

  // Fetch user data from the API and update the store if the Token is valid
  fetchUserData = flow(function* () {
    this._startStatus()
    try {
      const response = yield api.getUserData(this.rootStore.authStore.token)
      if (response.data.status === 200) {
        this.setUsername(response.username)
        this.setFirstName(response.firstName)
        this.setApproved(response.approved)
        this.setAdmin(response.admin)
        this.setPreferedUnits(response.preferredUnits)
        return response
      } else if (response.status === 401) {
        this._errorHelper(new Error("Your session has expired. Please log in again."))
        this.rootStore.authStore.logout()
        return response
      } else {
        this._errorHelper(new Error(response.message))
        return response
      }
    } catch (error) {
      this._errorHelper(error)
      return error
    }
  }.bind(this))
}

export default UserStore
