const program = require('commander')
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const clear = require('clear')

const parseCSV = require('csv-parse/lib/sync')
const fuzzy = require('fuzzy')

const inquirer = require('inquirer')
inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'))

const {allPlants, smartMatchingFriends} = require('./plantFinders')

let allPlantDataSources = []
let allPlantsData
// actions
const importPlantsData = (filePaths) => {
  filePaths = filePaths.split(',')
    .map(filePath => path.resolve(filePath))
  
  console.log('importPlantsData', filePaths)
  allPlantDataSources = filePaths.map(filePath => {
    //'./data/assoc-plants1.csv'
    const rawData = fs.readFileSync(filePath)
    allPlantsData = parseCSV(rawData, {delimiter: ';', columns: true}) 
    return allPlantsData
  })
  
}
const listPlants = () => console.log(chalk.green(allPlants(allPlantsData).join('\n')))
const findFriend = (rootNames) => {
  const {incompatiblePlants, friends, remains} = smartMatchingFriends(allPlantsData, rootNames)
  const inputsStr = remains.join(' ')
  if (incompatiblePlants.length > 0) {
    console.log(`${chalk.bold.red('incompatible plants !!! : ')}`)
    console.log(`${chalk.red('  ' + incompatiblePlants.join(' '))}`)
  }
  if (friends.length === 0) {
    console.log(`${chalk.bold.red('no results found for ' + rootNames.join('\n  '))}`)
  } else {
    console.log(`${chalk.bold.magenta('compatible plants: with')} ${chalk.bold.green(inputsStr)}`)
    console.log(`  ${chalk.magenta(friends.join('\n  '))}`)
  }
}

program
  .version('0.0.1')
  .usage('[options] <file ...>')
  .option('-f, --filePaths, <filePaths...>', 'list of filepaths to import data from', importPlantsData)

program
  .command('list', listPlants) // sub-command name
  .description('list all known plants')
  .action(listPlants)

program
  .command('friend <plantNames...>') // sub-command friend, plantNames are required
  .description('find companion plants for the given plants')//, findFriend)
  .action(findFriend)

/*program
  .action((actionName, a, ...rootNames)=> {
    const actions = {
      list: listPlants,
      friend: findFriend
    }
    console.log('rootam',a,  rootNames)
    actions[actionName](rootNames)
    
  })
  .action(function (actionName, rootNames, args) {
  })*/
program.parse(process.argv)
console.log('program.filePaths', program.filePaths)

return 

const searchPlant = (answers, input) => {
  input = input || ''
  return new Promise(function (resolve) {
    const fuzzyResult = fuzzy.filter(input, allPlantsData.map(plant => plant.name))
    resolve(fuzzyResult.map(function (el) {
      return el.original
    }))
  })
}

let plantNames = []
function askForPlant (callback) {
  const questions = [
    {
      type: 'autocomplete',
      name: 'plantName',
      message: 'type a plant name',
      suggestOnly: true,
      source: searchPlant,
      when: function (answers) {
        return answers.listOperation === 'fiend friend plants'
      }
    }
  ]
  inquirer.prompt(questions).then(answ => {
    console.log('bla bla', answ)
    plantNames.push(answ.plantName)

    clear()
    if (answ.plantName !== '') {
      askForPlant(() => {
        callback()
      })
    } else {
      console.log('all done', plantNames)
      callback()
    }
  })
}

const mainMenu = (callback) => {
  const questions = [
    {
      type: 'list',
      name: 'listOperation',
      message: 'Choose what you want to do ',
      choices: ['list plants', 'fiend friend plants']
    }
  ]
  inquirer
    .prompt(questions)
    .then(function (answers) {
      clear()
      console.log('answers', answers, answers.listOperation)
      if (answers.listOperation === 'list plants') {
        listPlants()
        mainMenu()
      } else {
        askForPlant()
        // console.log(smartMatchingFriends(answers['plant-name']))
      }
      // console.log(answers)
      // console.log(answers['plant-name'])
    })
}

// mainMenu()
