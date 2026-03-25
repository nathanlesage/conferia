// This file contains a few helper functions that help us arrange the various
// events on the schedule more appropriately.

import { DateTime } from "luxon"
import { CSVRecord } from "../csv"
import { getEarliestDay, getLatestDay } from "./time-helpers"

/**
 * This function takes in a set of records and, for each day in the dataset,
 * figures out which rooms are conflicting. A conflict is defined as two events
 * happening at the same time in different rooms. The returned array will have
 * one element for each day in the records, and each of these elements will
 * contain a list of all rooms that conflict. If there are no conflicting rooms
 * on a day, that array will be empty for the day.
 *
 * @param   {CSVRecord[]}  records  The records to display
 *
 * @return  {string[][]}            An array of strings in the form [day][room]
 */
export function roomsWithConflictsPerDay (records: CSVRecord[]): string[][] {
  const dates: Array<[DateTime, DateTime]> = records.map(r => [r.dateStart, r.dateEnd])

  const now = DateTime.now()

  const earliestDay = getEarliestDay(dates.flat()) ?? now
  const latestDay = getLatestDay(dates.flat()) ?? now.plus({ day: 1 })

  const days = Math.ceil(latestDay.diff(earliestDay).as('days'))

  const roomsWithConflictsPerDay: string[][] = []
  for (let i = 0; i < days; i++) {
    // First, get all events happening today
    const today = earliestDay.plus({ days: i }).startOf('day')
    const todaysEvents = records.filter(r => {
      return r.dateStart.startOf('day').diff(today).as('days') === 0
    })

    // Then, create a set of all rooms where there are time-conflicts. (Rooms
    // without time-conflicts do not need their own column, they will be spread
    // across all columns.)
    const roomsWithConflictsToday: Set<string> = new Set()
    for (const event of todaysEvents) {
      if (!('location' in event) || event.location!.trim() === '') {
        continue
      }

      if (eventHasConflict(event, todaysEvents)) {
        roomsWithConflictsToday.add(event.location!)
      }
    }

    // Finally, sort them so that each room will always be in the same location
    const allRooms = [...roomsWithConflictsToday]
    allRooms.sort()
    roomsWithConflictsPerDay[i] = allRooms
  }

  return roomsWithConflictsPerDay
}

/**
 * Utility function that returns true if an event has a conflict with any other
 * event in the entire list of records.
 *
 * @param   {CSVRecord}    record   The focus record to check.
 * @param   {CSVRecord[]}  records  A list of all records to check against.
 *
 * @return  {boolean}               Whether there is at least one record that
 *                                  overlaps with the focus record time-wise.
 */
export function eventHasConflict (record: CSVRecord, records: CSVRecord[]): boolean {
  const thisStart = record.dateStart
  const thisEnd = record.dateEnd

  return records.some(rec => {
    if (record === rec) {
      return false // No self-overlap
    }

    const otherStart = rec.dateStart
    const otherEnd = rec.dateEnd

    if (thisStart >= otherStart && thisEnd <= otherEnd) {
      return true // Focus event is contained within the other event
    } else if (thisStart < otherStart && thisEnd > otherEnd) {
      return true // Other event is contained within the focus event
    } else if (thisStart < otherStart && thisEnd > otherStart) {
      return true // Focus event overlaps with the beginning of the other event
    } else if (thisStart < otherEnd && thisEnd > otherEnd) {
      return true // Focus event overlaps with the end of the other event
    }

    return false
  })
}
