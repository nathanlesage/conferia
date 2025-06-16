---
layout: page
title: Configuration
---

This page describes the available configuration options available to customize
your Conferia experience. It contains a dump of the configuration interface.

For more details on the more complex options, please refer to the
[organizer's guide](organizers-guide.md).

```typescript
export interface ConferiaOptions {
  /**
   * Where in the DOM should the schedule live?
   */
  parent: HTMLElement

  /**
   * The link to the data file
   */
  src: string

  /**
   * An optional title to be rendered above the schedule (useful if you have the
   * schedule live on its dedicated page)
   */
  title?: string

  /**
   * Specifies the IANA timezone for the entire event. This is optional, in
   * which case the timezone information in the data file take precedence, or
   * the timezone of the user. We recommend providing timezone information
   * either within the datetimes in the data file, or by setting this property.
   * See the README.md for more information.
   */
  timeZone?: string

  /**
   * Specifies the maximum height of the entire wrapper. Defaults to 100% of the
   * visible window height. Provide a number of pixels.
   */
  maxHeight?: number

  /**
   * Specifies the padding on the calendar board (default: 10).
   */
  eventCardPadding?: number

  /**
   * Specifies a specific grid line interval. By default, the grid lines will
   * mark the smallest interval available. With this setting, you can "fix" the
   * grid size to a specified number. Some values would be:
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
   * will be 36 times this amount of pixels high (3 hours / 5 minutes).
   */
  minimumCardHeight?: number

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
   * @param   {string[]}                             row     The CSV row
   * @param   {string[]}                             header  The CSV header
   * @param   {CSVRecord|SessionPresentationRecord}  record  The parsed record
   *
   * @return  {CSVRecord|SessionPresentationRecord}          The parsed and modified record
   */
  rowParser?: <T = CSVRecord|SessionPresentationRecord>(row: string[], header: string[], record: T) => T

  /**
   * If true, makes the library print out some debug info
   */
  debug?: boolean
}
```
