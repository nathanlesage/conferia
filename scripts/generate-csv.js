// This file can generate a CSV file with a schedule and fake data.
import fs from 'fs'
import path from 'path'
import { DateTime } from 'luxon'

/**
 * Contains the directory to our data files
 *
 * @var {string}
 */
const DATADIR = path.join(import.meta.dirname, './data')

/**
 * Generates the path for a data/resource file
 *
 * @param   {string}  filename  The resource file
 *
 * @return  {string}            The absolute path to the file
 */
function resourceFile (filename) {
  return path.join(DATADIR, filename)
}

/**
 * Loads a data file. Expects the contents to be UTF-8 strings
 *
 * @param   {string}    filename  The filename
 *
 * @return  {string[]}            The data
 */
function loadDataFile (filename) {
  return fs.readFileSync(resourceFile(filename), 'utf-8')
}

/**
 * Loads Lorem Ipsum and returns it as a list of sentences without the trailing
 * dot (this way you can add it back only where you need it).
 *
 * @return  {string[]}  The sentences
 */
function loadLoremIpsumSentences () {
  const lorem = loadDataFile('lorem_ipsum.txt')
  const paragraphs = lorem.split('\n\n').map(para => para.split('\n').join(' '))
  const sentences = paragraphs.flatMap(para => para.split('. '))

  return sentences
}

/**
 * Returns a list of first names for generating fake names
 *
 * @return  {string[]}  The first names
 */
function loadFirstNames () {
  return loadDataFile('first_names_us.txt').split(/[\r\n]+/)
}

/**
 * Returns a list of last names for generating fake named
 *
 * @return  {string[]}  The last names
 */
function loadLastNames () {
  return loadDataFile('last_names_us.txt').split(/[\r\n]+/)
}

/**
 * Generates a fake author name
 *
 * @param   {string[]}  firstNames  The first names
 * @param   {string[]}  lastNames   The last names
 *
 * @return  {string}              The generated name
 */
function generateAuthorName (firstNames, lastNames) {
  const generateMiddleName = Math.random() > 0.9 // 10% chance to generate a middle name

  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
  const middleName = firstNames[Math.floor(Math.random() * firstNames.length)]
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]

  return generateMiddleName
    ? `${firstName} ${middleName} ${lastName}`
    : `${firstName} ${lastName}`
}

/**
 * Generates a title for an event
 *
 * @param   {string[]}  corpus     A corpus of sentences
 * @param   {number}    minLength  The minimum length of the title, default 3
 * @param   {number}    maxLength  The max length of the title, default 10
 *
 * @return  {string}               A title
 */
function generateTitle (corpus, minLength = 3, maxLength = 10) {
  const candidates = corpus
    .map(sentence => sentence.split(/\s+/))
    .filter(wordList => wordList.length >= minLength && wordList.length <= maxLength)

  return candidates[Math.floor(Math.random() * candidates.length)].join(' ')
}

/**
 * Generates a random room number/name in the form AB12 (two letters, two digits)
 *
 * @return  {string}  The room number
 */
function generateRoomName () {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  const idxA = Math.floor(Math.random() * 26)
  const idxB = Math.floor(Math.random() * 26)
  const numA = Math.floor(Math.random() * 10)
  const numB = Math.floor(Math.random() * 10)

  return `${letters[idxA]}${idxB}${numA}${numB}`
}

/**
 * Generates an abstract for an event
 *
 * @param   {string[]}  corpus     A corpus of sentences
 * @param   {number}    minLength  The minimum length of the title, default 3
 * @param   {number}    maxLength  The max length of the title, default 10
 *
 * @return  {string}               An abstract
 */
function generateAbstract (corpus, minLength = 50, maxLength = 250) {
  if (minLength < 10) {
    console.warn("Cannot generate abstract with less than 10 words.")
    minLength = 10
  }

  if (maxLength < minLength) {
    console.warn("Cannot generate abstract if maxLength is less than minLength")
    maxLength = minLength + 10
  }

  const range = maxLength - minLength
  const targetWordCount = Math.floor(Math.random() * range)

  const wordLists = corpus.map(sent => sent.split(/\s+/))

  const abstract = []
  while (abstract.length < targetWordCount) {
    const nextSent = wordLists[Math.floor(Math.random() * wordLists.length)]
    abstract.push(...nextSent)
  }

  return abstract.join(' ')
}

/**
 * Generates a single presentation
 *
 * @param   {DateTime}  dateStart   The start date
 * @param   {DateTime}  dateEnd     The end date
 * @param   {string}    session     The session title
 * @param   {number}    order       The presentation order
 * @param   {string}    location    The location
 * @param   {string[]}  corpus      The sentence corpus
 * @param   {string[]}  firstNames  The first name corpus
 * @param   {string[]}  lastNames   The last name corpus
 *
 * @return  {CSVRecord}              The presentation record
 */
function generatePresentation (dateStart, dateEnd, session, order, location, corpus, firstNames, lastNames) {
  const authorCount = Math.floor(Math.random() * 5) + 1

  const authors = [
    generateAuthorName(firstNames, lastNames),
    generateAuthorName(firstNames, lastNames),
    generateAuthorName(firstNames, lastNames),
    generateAuthorName(firstNames, lastNames),
    generateAuthorName(firstNames, lastNames)
  ].slice(0, authorCount)

  return {
    id: 'TODO',
    type: 'session_presentation',
    dateStart, dateEnd, session, location,
    title: generateTitle(corpus),
    abstract: generateAbstract(corpus, 50, 150),
    author: authors.join(', '),
    sessionOrder: order
  }
}

/**
 * Generates a session
 *
 * @param   {DateTime}  dateStart   The start date
 * @param   {DateTime}  dateEnd     The end date
 * @param   {string[]}  corpus      The sentence corpus
 * @param   {string[]}  firstNames  The first name corpus
 * @param   {string[]}  lastNames   The last name corpus
 * @param   {number}    presentationcount The number of presentations to generate
 *
 * @return  {CSVRecord}              The presentation record
 */
function generateSession (dateStart, dateEnd, corpus, firstNames, lastNames, presentationCount = 4) {
  if (presentationCount < 1) {
    console.warn("Cannot generate a session with less than 1 presentation. Setting to 1")
    presentationCount = 1
  }

  const sessionTitle = generateTitle(corpus)
  const location = generateRoomName()
  const presentations = [
    generatePresentation(dateStart, dateEnd, sessionTitle, 1, location, corpus, firstNames, lastNames),
    generatePresentation(dateStart, dateEnd, sessionTitle, 2, location, corpus, firstNames, lastNames),
    generatePresentation(dateStart, dateEnd, sessionTitle, 3, location, corpus, firstNames, lastNames),
    generatePresentation(dateStart, dateEnd, sessionTitle, 4, location, corpus, firstNames, lastNames),
    generatePresentation(dateStart, dateEnd, sessionTitle, 5, location, corpus, firstNames, lastNames),
    generatePresentation(dateStart, dateEnd, sessionTitle, 6, location, corpus, firstNames, lastNames),
    generatePresentation(dateStart, dateEnd, sessionTitle, 7, location, corpus, firstNames, lastNames),
    generatePresentation(dateStart, dateEnd, sessionTitle, 8, location, corpus, firstNames, lastNames),
  ].slice(0, Math.min(8, presentationCount))

  return {
    id: 'TODO',
    type: 'session',
    dateStart, dateEnd, location,
    title: sessionTitle,
    presentations
  }
}

/**
 * Generates a single keynote
 *
 * @param   {DateTime}  dateStart  The start date
 * @param   {DateTime}  dateEnd    The end date
 * @param   {string[]}  corpus     The sentence corpus
 *
 * @return  {CSVRecord}            The event record
 */
function generateKeynote (dateStart, dateEnd, corpus) {
  return {
    id: 'TODO',
    type: 'keynote',
    dateStart, dateEnd,
    location: generateRoomName(),
    abstract: generateAbstract(corpus),
    author: generateAuthorName(firstNames, lastNames)
  }
}

/**
 * Generates coffee breaks programmatically
 *
 * @param   {DateTime}     firstDate     The first day to generate coffee breaks for
 * @param   {DateTime}     lastDate      The last day to generate coffee breaks for
 * @param   {number}       breaksPerDay  The number of breaks per day, default 2
 *
 * @return  {CSVRecord[]}                The list of break records
 */
function generateCoffeeBreaks (firstDate, lastDate, breaksPerDay = 2) {
  const dayCount = lastDate.diff(firstDate).as('day')

  if (breaks > 3) {
    console.warn("Cannot generate more than three breaks per day. Setting to 3.")
    breaks = 3
  }

  const breakHours = [
    [14], // One break per day
    [10, 15], // Two breaks per day
    [10, 13, 16] // Three breaks per day
  ][breaksPerDay - 1]

  const breaks = []
  let today = firstDate
  for (let i = 0; i < dayCount; i++) {
    for (const hour of breakHours) {
      const breakTimeStart = today.set({ hour, minute: 0, second: 0 })
      const breakTimeEnd = breakTimeStart.plus({ minute: 30 })
      breaks.push({
        // TODO
      })
    }
    today = today.plus({ day: 1 })
  }

  return breaks
}

/**
 * Generates lunch breaks between firstDate and lastDate, at the provided hour
 * and minute.
 *
 * @param   {DateTime}     firstDate  The first day of the conference
 * @param   {DateTime}     lastDate   The last day of the conference
 * @param   {number}       hour       The hour (24h format)
 * @param   {number}       minute     The minute
 *
 * @return  {CSVRecord[]}             The lunch breaks
 */
function generateLunchBreaks (firstDate, lastDate, hour = 12, minute = 0) {}
function generateWorkshops () {}

console.log('Generating fake CSV...')
// Load the data
const corpus = loadLoremIpsumSentences()
const firstNames = loadFirstNames()
const lastNames = loadLastNames()

const dateStart = DateTime.now().plus({ day: 1 }).set({ hour: 9, minute: 0, second: 0 })
const dateEnd = dateStart.plus({ minute: 90 })
console.log(generateSession(dateStart, dateEnd, corpus, firstNames, lastNames))
