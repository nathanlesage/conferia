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
    `SUMMARY:${record.title}`, // Summary = title
    `DESCRIPTION:${'abstract' in record ? record.abstract : ''}`,
    `UID:${record.id}`,
    'END:VEVENT'
  ]
}
