const program = require('commander')
const fs = require('fs')
const chalk = require('chalk')
const parseCSV = require('csv-parse/lib/sync')

const {flatten, toArray, intersection, uniques} = require('./utils/arrays')
const {trim} = require('./utils/string')
const {pipe} = require('./utils/functions')

// get raw data
const rawData = fs.readFileSync('./data/assoc-plants1.csv')
const parsed = parseCSV(rawData, {delimiter: ';', columns: true})
// objname: 'nom',
// raw: true

const matchingPlants = rootNames => {
  return flatten(
    toArray(rootNames).map(rootName => {
      return parsed
      .filter(plant => plant.name.toLowerCase() === rootName.toLowerCase())
    })
  )
}

const matchingFriends = rootNames => {
  return uniques(flatten(
    matchingPlants(toArray(rootNames))
      .map(plant => plant.friends)
      .map(fiends => fiends.split(','))
  ))
  .filter(x => x !== '')
  .map(trim)
}

const matchingFiends = rootNames => {
  return uniques(flatten(
    matchingPlants(toArray(rootNames))
      .map(plant => plant.fiends)
      .map(fiends => fiends.split(','))
  ))
  .filter(x => x !== '')
  .map(trim)
}

const incompatibles = rootNames => {
  return uniques(
    flatten(
      rootNames.map(plantName => {
        const fiends = matchingFiends(plantName)
        return intersection(rootNames, fiends)
      })
    )
  )
}

const compatibles = rootNames => {
  const incompatiblePlants = incompatibles(rootNames)
  let remains = rootNames.filter(plantName => !incompatiblePlants.includes(plantName))
  return remains
}

const smartMatchingFriends = rootNames => {
  // console.log('rootNames', rootNames)
  // first we eliminate mutually incompatible rootNames (inputs)
  const incompatiblePlants = incompatibles(rootNames)
  // we find which of the rootNames are compatible with each other
  let remains = compatibles(rootNames) // .filter(plantName => !incompatiblePlants.includes(plantName))

  // now we find the friends of all remaining plants
  const friends = matchingFriends(remains)

  // now we look for incompatibilities of all the friends of the input plants
  let incompatibleFriends = incompatibles(friends)
  let remainingFriends = compatibles(friends)
  // and we also look for incompatibilities between the remaining friends with the initial inputs
  remainingFriends = compatibles([].concat(remainingFriends, rootNames))
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

program
  .version('0.1.0')
  .usage('[options] <file ...>')

program
  .command('list-plants') // sub-command name, coffeeType = type, required
  .action(function (coffeeType, args) {
    console.log('parsed', parsed.map(plant => plant.name))
    // const plantNames =
    // console.log('parsed', parsed[0])
  })

program
  .command('friend [names...]') // sub-command friend, name, required
  .action(function (rootNames, args) {
    const {incompatiblePlants, friends, remains} = smartMatchingFriends(rootNames)
    const inputsStr = remains.join(' ')
    if (incompatiblePlants.length > 0) {
      console.log(`${chalk.bold.red('incompatible plants !!! : ')}`)
      console.log(`${chalk.red('  ' + incompatiblePlants.join(' '))}`)
    }
    if (friends.length === 0) {
      console.log(`${chalk.bold.red('no results found for ' + rootNames.join(' '))}`)
    } else {
      console.log(`${chalk.bold.magenta('compatible plants: with')} ${chalk.bold.green(inputsStr)}`)
      console.log(`  ${chalk.magenta(friends.join(' '))}`)
    }
    // const plantNames =
    // console.log('parsed', parsed[0])
  })

/* const mode = 'nice'

if (mode === 'nice') {
  console.log('parsed', parsed[0])
} */

program.parse(process.argv)
