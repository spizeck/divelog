const unitConverter = {
  convertDepthToForm: (depth, units) => {
    if (units === 'imperial') {
      return Math.round(parseFloat(depth, 10) * 3.28084)
    }
    return depth
  },
  convertDepthToDatabase: (depth, units) => {
    if (units === 'imperial') {
      return Math.round(parseFloat(depth, 10) / 3.28084)
    }
    console.log('Its metric already')
    return depth
  },
  convertTempToForm: (temp, units) => {
    if (units === 'imperial') {
      return Math.round((parseFloat(temp, 10) * 9) / 5 + 32)
    }
    return temp
  },
  convertTempToDatabase: (temp, units) => {
    if (units === 'imperial') {
      return Math.round(((parseFloat(temp, 10) - 32) * 5) / 9)
    }
    console.log('Its metric already')
    return temp
  }
}

export default unitConverter
