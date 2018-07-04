/* converts input data to array if it is not already an array */
const toArray = data => {
  if (!data) return []
  if (data.constructor !== Array) return [data]
  return data
}

const head = (array) => {
  if (array === undefined || null) {
    return undefined
  }
  if (array.length === 0) {
    return undefined
  }
  return array[0]
}

const flatten = list => list.reduce(
  (a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []
)

// helper function to retrieve the nth element of an array
const nth = (index, data) => {
  if (!data) {
    return undefined
  }
  if (data.length < index) {
    return undefined
  }
  return data[index]
}

const intersection = (array1, array2) => {
  let a = new Set(array1)
  let b = new Set(array2)
  let intersection = new Set(
    [...a].filter(x => b.has(x)))
  return Array.from(intersection)
  // array1.filter(element => array2.includes(element))
}

const uniques = array => Array.from(new Set(array))

module.exports = {toArray, head, flatten, nth, intersection, uniques}
