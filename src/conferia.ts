import { CSVRecord, parseCsv, SessionPresentationRecord } from "./csv"
import { updateGutterTicks as updateTimeGutter } from "./dom/time-gutter"
import { updateGutterTicks as updateDayGutter } from "./dom/day-gutter"
import { DOMStructure, generateDOMStructure } from "./dom/wrapper"
import { getDayOffset, getEarliestDay, getEarliestTime, getLatestDay, getLatestTime, getShortestInterval, getTimeOffset } from "./util/time-helpers"
import { generateEventCard, updateScheduleBoard } from "./dom/schedule-board"
import { DateTime } from "luxon"
import { showEventDetailsModal } from "./dom/event-details-modal"
import { Agenda } from "./agenda"
import { initiateIcalDownload } from "./util/ical"

/**
 * Returns true if the provided query occurs anywhere in this event
 *
 * @param   {CSVRecord}  event  The event
 * @param   {string}     query  The query
 *
 * @return  {boolean}           Whether query matches event
 */
function matchEvent (event: CSVRecord|SessionPresentationRecord, query: string): boolean {
  if (event.title.toLowerCase().includes(query) || event.id.includes(query)) {
    return true
  }

  if (event.chair?.toLowerCase().includes(query) || event.location?.toLowerCase().includes(query)) {
    return true
  }

  if ('author' in event && event.author.toLowerCase().includes(query)) {
    return true
  }

  if ('abstract' in event && event.abstract.toLowerCase().includes(query)) {
    return true
  }

  if (event.type === 'session') {
    const anyMatch = event.presentations.map(p => matchEvent(p, query))
    if (anyMatch.some(v => v === true)) {
      return true
    }
  }

  return false
}

export interface ConferiaOptions {
  /**
   * Where in the DOM should the schedule live?
   */
  parent: HTMLElement
  /**
   * An optional title to be rendered above the schedule (useful if you have the
   * schedule live on its dedicated page)
   */
  title?: string
  /**
   * The link to the data file
   */
  src: string
  /**
   * If true, makes the library print out some debug info
   */
  debug?: boolean
  /**
   * Specifies if all events are in a single column for each day, of if the
   * various locations should form sub-columns under each day. Empty locations
   * (i.e. when a room is only used on specific days) won't be rendered.
   */
  groupByLocation: boolean
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
   * Allows you to specify some padding for the event cards on the calendar
   * (default: 10).
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
   * An optional function that you can use to correct the dates in your CSV
   * file. Use this to fix datetimes, if whichever application you peruse to
   * generate the CSV file cannot properly output ISO 8601 strings (such as
   * Microsoft Excel).
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
}

export class Conferia {
  private readonly opt: ConferiaOptions
  private loadPromise: Promise<void>
  private records: CSVRecord[]
  private columnScaleFactor: number
  private readonly dom: DOMStructure
  private query: string
  private showOnlyPersonalAgenda: boolean

  private agenda: Agenda

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
  private updateUI () {
    // Before doing anything, retrieve the records we are supposed to show.
    const records = this.filterRecords()

    // Then, figure out the axis limits and other information regarding the times.
    const dates: Array<[DateTime, DateTime]> = records.map(r => [r.dateStart, r.dateEnd])

    // First, the vertical (time) and horizontal (day) scale limits
    const earliestTime = getEarliestTime(dates.flat())
    const latestTime = getLatestTime(dates.flat())
    const earliestDay = getEarliestDay(dates.flat())
    const latestDay = getLatestDay(dates.flat())

    // Second, the shortest event duration (which determines the vertical
    // resolution). Minimum: 5 minutes (in case there are "zero-length" events)
    const shortestInterval = Math.max(300, getShortestInterval(dates))
    // How many days do we have in total?
    const days = Math.ceil(latestDay.diff(earliestDay).as('days'))

    // Calculate the "pixels per second," a measure to ensure the events have a
    // proper "minimum height."
    const MIN_HEIGHT = 25 // How small should the events be at minimum?
    const pps = MIN_HEIGHT / shortestInterval

    // Now, determine the "raster" size (minimum size for a time interval in
    // width and height based on the shortest interval)
    const COLUMN_WIDTH = 250 * this.columnScaleFactor

    // Determine the room-columns for each individual day. We need to pass this
    // info to the dayGutter updater so that it can add a second "heading row"
    // with the room designations at the corresponding places, AND we need to
    // offset the events based on that information.
    const roomsPerDay: Array<string[]> = []
    for (let i = 0; i < days; i++) {
      const today = earliestDay.plus({ days: i }).startOf('day')
      const todaysEvents = records.filter(r => {
        return r.dateStart.startOf('day').diff(today).as('days') === 0
      })
      const allRooms = [...new Set(todaysEvents.map(r => r.location).filter(l => l !== undefined).filter(l => l.trim() !== ''))]
      allRooms.sort()
      roomsPerDay[i] = allRooms
    }

    // Now, update the time and day gutters
    updateTimeGutter(this.dom.timeGutter, earliestTime, latestTime, pps)

    if (this.opt.groupByLocation) {
      updateDayGutter(this.dom.dayGutter, earliestDay, days, COLUMN_WIDTH, roomsPerDay)
    } else {
      updateDayGutter(this.dom.dayGutter, earliestDay, days, COLUMN_WIDTH)
    }

    // Draw a grid in the scheduleBoard
    const timeGridInterval = this.opt.timeGridSeconds ?? shortestInterval
    updateScheduleBoard(this.dom.scheduleBoard, COLUMN_WIDTH, timeGridInterval * pps)

    // Finally, draw the events on the scheduleboard
    this.dom.scheduleBoard.innerHTML = ''
    for (const event of records) {
      const card = generateEventCard(event, this.agenda)
      card.addEventListener('click', () => showEventDetailsModal(event))

      // Place the event on the schedule board
      const timeOffset = getTimeOffset(event.dateStart, earliestTime)
      const dayOffset = getDayOffset(event.dateEnd, earliestDay)

      const withinDayOffset = event.location ? roomsPerDay[dayOffset].indexOf(event.location) : 0
      const prevColumnsOffset = roomsPerDay.slice(0, dayOffset).reduce((prev, cur) => prev + cur.length, 0)
      
      const eventDuration = getTimeOffset(event.dateEnd, event.dateStart)

      const PADDING = this.opt.eventCardPadding ?? 10

      // Ensure each event is *at least* shortestInterval high.
      const height = Math.max(pps * shortestInterval, eventDuration * pps - PADDING * 2)

      card.style.top = `${timeOffset * pps + PADDING}px`
      card.style.height = `${height}px`

      // left & width are more complex
      if (this.opt.groupByLocation) {
        card.style.left = `${COLUMN_WIDTH * (prevColumnsOffset + withinDayOffset) + PADDING}px`
        if (event.location) {
          card.style.width = `${COLUMN_WIDTH - PADDING * 2}px`
        } else {
          card.style.width = `${COLUMN_WIDTH * roomsPerDay[dayOffset].length - PADDING * 2}px`
        }
      } else {
        card.style.left = `${COLUMN_WIDTH * dayOffset + PADDING}px`
        card.style.width = `${COLUMN_WIDTH - PADDING * 2}px`
      }

      this.dom.scheduleBoard.appendChild(card)
    }
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
    const response = await fetch(this.opt.src)
    const data = await response.text()
    const csv = parseCsv(data, this.opt.timeZone, this.opt.dateParser)

    if (this.opt.debug) {
      console.log(`Parsed ${csv.length} records from file ${this.opt.src}.`)
      console.log({ csv })
    }

    this.records = csv
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
