# Configuration

While Conferia.js ships with sensible defaults, it gives you a lot of freedom to
adjust the library's look and feel to how you prefer to use it. On this page, we
describe all options you can set to customize your experience.

> [!tip]
> All options are provided in the Conferia constructor. So all options can be
> used like so:
>
> ```js
> const conferia = new Conferia({ option: "value" })
> ```

There are two special options, the `dateParser` and the `rowParser`, which allow
you to transform the CSV data in bulk. Please see the end of this document for
more information on how you can use those options.

```typescript
interface ConferiaOptions {
  /**
   * Where in the DOM should the schedule live? This is required.
   */
  parent: HTMLElement

  /**
   * The link to the data file. This is required. Can be a (relative) path
   * (`/schedule.csv` or `schedule.csv`) or an absolute URL
   * (`https://www.example.com/schedule.csv`). The library uses `fetch` to
   * download the data from there. If hosted on a different domain, may cause
   * CORS errors.
   */
  src: string

  /**
   * An optional title to be rendered above the schedule (useful if you have the
   * schedule live on its dedicated page).
   */
  title: string

  /**
   * An optional intro text to be rendered above the title (useful if you have
   * the schedule live on its dedicated page).
   */
  intro: string

  /**
   * If you expect frequent updates to the schedule as the conference
   * approaches, you may want to make the library auto-reload. By default, the
   * library requires participants to manually reload to see any changes. If set
   * to `true`, the library will reload the CSV file every 5 minutes. If you
   * want more or less frequent reloads, you can also provide a number here (in
   * seconds).
   * Keep in mind that this feature is extremely data-intensive. To visualize
   * this: With 300 participants, a CSV file of about 1 MB, and a reload
   * schedule of 5 minutes, your server will transfer 3.6 GB (!) every hour.
   */
  autoReload: boolean|number

  /**
   * Specifies the IANA timezone for the entire event. This is optional, in
   * which case the timezone information in the data file take precedence, or
   * the timezone of the user. We recommend providing timezone information
   * either within the datetimes in the data file, or by setting this property.
   * Refer to the manual for more information.
   */
  timeZone: string

  /**
   * Specifies the padding on the calendar board (default: 10px).
   */
  eventCardPadding: number

  /**
   * Specifies a specific grid line interval. By default, the grid lines will
   * mark the smallest interval available. With this setting, you can "fix" the
   * grid size to a specified number. Some common values might be:
   *
   * * `300`: 5 minutes
   * * `900`: 15 minutes
   * * `1800`: 30 minutes
   * * `3600`: 1 hour
   */
  timeGridSeconds: number

  /**
   * The minimum height of a card on the schedule. Provide a number of pixels.
   * By default, this is 75. This will be the height of the shortest event on
   * the schedule. Note that all other events will likewise be scaled by this
   * factor. Example: If you have one event of 5 minutes and one of 3 hours, the
   * 5 minute event will be this amount of pixels high, while the 3 hour event
   * will be 36 times this amount of pixels high (3 hours divided by 5 minutes).
   */
  minimumCardHeight: number

  /**
   * By default, Conferia keeps the numbers that you provide in the
   * `session_order` column as the actual values of the corresponding list items
   * (meaning that, if you set four presentations in a schedule with the numbers
   * 1, 3, 5, 7, these will be the list item numbers displayed to the users).
   * Set this option to `false` (the default is `true`) to ensure that the lists
   * of session presentations always start at 1 and increase strictly monotonous
   * (i.e., Conferia will use `session_order` to sort the sessions, but ignore
   * the actual values and number the presentations 1, 2, 3, 4, …).
   */
  sessionOrderAsListNumbers: boolean

  /**
   * This setting allows you to specify which view mode the application should
   * start in. The library supports two view modes: `full` (show all days in a
   * horizontal grid) or `compact` (only a single day at a time). The
   * application defaults to a "device-based" heuristic. NOTE: Users can always
   * switch manually using the toolbar button.
   * 
   * Supported options are:
   *
   * * `full`: Always initialize the schedule in "full" mode, regardless of time
   *   or device.
   * * `compact`: Always initialize the schedule in "compact" mode.
   * * `time-based`: Show the `full` schedule outside of conference dates, but
   *   switch to `compact` while the conference is running.
   * * `device-based`: Show the `full` schedule on desktop, and the `compact`
   *   schedule on mobile devices (the default).
   */
  initialViewMode: 'full'|'compact'|'time-based'|'device-based'

  /**
   * An optional function that you can use to correct the dates in your CSV
   * file. Use this to fix datetimes, if whichever application you peruse to
   * generate the CSV file cannot properly output ISO 8601 strings (such as
   * Microsoft Excel or Google Spreadsheets).
   *
   * @param   {string}    dateString  The raw date string as it comes from your
   *                                  CSV file.
   * @param   {DateTime}  luxon       The Luxon DateTime constructor. Can be
   *                                  used according to Luxon's documentation.
   *
   * @return  {string}                Must return an ISO 8601-compatible
   *                                  datetime string.
   */
  dateParser: (dateString: string, luxon: typeof DateTime) => string

  /**
   * An optional function that you can use to fine-tune the data in the loading
   * step while the library is loading it from the CSV file. It provides you the
   * record, the raw CSV row that the record has been parsed from (an array of
   * strings), as well as the header row (so that you can identify which column
   * you need). Return the record from this function once you're done.
   *
   * NOTE: This function will *not* be called for the session events, as those
   * are created only after the CSV file has been fully parsed.
   *
   * @param   {string[]}                             row     The CSV row
   * @param   {string[]}                             header  The CSV header
   * @param   {CSVRecord|SessionPresentationRecord}  record  The parsed record
   *
   * @return  {CSVRecord|SessionPresentationRecord}          The parsed and modified record
   */
  rowParser: <T = CSVRecord|SessionPresentationRecord>(row: string[], header: string[], record: T) => T

  /**
   * If set to true, makes the library print out some debug info.
   */
  debug: boolean
}
```

## `dateParser`

The `dateParser` option accepts a JavaScript function that you can use to
transform all dates in the CSV spreadsheet so that they conform to the ISO 8601
format.

This comes in handy in two situations. First, some spreadsheet softaware has a
quirk where it simply refuses to export ISO 8601 dates. Instead of manually
fixing every single date in the CSV export everytime you need to update your
schedule, we recommend that you use this function to automate this process. And
second, sometimes it might be easier for you to enter dates in a completely odd
format, and then use this function to turn whatever format you decided on into
the format needed by Converia.js.

The function receives two arguments for each date the library finds in your CSV.
First the date string that comes directly from your CSV file. And second, a
great little helper tool, called `luxon`, that might make it easier for you to
transform your dates.

To give you an example, Google Spreadsheets refuses to produce valid ISO 8601
dates. To fix this issue, you can use a function like the following:

```js
dateParser (dateString, luxon) {
  // The program comes from Google Sheets and as such is lacking the T.
  return dateString.split(' ').join('T')
},
```

Here, we didn't need to deal with any dates at all, because what is lacking in
the Google Sheets export is merely the `T` letter that is required by ISO 8601.

## `rowParser`

The row parser is another utility function that you can pass to customize the
sessions.

The primary use-case for this is if you need to add additional information to
your schedule that the library does not account for. You can add as many
additional columns as you want to your CSV file, which Conferia will simply
ignore. But if you want to use this information to enrich your records, you can
use the `rowParser` for this.

The function receives three arguments for each line in the CSV file: First the
raw data that the library has extracted from the CSV file -- one string per
column. Second, it receives the header columns, which you can use to identify
a specific column in the row. Lastly, it receives the already parsed CSV record
that Conferia.js will use going forward.

You can modify the CSV record as you see it fit using the raw data, but you will
have to return it afterwards.

To give you an example, you may wish to add the submission IDs from your
submission system to the session titles to make it easier for presenters and
participants to find the correct presentation in the program. This is something
where you'd use the row parser for.

The following example uses the OpenReview submission system. Prior to using this
function, the conference organizers have added an additional column,
`openreview_id`, to the spreadsheet which then got exported into the CSV file.
Since Conferia does not know of this column, it will ignore it and parse the
records using only the minimum fields. The row parser then adds the submission
ID to any session presentation record.

```js
rowParser (row, header, record) {
  // Attach the OpenReview IDs to the presentation titles
  if (record.type !== 'session_presentation') {
    return record
  }
  const openReviewIdx = header.indexOf('openreview_id')
  if (openReviewIdx < 0) {
    console.warn('`openreview_id` Column not found in CSV')
    return record
  }

  // Posters additionally get their Poster ID assigned so that it is
  // clear that the session order number equals the pinboard and what
  // the participants shall fill in to the Poster Award poll.
  const isPoster = record.session.startsWith('Poster')
  const posterSuffix = isPoster ? `; Poster ID: ${record.sessionOrder}` : ''

  return {
    ...record,
    title: record.title + ` (#${row[openReviewIdx]}${posterSuffix})`
  }
}
```
