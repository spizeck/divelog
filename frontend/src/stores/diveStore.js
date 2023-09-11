import { flow, makeAutoObservable } from 'mobx'
import api from '../utils/api'

class DiveStore {
  constructor (rootStore) {
    makeAutoObservable(this)
    this.rootStore = rootStore
    this.dives = []
    this.dive = {}
    this.error = null
    this.currentPage = 1
    this.totalPages = 0
    this.perPage = 10
  }

  fetchDivesByGuide = flow(function* (diveGuide, page=1) {
    console.log('fetchDivesByGuide', diveGuide, page)
    try {
      const response = yield api.getDivesByGuide(diveGuide, page)
      const { dives, totalCount, perPage, currentPage } = response.data
      this.dives = dives
      this.totalPages = Math.ceil(totalCount / perPage)
      this.currentPage = currentPage
      this.perPage = perPage
    } catch (error) {
      this.error = error
    }
  })

  fetchDivesByDate = flow(function* (startDate, endDate) {
    this.error = null
    try {
      const response = yield api.getDivesByDate(startDate, endDate)
      this.dives = response.data
    } catch (error) {
      this.error = error
    }
  })

  fetchSightingsForDive = flow(function* (diveId) {
    this.error = null
    try {
      const response = yield api.getSightingsForDive(diveId)
      const dive = this.dives.find(d => d.diveId === diveId)
      if (dive) {
        dive.sightings = response.data
      }
    } catch (error) {
      this.error = error
    }
  })

  saveDive = flow(function* (diveData) {
    this.error = null
    try {
      const response = yield api.createDive(diveData)
      this.dives.push(response.data)
      this.dive = response.data
      return response.data.diveId // Return the diveId after successfully creating a dive.
    } catch (error) {
      this.error = error
      throw error // Propagate the error so it can be caught in the component.
    }
  })

  saveSightings = flow(function* (sightingsData) {
    this.error = null
    try {
      const response = yield api.createSighting(sightingsData)
      if (this.dive.diveId === sightingsData.diveId) {
        this.dive.sightings.push(...response.data)
      }
    } catch (error) {
      this.error = error
      throw error
    }
  })

  selectDive (diveId) {
    const dive = this.dives.find(d => d.diveId === diveId)
    if (dive) {
      this.dive = dive
    } else {
      this.error = 'Dive not found'
    }
  }
}

export default DiveStore
