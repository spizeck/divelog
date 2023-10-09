import { flow, makeAutoObservable, runInAction } from 'mobx'
import api from '../utils/api'

class DiveStore {

  constructor (rootStore) {
    makeAutoObservable(this)
    this.rootStore = rootStore
    this.errorMessage = null
    this.successMessage = null
    this.dives = []
    this.dive = {}
    this.dataToVisualize = []
    this.totalPages = 1
    this.diveGuides = []
    this.sightingsModalOpen = false
    this.editSightings = false
    this.showConfirmation = false
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

  openSightingsModal = () => {
    runInAction(() => {
      this.sightingsModalOpen = true
    })
  }

  closeSightingsModal = () => {
    runInAction(() => {
      this.sightingsModalOpen = false
    })
  }

  openEditSightingsModal = () => {
    runInAction(() => {
      this.editSightings = true
    })
  }

  closeEditSightingsModal = () => {
    runInAction(() => {
      this.editSightings = false
    })
  }

  openConfirmationModal = () => {
    runInAction(() => {
      this.showConfirmation = true
    })
  }

  closeConfirmationModal = () => {
    runInAction(() => {
      this.showConfirmation = false
    })
  }

  fetchDivesByGuide = flow(
    function* (diveGuide, page = 1, entriesPerPage = 10) {
      this._startDiveProcess()
      try {
        const response = yield api.getDivesByGuide(
          diveGuide,
          page,
          entriesPerPage
        )
        const { dives, totalPages } = response
        this.dives = dives
        this.totalPages = totalPages
      } catch (error) {
        this._handleDiveProcessError(error)
      } finally {
        this._endDiveProcess()
      }
    }.bind(this)
  )

  fetchDivesByDate = flow(
    function* (startDate, endDate) {
      this._startDiveProcess()
      try {
        const response = yield api.getDivesByDate(startDate, endDate)
        this.dataToVisualize = response
      } catch (error) {
        this._handleDiveProcessError(error)
      } finally {
        this._endDiveProcess()
      }
    }.bind(this)
  )

  fetchSightingsForDive = flow(
    function* (diveId) {
      this._startDiveProcess()
      try {
        const response = yield api.getSightingsForDive(diveId)
        const dive = this.dives.find(d => d.id === diveId)
        if (dive) {
          dive.sightings = response.sightings
        }
      } catch (error) {
        this._handleDiveProcessError(error)
      } finally {
        this._endDiveProcess()
      }
    }.bind(this)
  )

  saveDive = flow(
    function* (diveData) {
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
    }.bind(this)
  )

  saveSightings = flow(
    function* (sightingsData, diveId) {
      this._startDiveProcess()
      try {
        const response = yield api.createSighting({ sightings: sightingsData })
        if (this.dive.diveId === diveId) {
          this.dive.sightings.push(...response.data)
        }
      } catch (error) {
        this._handleDiveProcessError(error)
      } finally {
        this._endDiveProcess()
      }
    }.bind(this)
  )

  editDive = flow(
    function* (diveData) {
      this._startDiveProcess()
      try {
        const response = yield api.editDive(diveData)
        if (response.status === 200) {
          this.successMessage =
            response.data.message || 'Dive updated successfully'
        }
      } catch (error) {
        this._handleDiveProcessError(error)
      } finally {
        this._endDiveProcess()
      }
    }.bind(this)
  )

  deleteDive = flow(
    function* (diveId) {
      this._startDiveProcess()
      try {
        const response = yield api.deleteDive(diveId)
        if (response.status === 200) {
          this.successMessage =
            response.data.message || 'Dive deleted successfully'
        }
      } catch (error) {
        this._handleDiveProcessError(error)
      } finally {
        this._endDiveProcess()
      }
    }.bind(this)
  )

  getUniqueDiveGuides = flow(
    function* () {
      this._startDiveProcess()
      try {
        const response = yield api.getUniqueDiveGuides()
        this.diveGuides = response.diveGuides
      } catch (error) {
        this._handleDiveProcessError(error)
      } finally {
        this._endDiveProcess()
      }
    }.bind(this)
  )

  fetchFilteredDives = flow(
    function* (filters, page = 1, entriesPerPage = 10) {
      this._startDiveProcess()
      try {
        const response = yield api.getFilteredDives(
          filters,
          page,
          entriesPerPage
        )
        const { dives, totalPages } = response
        this.dives = dives
        this.totalPages = totalPages
      } catch (error) {
        this._handleDiveProcessError(error)
      } finally {
        this._endDiveProcess()
      }
    }.bind(this)
  )

  updateSightings = flow(
    function* (sightingsData, diveId) {
      this._startDiveProcess()
      try {
        const response = yield api.updateSightings(sightingsData, diveId)
        this.successMessage =
          response.message || 'Sightings updated successfully'
        yield new Promise(resolve => setTimeout(resolve, 2000))
        this.closeConfirmationModal()
        this.closeEditSightingsModal()
        this.closeSightingsModal()
      } catch (error) {
        this._handleDiveProcessError(error)
      } finally {
        this._endDiveProcess()
      }
    }.bind(this)
  )

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
