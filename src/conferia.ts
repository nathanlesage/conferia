import { CSVRecord, parseCsv, SessionPresentationRecord } from "./csv"
import { updateGutterTicks as updateTimeGutter } from "./dom/time-gutter"
import { updateGutterTicks as updateDayGutter } from "./dom/day-gutter"
import { DOMStructure, generateDOMStructure } from "./dom/wrapper"
import { getDayOffset, getEarliestDay, getEarliestTime, getLatestDay, getLatestTime, getShortestInterval, getTimeOffset } from "./util/time-helpers"
import { drawVerticalDayDividers, generateEventCard, updateScheduleBoard } from "./dom/schedule-board"
import { DateTime } from "luxon"
import { showEventDetailsModal } from "./dom/event-details-modal"
import { Agenda } from "./agenda"
import { initiateIcalDownload } from "./util/ical"
import { matchEvent } from "./util/fuzzy-match"
import { eventHasConflict, roomsPerDay } from "./util/conflicts-and-columns"
import { askUser } from "./dom/ask-user"

export interface ConferiaOptions {
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
   * Specifies the IANA timezone for the entire event. This is optional, in
   * which case the timezone information in the data file take precedence, or
   * the timezone of the user. We recommend providing timezone information
   * either within the datetimes in the data file, or by setting this property.
   * Refer to the manual for more information.
   */
  timeZone?: string

  /**
   * Specifies the maximum height of the entire wrapper. Defaults to 100% of the
   * visible window height. Provide a number of pixels.
   */
  maxHeight?: number

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
   * If true, makes the library print out some debug info.
   */
  debug?: boolean
}

export class Conferia {
  private readonly opt: ConferiaOptions
  private loadPromise: Promise<void>
  private records: CSVRecord[]
  private columnScaleFactor: number
  private readonly dom: DOMStructure
  private query: string
  private showOnlyPersonalAgenda: boolean

  public agenda: Agenda

  public constructor (opt: ConferiaOptions) {
    this.query = ''
    this.opt = opt
    this.records = []
    this.columnScaleFactor = 1
    this.showOnlyPersonalAgenda = false

    this.agenda = new Agenda()

    // Mount everything
    this.dom = generateDOMStructure(opt.title, opt.maxHeight ? `${opt.maxHeight}px` : undefined)
    this.opt.parent.appendChild(this.dom.wrapper)

    // Attach event listeners
    this.dom.filter.addEventListener('keyup', () => {
      this.query = this.dom.filter.value
      this.updateUI()
    })

    this.dom.personalAgendaToggle.addEventListener('change', () => {
      this.showOnlyPersonalAgenda = this.dom.personalAgendaToggle.checked
      this.updateUI()
    })

    this.dom.toIcalButton.addEventListener('click', () => {
      initiateIcalDownload(this)
    })

    this.dom.clearButton.addEventListener('click', () => {
      askUser(
        'Clear data',
        `Here you can delete the various data that the app stores in your
        browser. Use this to quickly clear out your agenda, or reset the tips.`,
        [
          'Clear personal agenda',
          'Reset tips',
          'Cancel'
        ]
      ).then(response => {
        if (response === 0) {
          // Clear personal agenda
          this.agenda.clearPersonalAgenda()
          this.updateUI()
        } else if (response === 1) {
          // Reset tips
          this.agenda.resetHasShown()
        } else if (response === 2) {
          // Cancel
        }
      })
    })

    // Begin loading
    this.loadPromise = this.load()

    // Perform initial update
    this.loadPromise.then(() => {
      this.updateUI()
    })
  }

  /**
   * Returns all records in the schedule
   *
   * @return  {CSVRecord[]}  All records
   */
  public getRecords (): CSVRecord[] {
    return this.records
  }

  /**
   * Returns all records in the schedule conditional on any filters currently
   * applied (that is, only the currently visible records)
   *
   * @return  {CSVRecord[]} The filtered records
   */
  public getVisibleRecords (): CSVRecord[] {
    return this.filterRecords()
  }

  /**
   * Returns all records that are part of the user agenda.
   *
   * @return  {CSVRecord[]}  The user agenda records
   */
  public getUserAgendaRecords (): CSVRecord[] {
    return this.records.filter(r => this.agenda.hasItem(r.id))
  }

  /**
   * Filters all available records based on various conditions.
   *
   * @return  {CSVRecord[]}  The filtered set of events.
   */
  private filterRecords (): CSVRecord[] {
    const q = this.query.trim().toLowerCase()

    let records = this.records

    if (this.showOnlyPersonalAgenda) {
      records = records.filter(r => this.agenda.hasItem(r.id))
    }

    if (q === '') {
      return records
    }

    return records.filter(record => matchEvent(record, q))
  }

  /**
   * This is the major function of this class. It completely (re)builds the
   * entire UI, based on any filters, etc.
   */
  public updateUI () {
    // Before doing anything, retrieve the records we are supposed to show.
    const records = this.filterRecords()

    if (records.length === 0) {
      this.dom.scheduleBoard.innerHTML = ''
      this.dom.timeGutter.innerHTML = ''
      this.dom.dayGutter.innerHTML = ''

      const noeventscard = document.createElement('div')
      noeventscard.classList.add('event', 'meta')
      noeventscard.style.margin = (this.opt.eventCardPadding ?? 10) + 'px'
      noeventscard.style.height = '75%'
      noeventscard.innerHTML = '<strong>No events to show.</strong>'
      this.dom.scheduleBoard.appendChild(noeventscard)
      return
    }

    // Then, figure out the axis limits and other information regarding the times.
    const dates: Array<[DateTime, DateTime]> = records.map(r => [r.dateStart, r.dateEnd])

    // First, the vertical (time) and horizontal (day) scale limits. Default to
    // an hour around right now to display at least something. Later on we can
    // add an "error" card.
    const now = DateTime.now()
    const earliestTime = getEarliestTime(dates.flat()) ?? now
    const latestTime = getLatestTime(dates.flat()) ?? now.plus({ hour: 1 })
    const earliestDay = getEarliestDay(dates.flat()) ?? now
    const latestDay = getLatestDay(dates.flat()) ?? now.plus({ day: 1 })

    // Second, the shortest event duration (which determines the vertical
    // resolution). Minimum: 5 minutes (in case there are "zero-length" events)
    const shortestInterval = Math.max(300, getShortestInterval(dates))
    // How many days do we have in total?
    const days = Math.ceil(latestDay.diff(earliestDay).as('days'))

    // DEBUG START

    const counter = records
      .map(r => getTimeOffset(r.dateEnd, r.dateStart))
      .reduce<Record<string, number>>((prev, cur) => {cur in prev ? prev[cur] += 1 : prev[cur] = 1; return prev}, {})
    
    const vals = Object.entries(counter).map(([int, cnt]) => parseInt(int, 10) * cnt)
    const mean = vals.reduce((prev, cur) => prev + cur, 0) / records.length
    // console.log({counter, mean})

    // DEBUG END

    // Calculate the "pixels per second," a measure to ensure the events have a
    // proper "minimum height."
    const MIN_HEIGHT = this.opt.minimumCardHeight ?? 75
    const pps = MIN_HEIGHT / shortestInterval

    // Now, determine the "raster" size (minimum size for a time interval in
    // width and height based on the shortest interval)
    const COLUMN_WIDTH = 250 * this.columnScaleFactor

    // Determine the room-columns for each individual day. We need to pass this
    // info to the dayGutter updater so that it can add a second "heading row"
    // with the room designations at the corresponding places, AND we need to
    // offset the events based on that information.
    const rpd = roomsPerDay(records)

    const timeGridInterval = this.opt.timeGridSeconds ?? shortestInterval

    // Now, update the time and day gutters
    updateTimeGutter(this.dom.timeGutter, earliestTime, latestTime, pps, timeGridInterval)
    updateDayGutter(this.dom.dayGutter, earliestDay, days, COLUMN_WIDTH, rpd)

    // Draw a grid in the scheduleBoard
    updateScheduleBoard(this.dom.scheduleBoard, COLUMN_WIDTH, timeGridInterval * pps)

    this.dom.scheduleBoard.innerHTML = ''

    // Draw the events on the scheduleboard
    for (const event of records) {
      const card = generateEventCard(event, this.agenda)
      card.addEventListener('click', () => showEventDetailsModal(event, this))

      // Place the event on the schedule board
      const timeOffset = getTimeOffset(event.dateStart, earliestTime)
      const dayOffset = getDayOffset(event.dateEnd, earliestDay)

      let withinDayOffset = event.location ? rpd[dayOffset].indexOf(event.location) : 0
      // NOTE the Math.max in the MapReduce below: If there are no conflicts on
      // a day, the array length will be zero, so we need to set it at least to 1.
      const prevColumnsOffset = rpd.slice(0, dayOffset).reduce((prev, cur) => prev + Math.max(cur.length, 1), 0)
      const hasConflict = eventHasConflict(event, records)
      // If an event has no conflicting other events, we make it span the entire
      // column.
      if (!hasConflict) {
        withinDayOffset = 0
      }
      
      const eventDuration = getTimeOffset(event.dateEnd, event.dateStart)

      const PADDING = this.opt.eventCardPadding ?? 10

      // Ensure each event is *at least* shortestInterval high.
      const height = Math.max(pps * shortestInterval, eventDuration * pps) - PADDING * 2

      card.style.top = `${timeOffset * pps + PADDING}px`
      card.style.height = `${height}px`

      // left & width are more complex
      card.style.left = `${COLUMN_WIDTH * (prevColumnsOffset + withinDayOffset) + PADDING}px`
      if (event.location && hasConflict) {
        card.style.width = `${COLUMN_WIDTH - PADDING * 2}px`
      } else {
        // No conflict with other events -> make it span th entire day column
        // This line here is necessary since, if there are no conflicts, the
        // rpd array will be empty.
        const colspan = Math.max(rpd[dayOffset].length, 1)
        card.style.width = `${COLUMN_WIDTH * colspan - PADDING * 2}px`
      }

      // Ensure that meta events (such as lunches and coffee breaks) overlap
      // any events that cross through them. (Oftentimes, if there are longer
      // events, there is usually a short break in between, but it is easier
      // to make both events additive instead of splitting the longer events
      // up into two separate smaller events in the Excel file.)
      if (event.type === 'meta') {
        card.style.zIndex = '1'
      }

      this.dom.scheduleBoard.appendChild(card)
    }

    // Final step: draw the vertical day-dividers so that the borders between
    // the days become more pronounced
    drawVerticalDayDividers(earliestTime, latestTime, this.dom.scheduleBoard, COLUMN_WIDTH, rpd, pps)
  }

  /**
   * Sets the column zoom to the provided factor. Should be a ratio (e.g. 1
   * for default zoom, 1.1 for 110% zoom factor, or 0.9 for 90% zoom factor.)
   *
   * @param   {number}  factor  The new factor
   */
  public colZoom (factor: number) {
    this.columnScaleFactor = factor
    if (this.columnScaleFactor < 1) {
      this.columnScaleFactor = 1
    }
    this.updateUI()
  }

  /**
   * Loads the library
   *
   * @param   {ConferiaOptions}    opt  The options
   * 
   * @return  {Promise<Conferia>}       The object
   */
  private async load (): Promise<void> {
    try {
      const response = await fetch(this.opt.src)
      const data = await response.text()
      const csv = parseCsv(data, this.opt.timeZone, this.opt.dateParser, this.opt.rowParser)
  
      if (this.opt.debug) {
        console.log(`Parsed ${csv.length} records from file ${this.opt.src}.`)
        console.log({ csv })
      }
  
      this.records = csv
    } catch (err: any) {
      console.error(`Conferia could not load data: ${err.message}`)
      console.error(err.message)
    }
  }

  /**
   * Awaits the loading promise. If this function resolves, the library is
   * instantiated.
   *
   * @return  {Promise<void>}  The boot promise
   */
  public async awaitBoot (): Promise<void> {
    return await this.loadPromise
  }
}
