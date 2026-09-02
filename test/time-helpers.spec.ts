import { CSVRecord } from '../src/csv'
import { clampCompactDay, getInitialCompactDay } from '../src/util/time-helpers'
import { DateTime } from 'luxon'
import assert from 'assert'

const records: CSVRecord[] = [
  {
    id: 'conference',
    type: 'meta',
    title: 'Conference',
    dateStart: DateTime.fromISO('2026-08-11T09:00:00', { zone: 'Asia/Dubai' }),
    dateEnd: DateTime.fromISO('2026-08-14T17:00:00', { zone: 'Asia/Dubai' })
  }
]

describe('Time helpers', () => {
  describe('#getInitialCompactDay()', () => {
    it('shows the first program day before the conference', () => {
      const result = getInitialCompactDay(
        records,
        DateTime.fromISO('2026-08-01T12:00:00Z')
      )

      assert.strictEqual(result?.toISODate(), '2026-08-11')
    })

    it('shows the current conference day in the event timezone', () => {
      const result = getInitialCompactDay(
        records,
        DateTime.fromISO('2026-08-12T21:30:00Z')
      )

      assert.strictEqual(result?.toISODate(), '2026-08-13')
      assert.strictEqual(result?.zoneName, 'Asia/Dubai')
    })

    it('returns to the first program day after the conference', () => {
      const result = getInitialCompactDay(
        records,
        DateTime.fromISO('2026-09-02T12:00:00Z')
      )

      assert.strictEqual(result?.toISODate(), '2026-08-11')
    })

    it('returns undefined for an empty schedule', () => {
      assert.strictEqual(getInitialCompactDay([]), undefined)
    })
  })

  describe('#clampCompactDay()', () => {
    it('preserves a participant-selected day during later data loads', () => {
      const selected = DateTime.fromISO('2026-08-12T00:00:00', {
        zone: 'Asia/Dubai'
      })

      assert.strictEqual(clampCompactDay(records, selected), selected)
    })
  })
})
