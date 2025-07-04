import { DateTime } from "luxon"
// NOTE: This looks ugly, but is necessary because hash-sum doesn't provide a
// default export. Specifically, we need two TypeScript compiler flags
// (esModuleInterop and allowSyntheticDefaultImports), one rollup plugin
// (commonjs) and this concoction to make it work.
import hash from 'hash-sum'

interface BaseRecord {
  id: string
  type: 'session_presentation'|'single'|'keynote'|'meta'|'special'|'session'
  dateStart: DateTime
  dateEnd: DateTime
  title: string
  location?: string
  chair?: string
}

export interface SessionPresentationRecord extends BaseRecord {
  type: 'session_presentation'
  abstract: string
  author: string
  session: string
  sessionOrder: number
}

export interface SessionRecord extends BaseRecord {
  type: 'session'
  presentations: SessionPresentationRecord[]
}

export interface SingleRecord extends BaseRecord {
  type: 'single'|'keynote'|'special'
  abstract: string
  author: string
}

export interface MetaRecord extends BaseRecord {
  type: 'meta'
}

export type CSVRecord = SingleRecord|MetaRecord|SessionRecord

/**
 * Takes a CSV string and parses it into our internal record format.
 *
 * @param   {string}       csvData     The CSV string
 * @param   {string}       timeZone    An optional time zone (IANA string)
 * @param   {Function}     dateParser  An optional date parser function
 * @param   {Function}     rowParser   A parser to modify the records parsed
 *                                     from the CSV, in case you have additional
 *                                     columns you want to take in.
 *
 * @return  {CSVRecord[]}              The parsed CSV records
 */
export function parseCsv (
  csvData: string,
  timeZone?: string,
  dateParser?: (dateString: string, luxon: typeof DateTime) => string,
  rowParser?: <T = CSVRecord|SessionPresentationRecord>(row: string[], header: string[], record: T) => T
): CSVRecord[] {
  // Small utility function to harmonize datetime parsing
  const parseISODate = (isoDate: string) => {
    if (dateParser !== undefined) {
      isoDate = dateParser(isoDate, DateTime)
    }

    try {
      return DateTime.fromISO(isoDate, { zone: timeZone })
    } catch (err: any) {
      throw new Error(`Could not parse date string to ISO: ${isoDate}`)
    }
  }

  const rows = csvData
    .split(/[\n\r]+/)
    .filter(row => row.trim() !== '')
    // Remove empty rows (this happens if users space out the events in their
    // spreadsheet to group them logically.)
    .filter(row => !/^[\s,]+$/.test(row))

  if (rows.length < 2) {
    throw new Error('Invalid CSV: Less than 2 rows!')
  }

  const header = rows.shift()!.split(',').map(c => c.toLowerCase())

  const EXPECTED_COLS = header.length

  const DATE_START_IDX = header.findIndex(c => c === 'date_start')
  const DATE_END_IDX = header.findIndex(c => c === 'date_end')
  const TYPE_IDX = header.findIndex(c => c === 'type')
  const TITLE_IDX = header.findIndex(c => c === 'title')
  const ABSTRACT_IDX = header.findIndex(c => c === 'abstract')
  const AUTHOR_IDX = header.findIndex(c => c === 'author')
  const LOCATION_IDX = header.findIndex(c => c === 'location')
  const SESSION_IDX = header.findIndex(c => c === 'session')
  const SESSION_ORDER_IDX = header.findIndex(c => c === 'session_order')
  const CHAIR_IDX = header.findIndex(c => c === 'chair')

  if (DATE_START_IDX < 0) {
    throw new Error('The CSV did not contain a `date_start` column.')
  }
  if (DATE_END_IDX < 0) {
    throw new Error('The CSV did not contain a `date_end` column.')
  }
  if (TYPE_IDX < 0) {
    throw new Error('The CSV did not contain a `type` column.')
  }
  if (TITLE_IDX < 0) {
    throw new Error('The CSV did not contain a `title` column.')
  }
  if (ABSTRACT_IDX < 0) {
    throw new Error('The CSV did not contain a `abstract` column.')
  }
  if (AUTHOR_IDX < 0) {
    throw new Error('The CSV did not contain a `author` column.')
  }
  if (LOCATION_IDX < 0) {
    throw new Error('The CSV did not contain a `location` column.')
  }
  if (SESSION_IDX < 0) {
    throw new Error('The CSV did not contain a `session` column.')
  }
  if (SESSION_ORDER_IDX < 0) {
    throw new Error('The CSV did not contain a `session_order` column.')
  }
  if (CHAIR_IDX < 0) {
    throw new Error('The CSV did not contain a `chair` column.')
  }

  const returnValue: CSVRecord[] = []
  const onlySessionPresentations: SessionPresentationRecord[] = []
  for (const row of rows.map(row => parseCSVLine(row))) {
    if (row.length !== EXPECTED_COLS) {
      throw new Error(`Wrong number of columns in row (${row.length}; expected ${EXPECTED_COLS}) in row: ${row.join(',')}`)
    }
  
    const start = parseISODate(row[DATE_START_IDX])
    const end = parseISODate(row[DATE_END_IDX])
    const type = row[TYPE_IDX]
    const title = row[TITLE_IDX]
    const abstract = row[ABSTRACT_IDX]
    const author = row[AUTHOR_IDX]
    const location = row[LOCATION_IDX]
    const session = row[SESSION_IDX]
    const sessionOrder = row[SESSION_ORDER_IDX]
    const chair = row[CHAIR_IDX]

    const id = hash(String(start) + String(end) + type + title)

    switch (type as CSVRecord["type"] & 'session_presentation') {
      case 'session_presentation': {
        // NOTE that we place session presentations in a different array to
        // simplify the interface the rest of the library has to work with.
        const record: SessionPresentationRecord = {
          type: 'session_presentation',
          dateStart: start,
          dateEnd: end,
          title, abstract, author, location, session, chair, id,
          sessionOrder: parseInt(sessionOrder, 10)
        }
        onlySessionPresentations.push(rowParser ? rowParser(row, header, record) : record)
        break
      }
      case 'keynote': {
        const record: CSVRecord = {
          type: 'keynote',
          dateStart: start,
          dateEnd: end,
          title, abstract, author, location, chair, id
        }
        returnValue.push(rowParser ? rowParser(row, header, record) : record)
        break
      }
      case 'meta': {
        const record: CSVRecord = {
          type: 'meta',
          dateStart: start,
          dateEnd: end,
          title, location, id
        }
        returnValue.push(rowParser ? rowParser(row, header, record) : record)
        break
      }
      case 'single': {
        const record: CSVRecord = {
          type: 'single',
          dateStart: start,
          dateEnd: end,
          title, location, abstract, author, chair, id
        }
        returnValue.push(rowParser ? rowParser(row, header, record) : record)
        break
      }
      case 'special': {
        const record: CSVRecord = {
          type: 'special',
          dateStart: start,
          dateEnd: end,
          title, location, abstract, author, chair, id
        }
        returnValue.push(rowParser ? rowParser(row, header, record) : record)
        break
      }
      default:
        console.warn(`Unknown type detected in entry: ${type}. Skipping row.`)
    }
  }

  // One final step: Aggregate the various presentations according to sessionName.
  const sessionNames = [...new Set(onlySessionPresentations.map(s => s.session))]
  for (const name of sessionNames) {
    const presentations = onlySessionPresentations.filter(r => r.session === name)
    const { dateStart, dateEnd, location, chair } = presentations[0]

    // Sort the presentations according to their ordering
    presentations.sort((a, b) => a.sessionOrder - b.sessionOrder)

    // Use just the date and session name to identify sessions. This way,
    // presentations can change without removing the session itself from any
    // users' agenda.
    const id = hash(String(dateStart) + String(dateEnd) + 'session' + name)

    returnValue.push({
      type: 'session', title: name,
      dateStart, dateEnd, location, presentations, chair, id
    })
  }

  // Sort the events by time
  returnValue.sort((a, b) => {
    return a.dateStart.diff(b.dateStart, 'seconds').as('seconds')
  })

  return returnValue
}

/**
 * Takes a CSV line and parses it into a series of cells.
 *
 * @param   {string}    line  The line to parse
 *
 * @return  {string[]}        The cells
 */
function parseCSVLine (line: string, sep: string = ','): string[] {
  const cells: string[] = []

  let currentCell = ''
  let isQuoted = false
  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    // We have to deal with two special character cases
    if (char === sep) {
      // Cell Separator
      if (isQuoted) {
        currentCell += char
      } else {
        cells.push(currentCell)
        currentCell = ''
        isQuoted = false
      }
    } else if (char === '"') {
      // Quote
      if (currentCell === '') {
        // Current Cell is empty -> Marks beginning of a quoted cell
        isQuoted = true
      } else if (isQuoted) {
        // Double quote within a quoted cell either marks the end or an escaped
        // double quote. Is determined by the next character. If it's a quote,
        // we shall add a quote to the cell contents, otherwise the cell is
        // done.
        const nextChar = line[i + 1]
        if (nextChar === '"') {
          currentCell += char // It's an escaped quote.
          i++ // Jump over the next quote
        } else if (nextChar === sep) {
          // Not an escaped quote -> end of cell
          isQuoted = false
        } else {
          // Malformed cell
          throw new Error('Could not parse CSV line: Malformed cell: ' + line)
        }
      } else {
        // Malformed cell
        throw new Error('Could not parse CSV line: Malformed cell: ' + line)
      }
    } else {
      // Everything else
      currentCell += char
    }
  }

  cells.push(currentCell) // Final cell is not delimited with `sep`

  return cells
}
