import {flow, makeAutoObservable} from 'mobx'
import api from '../utils/api'

class AuthStore {
    rootStore
    loggedIn = false
    token = null

    constructor(rootStore) {
        this.rootStore = rootStore
        makeAutoObservable(this)
        this.token = localStorage.getItem('token') || null
    }

    // login function that accepts either a username or email
    login = flow(function* (username, password) {
        try {
            const response = yield api.login(username, password)
            if (response.data.status === 200) {
                this.setLoggedIn(true)
                this.setToken(response.data.token)
                localStorage.setItem('token', response.data.token)
            }
            return response.data
        } catch (error) {
            throw error
        }
    }
