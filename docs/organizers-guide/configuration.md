---
layout: page
title: Configuration
---

This page describes the available configuration options available to customize
your Conferia experience. It contains a dump of the configuration interface.
These are the options you pass in to `new Conferia({ /* Options */ })`.

For more details and help for the more complex options, please refer to the
[organizer's guide](organizers-guide.md).

```typescript
interface ConferiaOptions {
  /**
   * Where in the DOM should the schedule live?
   */
  parent: HTMLElement

  /**
   * The link to the data file. Can be a relative path (`/schedule.csv`) or an
   * absolute URL (`https://www.example.com/schedule.csv`). The library uses
   * `fetch` to download the data from there. If hosted on a different domain,
   * may cause CORS errors.
   */
  src: string

  /**
   * An optional title to be rendered above the schedule (useful if you have the
   * schedule live on its dedicated page).
   */
  title?: string

  /**
   * An optional intro text to be rendered above the title (useful if you have
   * the schedule live on its dedicated page).
   */
  intro?: string

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
  autoReload?: boolean|number

  /**
   * Specifies the IANA timezone for the entire event. This is optional, in
   * which case the timezone information in the data file take precedence, or
   * the timezone of the user. We recommend providing timezone information
   * either within the datetimes in the data file, or by setting this property.
   * Refer to the manual for more information.
   */
  timeZone?: string

  /**
   * Specifies the padding on the calendar board (default: 10px).
   */
  eventCardPadding?: number

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
  timeGridSeconds?: number

  /**
   * The minimum height of a card on the schedule. Provide a number of pixels.
   * By default, this is 75. This will be the height of the shortest event on
   * the schedule. Note that all other events will likewise be scaled by this
   * factor. Example: If you have one event of 5 minutes and one of 3 hours, the
   * 5 minute event will be this amount of pixels high, while the 3 hour event
   * will be 36 times this amount of pixels high (3 hours divided by 5 minutes).
   */
  minimumCardHeight?: number

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
  initialViewMode?: 'full'|'compact'|'time-based'|'device-based'

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
  dateParser?: (dateString: string, luxon: typeof DateTime) => string

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
  rowParser?: <T = CSVRecord|SessionPresentationRecord>(row: string[], header: string[], record: T) => T

  /**
   * If set to true, makes the library print out some debug info.
   */
  debug?: boolean
}
```
