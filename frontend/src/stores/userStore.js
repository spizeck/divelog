import { makeAutoObservable } from 'mobx'

class UserStore {
  username = ''
  firstName = ''
  preferedUnits = ''

  constructor () {
    makeAutoObservable(this)
  }

  setUsername (value) {
    this.username = value
  }

  setFirstName (value) {
    this.firstName = value
  }

  setPreferedUnits (value) {
    this.preferedUnits = value
  }
}

export default UserStore
