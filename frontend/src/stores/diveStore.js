import { flow, makeAutoObservable } from 'mobx'
import api from '../utils/api'

class DiveStore {
  dives = []
  dive = {}
  loading = false
  error = null

  constructor (rootStore) {
    makeAutoObservable(this)
    this.rootStore = rootStore
  }

  fetchDivesByDate = flow(function* (startDate, endDate) {
    this.loading = true
    this.error = null
    try {
      const response = yield api.getDivesByDate(startDate, endDate)
      this.dives = response.data
    } catch (error) {
      this.error = error
    } finally {
      this.loading = false
    }
  })

  fetchSightingsForDive = flow(function* (diveId) {
    this.loading = true
    this.error = null
    try {
      const response = yield api.getSightingsForDive(diveId)
      const dive = this.dives.find(d => d.diveId === diveId)
      if (dive) {
        dive.sightings = response.data
      }
    } catch (error) {
      this.error = error
    } finally {
      this.loading = false
    }
  })

  saveDive = flow(function* (diveData) {
    this.loading = true
    this.error = null
    try {
      const response = yield api.createDive(diveData)
      this.dives.push(response.data)
      this.dive = response.data
      return response.data.diveId // Return the diveId after successfully creating a dive.
    } catch (error) {
      this.error = error
      throw error // Propagate the error so it can be caught in the component.
    } finally {
      this.loading = false
    }
  })

  saveSightings = flow(function* (sightingsData) {
    this.loading = true
    this.error = null
    try {
      const response = yield api.createSighting(sightingsData)
      if (this.dive.diveId === sightingsData.diveId) {
        this.dive.sightings.push(...response.data)
      }
    } catch (error) {
      this.error = error
      throw error
    } finally {
      this.loading = false
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
