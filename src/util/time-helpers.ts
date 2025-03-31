import { DateTime } from 'luxon'

/**
 * Given an array of dates, returns the date that has the earliest time of day.
 *
 * @param   {DateTime[]}  dates  A list of dates
 *
 * @return  {DateTime}           The date with the earliest time of day
 */
export function getEarliestTime (dates: DateTime[]): DateTime {
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
export function getLatestTime (dates: DateTime[]): DateTime {
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
 * @param   {DateTime[]}  dates  A list of dates
 *
 * @return  {DateTime}           The earliest date
 */
export function getEarliestDay (dates: DateTime[]): DateTime {
  return DateTime.min(...dates)
}

/**
 * Given a list of dates, returns the DateTime that is the latest one.
 *
 * @param   {DateTime[]}  dates  A list of dates
 *
 * @return  {DateTime}           The latest date
 */
export function getLatestDay (dates: DateTime[]): DateTime {
  return DateTime.max(...dates)
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
  time = DateTime.fromObject({ hour: time.hour, minute: time.minute, second: time.second })
  referenceTime = DateTime.fromObject({ hour: referenceTime.hour, minute: referenceTime.minute, second: referenceTime.second })
  return time.diff(referenceTime).as('seconds')
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
