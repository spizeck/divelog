import { flow, makeAutoObservable } from 'mobx'
import api from '../utils/api'

class DiveStore {
  errorMessage = null
  successMessage = null
  diveProcessStatus = 'idle'
  dives = []
  dive = {}
  currentPage = 1
  totalPages = 0
  perPage = 10

  constructor (rootStore) {
    makeAutoObservable(this)
    this.rootStore = rootStore
    this.dives = []
    this.dive = {}
    this.currentPage = 1
    this.totalPages = 0
    this.perPage = 10
  }

  _startDiveProcess () {
    this.diveProcessStatus = 'pending'
    this.errorMessage = null
    this.successMessage = null
  }

  _endDiveProcess () {
    this.diveProcessStatus = 'idle'
  }

  _handleDiveProcessError (error) {
    this.diveProcessStatus = 'error'
    this.errorMessage = error.message
  }

  fetchDivesByGuide = flow(function* (diveGuide, page = 1) {
    this._startDiveProcess()
    try {
      const response = yield api.getDivesByGuide(diveGuide, page)
      const { dives, totalCount, perPage, currentPage } = response
      this.dives = dives
      this.totalPages = Math.ceil(totalCount / perPage)
      this.currentPage = currentPage
      this.perPage = perPage
    } catch (error) {
      this._handleDiveProcessError(error)
    } finally {
      this._endDiveProcess()
    }
  }.bind(this))

  fetchDivesByDate = flow(function* (startDate, endDate) {
    this._startDiveProcess()
    try {
      const response = yield api.getDivesByDate(startDate, endDate)
      this.dives = response.data
    } catch (error) {
      this._handleDiveProcessError(error)
    } finally {
      this._endDiveProcess()
    }
  }.bind(this))

  fetchSightingsForDive = flow(function* (diveId) {
    this._startDiveProcess()
    try {
      const response = yield api.getSightingsForDive(diveId)
      const dive = this.dives.find(d => d.diveId === diveId)
      if (dive) {
        dive.sightings = response.data
      }
    } catch (error) {
      this._handleDiveProcessError(error)
    } finally {
      this._endDiveProcess()
    }
  }.bind(this))

  saveDive = flow(function* (diveData) {
    this._startDiveProcess()
    try {
      const response = yield api.createDive(diveData)
      this.dives.push(response.data)
      this.dive = response.data
      return response.data.diveId // Return the diveId after successfully creating a dive.
    } catch (error) {
      this._handleDiveProcessError(error)
    } finally {
      this._endDiveProcess()
    }
  }.bind(this))

  saveSightings = flow(function* (sightingsData) {
    this._startDiveProcess()
    try {
      const response = yield api.createSighting(sightingsData)
      if (this.dive.diveId === sightingsData.diveId) {
        this.dive.sightings.push(...response.data)
      }
    } catch (error) {
      this._handleDiveProcessError(error)
    } finally {
      this._endDiveProcess()
    }
  }.bind(this))

  editDive = flow(function* (diveId, diveData) {
    this._startDiveProcess()
    try {
      const response = yield api.updateDive(diveId, diveData)
      if (response.status === 200) {
        this.successMessage =
          response.data.message || 'Dive updated successfully'
      }
    } catch (error) {
      this._handleDiveProcessError(error)
    } finally {
      this._endDiveProcess()
    }
  }.bind(this))

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