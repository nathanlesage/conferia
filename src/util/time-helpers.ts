import { DateTime } from 'luxon'
import { CSVRecord } from '../csv'

/**
 * Normalizes the provided DateTime in such a way that it copies the hour,
 * minute, and second of it into a new DateTime that uses the default timezone.
 * This way, you can make *times* comparable (as opposed to DateTimes), ignoring
 * everything such as different time zones, different day of the year, etc.
 *
 * This function can be called on two separate DateTimes to check whether, e.g.,
 * one would be on a later time of day. This is especially useful when dealing
 * with the time grid (which, by definition, is timezoneless).
 *
 * Example (because that was a bug that I had to fix): I wanted to know whether
 * the current, local time, was *after* one of the events of a schedule. This
 * did not work, because the time of the record was set to Europe/Stockholm DST
 * while the local browser time was set to Europe/Stockholm *non*-DST. By
 * creating two identical DateTime objects in terms of timezone and day, we
 * ensure that a comparison between 7:30 and 8:30 indeed returns that the latter
 * is after the former (which would not be the case if the former is in DST and
 * the latter is not, since DST is Europe/Stockholm-01:00).
 *
 * As always, remember that this is just an assumption, and this will actually
 * break on the exact dates when there is a DST switch if one of the times lies
 * before the switching hour. This switching usually occurs during the night, so
 * (a) dear policymakers, don't ever place a switch during the day time and (b)
 * dear conference organizers, please don't schedule events at 2/3am at night.
 *
 * @param   {DateTime}  time  The time to normalize
 *
 * @return  {DateTime}        The normalized DateTime with same HH:mm:ss but
 *                            local timezone.
 */
function normalizeDateTime (time: DateTime): DateTime {
  return DateTime.fromObject({
    hour: time.hour, minute: time.minute, second: time.second
  })
}

/**
 * Pass all (!) events in the conference to this function to get to know whether
 * the conference is happening right now.
 *
 * @param   {CSVRecord[]}  allRecords  All schedule events
 *
 * @return  {boolean}                  Whether the conference is happening now.
 */
export function isConferenceNow (allRecords: CSVRecord[]): boolean {
  const now = DateTime.now()
  const dates = allRecords.flatMap(r => [r.dateStart, r.dateEnd])
  const earliestDay = getEarliestDay(dates)
  const latestDay = getLatestDay(dates)

  if (earliestDay === undefined || latestDay === undefined) {
    throw new Error('Cannot calculate whether the conference is now: earliest or latest day were undefined!')
  }

  return now >= earliestDay && now <= latestDay
}

/**
 * Given an array of dates, returns the date that has the earliest time of day.
 *
 * @param   {DateTime[]}  dates  A list of dates
 *
 * @return  {DateTime}           The date with the earliest time of day
 */
export function getEarliestTime (dates: DateTime[]): DateTime|undefined {
  if (dates.length === 0) {
    return undefined
  }

  // TODO: After my hassle with the time indicator, I strongly believe that this
  // function can return wrong results because I don't normalize times here.
  // This might become a Heisenbug in that it works 99% of the times… except
  // when there is an unfortunate switch between daylight saving time during the
  // conference.
  return dates.sort((a, b) => {
    if (a.hour !== b.hour) {
      return a.hour - b.hour
    } else if (a.minute !== b.minute) {
      return a.minute - b.minute
    } else if (a.second !== b.second) {
      return a.second - b.second
    } else {
      return 0
    }
  })[0]
}

/**
 * Given an array of dates, returns the date that has the latest time of day.
 *
 * @param   {DateTime[]}  dates  A list of dates
 *
 * @return  {DateTime}           The date with the latest time of day
 */
export function getLatestTime (dates: DateTime[]): DateTime|undefined {
  if (dates.length === 0) {
    return undefined
  }

  // TODO: See caveat in `getEarliestTime` above.
  return dates.sort((a, b) => {
    if (a.hour !== b.hour) {
      return a.hour - b.hour
    } else if (a.minute !== b.minute) {
      return a.minute - b.minute
    } else if (a.second !== b.second) {
      return a.second - b.second
    } else {
      return 0
    }
  }).reverse()[0]
}

/**
 * Given a list of dates, returns the DateTime that is the earliest one.
 *
 * @param   {DateTime[]|CSVRecord[]}  records  A list of dates or CSV records
 *
 * @return  {DateTime|undefined}               The earliest date
 */
export function getEarliestDay (records: CSVRecord[]): DateTime|undefined
export function getEarliestDay (dates: DateTime[]): DateTime|undefined
export function getEarliestDay (items: DateTime[]|CSVRecord[]): DateTime|undefined {
  if (items.length === 0) {
    return undefined
  }

  if (items.every(i => i instanceof DateTime)) {
    return DateTime.min(...items)
  } else {
    return DateTime.min(...items.flatMap(r => [r.dateStart, r.dateEnd]))
  }
}

/**
 * Given a list of dates, returns the DateTime that is the latest one.
 *
 * @param   {DateTime[]|CSVRecord[]}  records  A list of dates or CSV records
 *
 * @return  {DateTime|undefined}               The latest date
 */
export function getLatestDay (records: CSVRecord[]): DateTime|undefined
export function getLatestDay (dates: DateTime[]): DateTime|undefined
export function getLatestDay (items: DateTime[]|CSVRecord[]): DateTime|undefined {
  if (items.length === 0) {
    return undefined
  }

  if (items.every(i => i instanceof DateTime)) {
    return DateTime.max(...items)
  } else {
    return DateTime.max(...items.flatMap(r => [r.dateStart, r.dateEnd]))
  }
}

/**
 * Given a list of startDate/endDate tuples, returns the shortest interval
 * between those two in seconds.
 *
 * @param   {Array<[DateTime, DateTime]>}  events  A list of tuples of start and end Dates
 *
 * @return  {number}                       The shortest interval in the array, in seconds.
 */
export function getShortestInterval (events: Array<[DateTime, DateTime]>): number {
  const durations = events
    .map(([start, end]) => end.diff(start))
    .map(d => d.as('seconds'))
  
  durations.sort((a, b) => a - b)
  return durations[0]
}

/**
 * Returns the time offset between time and referenceTime in seconds. This
 * function only looks at the actual times within the dates, ignoring both
 * timezones and dates.
 *
 * @param   {DateTime}  time           The time in question
 * @param   {DateTime}  referenceTime  The reference (earliest) time
 *
 * @return  {number}                   The difference in seconds.
 */
export function getTimeOffset (time: DateTime, referenceTime: DateTime): number {
  // Normalize times. Since Luxon isn't able to do just operations on the time
  // alone (at least not that I've found it), we need to strip every piece of
  // information from the dates, and instead make Luxon recreate a DateTime, but
  // only with diffs in hh:mm:ss.
  return normalizeDateTime(time).diff(normalizeDateTime(referenceTime)).as('seconds')
}

/**
 * Returns the duration between referenceDate and date in number of days.
 *
 * @param   {DateTime}  date           The date in question
 * @param   {DateTime}  referenceDate  The reference (earliest) date
 *
 * @return  {number}                   The number of days between the dates.
 */
export function getDayOffset (date: DateTime, referenceDate: DateTime): number {
  date = date.startOf('day')
  referenceDate = referenceDate.startOf('day')
  return date.diff(referenceDate).as('days')
}

/**
 * Checks if the provided DateTime is before the reference purely in terms of
 * the time of day, ignoring the date part. This means that this only considers
 * a single, 24 hour time period, meaning that if time A is at five to midnight
 * on the first day, and time B is at five past midnight on the second day, time
 * B will still be considered "before" time A (yielding false).
 *
 * @param   {DateTime}  time           The first time
 * @param   {DateTime}  referenceTime  The second time
 *
 * @return  {boolean}                  Whether time is before referenceTime
 */
export function isTimeBefore (time: DateTime, referenceTime: DateTime): boolean {
  return normalizeDateTime(time) < normalizeDateTime(referenceTime)
}
