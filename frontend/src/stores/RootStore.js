// stores/RootStore.js
import { makeAutoObservable } from 'mobx'
import UserStore from './userStore'
import AuthStore from './authStore'
import DiveStore from './diveStore'

class RootStore {
  userStore
  authStore
  diveStore

  constructor () {
    makeAutoObservable(this)
    this.userStore = new UserStore(this)
    this.authStore = new AuthStore(this)
    this.diveStore = new DiveStore(this)
  }
}

export default RootStore
