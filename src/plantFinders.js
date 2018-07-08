const {flatten, toArray, intersection, uniques} = require('./utils/arrays')
const {trim} = require('./utils/string')
const {pipe} = require('./utils/functions')

const matchingPlants = (allPlantsData, rootNames) => {
  return flatten(
    toArray(rootNames).map(rootName => {
      return allPlantsData
      .filter(plant => plant.name.toLowerCase() === rootName.toLowerCase())
    })
  )
}

const validatePlantNames = (allPlantsData, rootNames) => {
  const valid =  matchingPlants(allPlantsData, rootNames)
    .map(plantData => plantData.name)

  return {valid}
}

const matchingFriends = (allPlantsData, rootNames) => {
  return uniques(flatten(
    matchingPlants(allPlantsData, toArray(rootNames))
      .map(plant => plant.friends)
      .map(fiends => fiends.split(','))
  ))
  .filter(x => x !== '')
  .map(trim)
}

const matchingFiends = (allPlantsData, rootNames) => {
  return uniques(flatten(
    matchingPlants(allPlantsData, toArray(rootNames))
      .map(plant => plant.fiends)
      .map(fiends => fiends.split(','))
  ))
  .filter(x => x !== '')
  .map(trim)
}

const incompatibles = (allPlantsData, rootNames) => {
  return uniques(
    flatten(
      rootNames.map(plantName => {
        const fiends = matchingFiends(allPlantsData, plantName)
        return intersection(rootNames, fiends)
      })
    )
  )
}

const compatibles = (allPlantsData, rootNames) => {
  const incompatiblePlants = incompatibles(allPlantsData, rootNames)
  let remains = rootNames.filter(plantName => !incompatiblePlants.includes(plantName))
  return remains
}

const smartMatchingFriends = (allPlantsData, rootNames) => {
  rootNames = toArray(rootNames)
  // first we check the validity of the rootNames
  // rootNames = matchingPlants(allPlantsData, rootNames)
  // console.log('rootNames', rootNames, validatePlantNames(allPlantsData, rootNames))
  // first we eliminate mutually incompatible rootNames (inputs)
  const incompatiblePlants = incompatibles(allPlantsData, rootNames)
  // we find which of the rootNames are compatible with each other
  let remains = compatibles(allPlantsData, rootNames) // .filter(plantName => !incompatiblePlants.includes(plantName))

  // now we find the friends of all remaining plants
  const friends = matchingFriends(allPlantsData, remains)

  // now we look for incompatibilities of all the friends of the input plants
  let remainingFriends = compatibles(allPlantsData, friends)
  // and we also look for incompatibilities between the remaining friends with the initial inputs
  remainingFriends = compatibles(allPlantsData, [].concat(remainingFriends, rootNames))
  // an we remove the initial inputs
  remainingFriends = remainingFriends.filter(plantName => !rootNames.includes(plantName))

  // console.log('incompatiblePlants', incompatiblePlants, 'remains', remains,
  //  'friends', friends, 'incompatibleFriends', incompatibleFriends, 'remainingFriends', remainingFriends)

  return {
    remains,
    incompatiblePlants,
    friends: remainingFriends
  }
}

const allPlants = (allPlantsData) => allPlantsData.map(plant => plant.name)

module.exports = {
  matchingPlants,
  matchingFriends,
  matchingFiends,
  smartMatchingFriends,
  allPlants
}
