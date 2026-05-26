import { CSVRecord, parseCsv } from '../src/csv'
import { DateTime } from 'luxon'
import assert from 'assert'

const testCases: Array<{ csv: string, output: CSVRecord[], throws: boolean }> = [
  // A: REGULAR, WELL-FORMED CSV FILE
  {
    csv: `date_start,date_end,type,title,abstract,author,location,session,session_order,chair
2026-08-11T09:00:00,2026-08-11T17:00:00,single,Title A,"Abstract A","Author 1, Author 2, Author 3",Room X,,,
2026-08-11T09:00:00,2026-08-11T17:00:00,single,Title B,"Abstract B","Author 4, Author 5",Room Y,,,
2026-08-11T09:00:00,2026-08-11T17:00:00,single,Title C,"Abstract C","Author 6",Room Z,,,
,,,,,,,,,
2026-08-12T09:00:00,2026-08-12T17:00:00,session_presentation,Title D,"Abstract D","Author 1, Author 2, Author 3",Room X,Session One,1,Chair A
2026-08-12T09:00:00,2026-08-12T17:00:00,session_presentation,Title E,"Abstract E","Author 4, Author 5",Room X,Session One,2,Chair A
2026-08-12T09:00:00,2026-08-12T17:00:00,session_presentation,Title F,"Abstract F","Author 6",Room Y,Session Two,2,Chair B
2026-08-12T09:00:00,2026-08-12T17:00:00,session_presentation,Title G,"Abstract G","Author 6",Room Y,Session Two,1,Chair B
`,
    output: [
      {
        type: 'single', id: '5670461e', author: 'Author 1, Author 2, Author 3',
        dateStart: DateTime.fromISO('2026-08-11T09:00:00'),
        dateEnd: DateTime.fromISO('2026-08-11T17:00:00'),
        title: 'Title A', abstract: 'Abstract A', chair: '', location: 'Room X',
        notes: undefined
      },
      {
        type: 'single', id: '5670461f', author: 'Author 4, Author 5', 
        dateStart: DateTime.fromISO('2026-08-11T09:00:00'),
        dateEnd: DateTime.fromISO('2026-08-11T17:00:00'),
        title: 'Title B', abstract: 'Abstract B', chair: '', location: 'Room Y',
        notes: undefined
      },
      {
        type: 'single', id: '56704620',
        dateStart: DateTime.fromISO('2026-08-11T09:00:00'),
        dateEnd: DateTime.fromISO('2026-08-11T17:00:00'),
        title: 'Title C', abstract: 'Abstract C', author: 'Author 6', chair: '',
        location: 'Room Z', notes: undefined
      },
      {
        type: 'session', id: '26ccaa8e',
        dateStart: DateTime.fromISO('2026-08-12T09:00:00'),
        dateEnd: DateTime.fromISO('2026-08-12T17:00:00'),
        title: 'Session One', chair: 'Chair A', location: 'Room X', notes: undefined,
        presentations: [
          { type: 'session_presentation', id: '6c9dbcc6', title: 'Title D', abstract: 'Abstract D', author: 'Author 1, Author 2, Author 3', session: 'Session One', sessionOrder: 1, dateStart: DateTime.fromISO('2026-08-12T09:00:00'), dateEnd: DateTime.fromISO('2026-08-12T17:00:00'), location: 'Room X', chair: 'Chair A', notes: undefined },
          { type: 'session_presentation', id: '6c9dbcc7', title: 'Title E', abstract: 'Abstract E', author: 'Author 4, Author 5', session: 'Session One', sessionOrder: 2, dateStart: DateTime.fromISO('2026-08-12T09:00:00'), dateEnd: DateTime.fromISO('2026-08-12T17:00:00'), location: 'Room X', chair: 'Chair A', notes: undefined }
        ]
      },
      {
        type: 'session', id: '26cc82c2',
        dateStart: DateTime.fromISO('2026-08-12T09:00:00'),
        dateEnd: DateTime.fromISO('2026-08-12T17:00:00'), title: 'Session Two',
        chair: 'Chair B', location: 'Room Y', notes: undefined,
        presentations: [
          { type: 'session_presentation', id: '6c9dbcc9', title: 'Title G', abstract: 'Abstract G', author: 'Author 6', session: 'Session Two', sessionOrder: 1, dateStart: DateTime.fromISO('2026-08-12T09:00:00'), dateEnd: DateTime.fromISO('2026-08-12T17:00:00'), location: 'Room Y', chair: 'Chair B', notes: undefined },
          { type: 'session_presentation', id: '6c9dbcc8', title: 'Title F', abstract: 'Abstract F', author: 'Author 6', session: 'Session Two', sessionOrder: 2, dateStart: DateTime.fromISO('2026-08-12T09:00:00'), dateEnd: DateTime.fromISO('2026-08-12T17:00:00'), location: 'Room Y', chair: 'Chair B', notes: undefined }
        ]
      }
    ],
    throws: false
  }
]

describe('CSV', () => {
  describe('#parse()', () => {
    for (const test of testCases) {
      it(`should ${test.throws ? 'throw an error' : 'parse'} the input correctly`, () => {
        const result = parseCsv(test.csv)
        assert.deepStrictEqual(result, test.output)
      })
    }
  })
})
