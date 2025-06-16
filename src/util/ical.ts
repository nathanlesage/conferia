import { DateTime } from "luxon"
import { CSVRecord } from "../csv"
import { askUser } from "../dom/ask-user"
import { Conferia } from "../conferia"

const EOL = "\r\n" // iCal requires CRLF

export function initiateIcalDownload (conferia: Conferia) {
  askUser(
    'Add events to your calendar',
    `Click one of the buttons below to download a set of this program's events
in the iCal format. This will download an iCal file which you can add to your
calendar. This allows you to, e.g., quickly transfer your personal agenda to
your own calendar so that it synchronizes with all your devices.

"All events" will include every event part of the conference (not recommended).
"Visible events" will include only the currently visible events (i.e.,
respecting your filters).
"Personal agenda" will download all events that you have added to your personal
agenda.`,
    [
      'Download all events',
      'Download visible events',
      'Download your personal agenda',
      'Cancel'
    ]
  ).then(buttonID => {
    if (buttonID === undefined || buttonID === 3) {
      return // No button or cancel clicked
    }

    if (buttonID === 0) {
      const ical = recordsToIcal(conferia.getRecords())
      downloadIcal(ical)
    } else if (buttonID === 1) {
      const ical = recordsToIcal(conferia.getVisibleRecords())
      downloadIcal(ical)
    } else if (buttonID === 2) {
      const ical = recordsToIcal(conferia.getUserAgendaRecords())
      downloadIcal(ical)
    }
  })
}

/**
 * Downloads iCal data to the user's computer.
 *
 * @param   {string}  ical  The iCal string data
 */
function downloadIcal (ical: string) {
  const file = new File([ical], 'calendar.ics', { type: 'text/calendar' })
  const a = document.createElement('a')
  a.style.display = 'none'
  a.href = URL.createObjectURL(file)
  a.download = file.name
  document.body.appendChild(a)
  a.addEventListener('mouseup', () => {
    URL.revokeObjectURL(a.href)
    a.parentElement?.removeChild(a)
  })
  a.click()
}

/**
 * Do violence to ISO 8601 datetimes
 *
 * @param   {DateTime}  date  The datetime
 *
 * @return  {string}          The iCal ISO 8601 format variant
 */
function dt2rfc2445 (date: DateTime): string {
  return date.setZone('utc').toFormat("yyyyLLdd'T'HHmmss'Z'")
}

/**
 * Turns a list of CSV records into an iCal calendar conformant to RFC 2445
 * (see https://www.ietf.org/rfc/rfc2445.txt, p. 52ff).
 * See https://datatracker.ietf.org/doc/html/rfc5545 for a newer edition.
 *
 * @param   {CSVRecord[]}  records  The records
 *
 * @return  {string}             The iCal string.
 */
function recordsToIcal (records: CSVRecord[]): string {
  const icalLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Hendrik Erz//NONSGML Conferia.js//EN', // cf. RFC 2445, p. 74
    'CALSCALE:GREGORIAN'
  ]

  for (const rec of records) {
    icalLines.push(...recordToIcal(rec))
  }

  icalLines.push('END:VCALENDAR', EOL) // End with a CRLF

  return icalLines.join(EOL)
}

/**
 * Turns a CSV record into an iCal entry conformant to RFC 2445
 * (see https://www.ietf.org/rfc/rfc2445.txt, p. 52ff). NOTE that you need to
 * wrap this into a calendar
 *
 * @param   {CSVRecord}  record  The record
 *
 * @return  {string}             The iCal strings (need to be joined with EOL).
 */
function recordToIcal (record: CSVRecord): string[] {
  // NOTE: DateTimes MUST be in UTC (also spares us from having to define weird
  // VTIMEZONE components).
  const dtNow = dt2rfc2445(DateTime.now())
  return [
    'BEGIN:VEVENT',
    // Start and end
    `DTSTART:${dt2rfc2445(record.dateStart)}`,
    `DTEND:${dt2rfc2445(record.dateEnd)}`,
    `LOCATION:${record.location}`,
    // iCal requires DTSTAMP
    `DTSTAMP:${dtNow}`,
    ...foldIcalLines(`SUMMARY:${record.title}`), // Summary = title
    ...icalDescriptionForRecord(record),
    `UID:${record.id}`,
    'END:VEVENT'
  ]
}

/**
 * Generates a valid `DESCRIPTION:` component for a `VEVENT` entry. Takes care
 * of line folding.
 *
 * @param   {CSVRecord[]}  record  The record in question.
 *
 * @return  {string[]}             The (properly parsed) lines of the DESCRIPTION.
 */
function icalDescriptionForRecord (record: CSVRecord): string[] {
  // We have three possibilities:
  // * Sessions need to contain a list of presentation titles
  // * If the record has an abstract, use that one
  // * If it doesn't, return the empty string

  // NOTE: We do not add an EOL feed here, as this will be added by the compiler.
  // However, we do remove any carriage returns in the text to ensure that we
  // only have them where actually allowed.
  if (record.type === 'session') {
    // DESCRIPTION can contain the literal "\n" to denote newlines. Note that it
    // must contain those characters LITERALLY. Otherwise the validator is going
    // to complain. (See RFC 2445, p. 80 f.) Do not ask me who came up with this
    // convention.
    const description = 'DESCRIPTION:Presentations:\\n\\n' + record.presentations.map((pres, idx) => `${idx + 1}.\t` + pres.title.replace('\r', '')).join('\\n\\n')
    return foldIcalLines(description)
  } else if ('abstract' in record) {
    const description = 'DESCRIPTION:' + record.abstract.replace('\r', '')
    return foldIcalLines(description)
  } else {
    return ['DESCRIPTION:'] // Just return the empty description string
  }
}

/**
 * Implements RFC 2445 line folding consistent for iCalendar files.
 *
 * @param   {string}    text  The input text
 *
 * @return  {string[]}        Properly folded lines.
 */
function foldIcalLines (text: string): string[] {
  // iCal descriptions should use what RFC 2445 calls a "line folding"
  // technique. To quote:
  // "Lines of text SHOULD NOT be longer than 75 octets, excluding the line
  // break. Long content lines SHOULD be split into a multiple line
  // representations using a line "folding" technique. That is, a long
  // line can be split between any two characters by inserting a CRLF
  // immediately followed by a single linear white space character (i.e.,
  // SPACE, US-ASCII decimal 32 or HTAB, US-ASCII decimal 9). Any sequence
  // of CRLF followed immediately by a single linear white space character
  // is ignored (i.e., removed) when processing the content type." (p. 12)

  if (text.length < 75) {
    return [text]
  }

  const lines: string[] = []

  let i = 0
  while (i < text.length) {
    // We're increasing by 70 instead of 75 because I'm not going to deal with
    // UTF8 or UTF16 code point clusters just to ensure the octet rule.
    lines.push((i > 0 ? ' ' : '') + text.slice(i, i + 70))
    i += 70
  }

  return lines
}
