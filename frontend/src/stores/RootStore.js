// stores/RootStore.js
import { makeAutoObservable } from 'mobx'
import UserStore from './userStore'
import AuthStore from './authStore'

class RootStore {
  userStore
  authStore

  constructor () {
    makeAutoObservable(this)
    this.userStore = new UserStore(this)
    this.authStore = new AuthStore(this)
  }
}

export default RootStore
