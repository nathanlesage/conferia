# Conferia.js

> Turn your conference schedule into an interactive agenda. A simple and
> straight-forward plug-and-play solution in only three steps.

Towards the end of the planning stage, organizers of academic conferences
usually run against one very fundamental problem: We now have this large Excel
spreadsheet with dozens of the sessions and keynotes, filled in and ready to go,
but now it hits you: How should you visualize this to your participants in a way
that they can easily parse the program, and pick and choose the sessions most
interesting to them?

Conference organizers often have three options:

1. Distribute a simple PDF program to all participants. This works well for
   small conferences, but as the number of sessions and presentations grows,
   this can become unwieldy.
2. Write a custom solution for an interactive program. This can be a nice
   exercise, but runs against the issue that, as the planning progresses, more
   tasks amass, so this is rarely possible.
3. Employ an app. This has become more prevalent in recent years, but runs
   against privacy concerns and the simple fact that it forces users to download
   a single-use app onto their phone that becomes useless after the conference.

Conferia.js aims to solve these issues. It offers a very simple plug-and-play
solution for conference organizers that aims to pick you up where you are and
give you an interactive agenda that lives off of your Excel spreadsheet.

Adopting Conferia.js is simple: Prepare your Excel sheet, upload it to your
website, and add Conferia.js to the appropriate page. Conferia.js takes all the
heavy lifting from you, and works with your data to present the best-possible
interactive visualization of your conference program, with no compromises.

Conferia.js is based off years of organizational work and knowledge of data-
processing; from academics for academics. It is non-intrusive, fully GDPR-
compliant, and works on every phone. In addition to displaying your agenda in
an interactive interface, it comes with other benefits:

* Allow users to zoom in and out of the agenda to see more or less, which adapts
  to their phone screen's size
* Bookmark/star individual events to create a personalized agenda
* Export either all events or just your agenda in an iCal file to quickly add it
  to your phone's calendar to never miss your sessions
* Easy drop-in solution that does not require any additional infrastructure: It
  works with every conference website
* Builds off the data you already have

## Getting Started

Getting started takes only a few minutes and some preparation:

1. Prepare a spreadsheet with your agenda according to the specifications
   described below
2. Upload that spreadsheet to your website in a CSV format, and note the link
3. Add Conferia.js to your website, provide the link to your spreadsheet to it,
   and the library will build an interactive agenda for you

In more detail, here's what you need to do:

### 1. Prepare your Spreadsheet

Conferia.js takes as much work off of you as possible, but you will need to
provide it with the proper data format. This includes providing several data
columns with information, such as the start and end date of sessions, repeating
this information for the individual presentations, and add a few other pieces of
information.

We estimate that this step will take you the longest. However, with a bit of
preparation, you should be able to create some script file in R or Python to
transform whichever spreadsheet format the software you use provides into the
format required by Conferia.js. Then, any changes are as simple as running the
script again, and replacing the data file.

### 2. Upload the Spreadsheet

Once your spreadsheet is in order, export it as a CSV file, and upload this file
to your website. You can also upload it to a different server, the important
part is only that the file is publicly accessible, since the library will
download the file from there.

> [!NOTE]
> Depending on where you upload the file, you may encounter [CORS](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)-errors. If the
> library is unable to download the data, try hosting the data file on the same
> domain as your website. For example, if the agenda lives at
> `https://agenda.example.com`, host the data file at, say,
> `https://agenda.example.com/data.csv`.

### 3. Add Conferia.js and load the data

Finally, it is time to add Conferia.js. To do so, you will need to modify the
HTML code of your program page. If you use a static page generator such as
Jekyll, you can just add the code to the designated program page. If you use a
CMS such as WordPress, there are plugins available that allow you to inject some
HTML code into pages which you can use.

You need to first include the library itself by adding a `script` tag as well as
its stylesheet link in the `<head>` of your page:

```html
<script defer src="https://cdn.jsdelivr.net/gh/nathanlesage/conferia@main/dist/conferia.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/nathanlesage/conferia@main/dist/conferia.css">
```

> [!TIP]
> The `defer` keyword ensures that the library only loads after the rest of the
> page has loaded. This can make the experience look snappier.

Next, you need to instantiate Conferia.js, providing your data:

```html
<script>
document.addEventListener('DOMContentLoaded', () => {
  const conf = new Conferia({
    parent: document.body,
    src: 'http://www.example.com/program.csv',
    groupByLocation: true
  })
})
</script>
```

That's all! Once a visitor loads the page, Conferia.js will download the data,
parse it, and construct a user interface with which your visitors can interact.

Read below for a description of all configuration options you can use to
customize the experience.

## CSV Format

The agenda data file needs to be a CSV file following a specific schema. The CSV
file contains one individual event per line. Not all the information is required
for all types of events. The CSV file needs to include these columns:

* `date_start`: The start date, in ISO 8601-format (e.g., `2025-01-01T12:00:00`)
* `date_end`: The end date, in ISO 8601-format (e.g., `2025-01-01T12:30:00`)
* `type`: The type of the event. Must be one of:
  * `session_presentation`: A regular presentation or lightning talk that is
    part of a (parallel) session.
  * `meta`: A meta-type of event. These do not have authors or abstracts and are
    intended to identify, e.g., coffee or lunch breaks.
  * `single`, `keynote`, `special`: These types all are technically
    the same, but allow you to categorize different types of events. Our
    intuition is to use the `keynote` type for Keynotes, `special` for special
    conference-wide events (such as a conference dinner, opening and closing
    remarks), and `single` for any type of event that doesn't match the other
    categories. You are free to re-define any of these categories depending on
    the types of events your conference offers, since the categories won't be
    displayed to the users.
* `title`: The title of the event
* `abstract`: The abstract for the event
* `author`: The author(s) for the event
* `location`: The location for the event. This is used to match up parallel
  sessions and group events by location, so make sure to not vary the spelling
  of your locations. Usually, you will want to use just room numbers for
  anything happening in the main venue, and include more information only for
  external events (such as conference dinners).
* `session`: The name of the session for this event (only needed for
  `session_presentation`). This is used to group presentations in sessions
  together. Examples could be "Parallel Sessions 1" or "Parallel Sessions 2".
* `session_order`: A number specifying the order of a single session
  presentation within their session (e.g., for four presentations, you would use
  1, 2, 3, and 4).
* `chair`: An optional chair for the session, keynote, or other event.

> [!TIP]
> The CSV file can contain more than these columns, which spares you from having
> to remove superfluous columns. Also, several columns don't have to be filled
> in and can remain empty (e.g., locations for coffee breaks).

## Configuration

When instantiating the Conferia.js-library, you can pass configuration options
that determine the way the library behaves. Below you can find all of them with
a short explanation. For more information, please see the documentation.

```typescript
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
   * Specifies the timezone for all datetimes in the data set. We recommend to
   * set this if you do not add timezone information to the CSV file (see below)
   *
   * This information needs to be a IANA-compatible string. A list of all can be
   * found on Wikipedia (column: "TZ identifier"):
   * https://en.wikipedia.org/wiki/List_of_tz_database_time_zones#List
   */
  timeZone?: string
  /**
   * An optional function that you can use to correct the dates in your CSV
   * file. Use this to fix datetimes, if whichever application you peruse to
   * generate the CSV file cannot properly output ISO 8601 strings (such as
   * Microsoft Excel).
   */
  dateParser?: (dateString: string, luxon: typeof DateTime) => string
}
```

## Acknowledgements

Many of the design decisions that shaped Conferia.js have been influenced by
custom solutions I've seen over the years and functionality I wish they had.
More specifically, I have been inspired immensely by the conference schedules
that Carl Nordlund (IAS) has built for the NSA 2024 conference, and Laura
Allessandretti (Copenhagen) has built for the IC2S2 2023 conference in
Copenhagen. Thank you!

## License

Conferia.js &copy; 2025 Hendrik Erz. Conferia.js is licensed via the AGPL v3
license. You may use the library free of charge for commercial and private use,
but any modifications must be made available under a compatible license. For
more information, see the LICENSE file.
