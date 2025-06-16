---
layout: page
title: Organizer's Guide
permalink: /organizers-guide/
---

As a conference organizer wanting to adopt Conferia.js, this documentation
contains all you need to know in order to successfully add Conferia.js to your
conference website.

In case adopting it is difficult for you, feel free to open an issue on GitHub.
We cannot promise to accommodate your request, but are happy to consider it.

## Quickstart

On a very basic level, adopting Conferia.js requires just two steps:

1. Create an Excel spreadsheet with your conference schedule, and export this to
   CSV. Upload this file to your website and ensure it is publicly accessible.
2. Create (ideally) a new blank page on your website, and add the Conferia.js
   code to the page's HTML.

A minimal example for embedding Conferia.js on your website could look like
this:

```html
<!-- Import Conferia.js-specific styles. -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/nathanlesage/conferia@main/dist/conferia.css">
<!-- Import the library -->
<script defer src="https://cdn.jsdelivr.net/gh/nathanlesage/conferia@main/dist/conferia.js"></script>
<!-- Set up the library and instantiate your schedule. -->
<script>
document.addEventListener('DOMContentLoaded', () => {
  const conf = new Conferia({
    parent: document.body,
    src: '/program.csv', // You can also specify the full URL if necessary
    groupByLocation: true
  })
})
</script>
```

> You have several options to decide which version of Conferia.js you want to
> use. By default, the code above targets the main develop branch, which ensures
> that once in a while, new changes will be loaded. However, this is
> **not advisable**, since this will break over time. To ensure that you load a
> fixed version, you should specify the corresponding tag name of the most
> recent version of Conferia at the time of your event. To do so, check the
> [available tags on GitHub](https://github.com/nathanlesage/conferia/tags) and
> replace `conferia@main` with the corresponding most recent tag, e.g.:
> `conferia@0.6.0`.

Conferia.js will do a lot of heavy lifting under the hood to render your
schedule appropriately and easy to parse for your conference participants.

## Detailed Instructions

We recommend you make the decision to adopt Conferia.js at the latest during the
review stage for the abstracts. In any case, you should do so before you begin
actually planning the bulk of your conference program. You can also adopt it at
the last minute, but this may involve double-work, which you may want to avoid.

### 1. Preparing and Filling in the Excel Spreadsheet

Once you have adopted Conferia.js, we recommend that you immediately begin to
prepare an Excel spreadsheet (or Google Docs -- whichever floats your boat), and
pre-set it with the necessary columns. Then, you can already fill in information
such as keynotes, lunch breaks, or the conference dinner date.

Refer to the [CSV format reference](csv-format.md) to see exactly which columns
are required.

Be prepared that filling in this information will take some time. (It may also
be wise to build an automated program export based on this Excel spreadsheet if
you plan to distribute a PDF/printed program, too.)

Once your spreadsheet is ready, make sure to test it before releasing the
interactive schedule to the participants. Errors are human and errors happen,
but only an error you spot in advance is a good error ;)

Export it to CSV and ensure that the CSV file looks good. The CSV parser that
comes with Conferia.js is not the most robust one, so it is imperative to ensure
that it can properly parse your agenda in advance.

### 2. Preparing a Location for Your Schedule

While the spreadsheet is being prepared, begin scouting for a good location for
the schedule. If you can, set up a dummy page already at this stage. If the page
is publicly accessible, feel free to add a message, e.g., "The schedule will
follow soon," to prepare your participants that the schedule will go live here.

Make sure the following conditions are true:

1. You can edit the page's HTML code, specifically, you have access to the `<head>`
2. You can upload a CSV file to your website and view it in your browser (or be prompted to download it)

If your page is not publicly accessible, it may be wise to already load in the
not-yet-ready spreadsheet to test that everything works and looks as expected.

### 3. Adopting Conferia.js

Once you have a good location and a final CSV file, it is time to set up
Conferia.js. To do so, first upload the CSV file to your website. Ideally, it
will be available under the same domain as the schedule, because otherwise your
visitors may run into so-called CORS errors.

Then, add the corresponding code to your page, and provide the path to your
CSV file. Adapt the various configuration options as necessary. Refer to the
[configuration guide](configuration.md) for a complete list of configuration
options.

```html
<!-- Import Conferia.js-specific styles. -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/nathanlesage/conferia@main/dist/conferia.css">
<!-- Import the library -->
<script defer src="https://cdn.jsdelivr.net/gh/nathanlesage/conferia@main/dist/conferia.js"></script>
<!-- Set up the library and instantiate your schedule. -->
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

Open the page and ensure that all events are properly displayed. Depending on
the size of your schedule, it may take a while until Conferia.js has loaded the
events.

## Customizing Conferia.js

Configuring the schedule is possible via a set of configuration options. Please
refer to the [configuration guide](configuration.md) to see a full list of
configuration options and their meaning.

In this section, we only highlight a few more important and complex options that
we believe you are most likely to customize or make use of.

### `parent`

The `parent` option determines where on the page Conferia.js will live. The
library will mount the schedule under whichever HTML node you provide here. If
you have a dedicated page for Conferia.js which does not contain anything else,
we recommend you use `document.body`.

In that case, we *also* recommend setting a title so that the website has a
title and not just the schedule.

If you plan on integrating Conferia.js with a page that also has other content,
you should provide an appropriate node here. For example, if you want to load
the schedule into a specific element, you can add it to your page, using a
unique ID, and provide that element to the library. For example:

```html
<!-- In your page's <head> -->
<script>
  // Other initialization code ...
  new Conferia({ parent: document.getElementById('my-conference-schedule') })
  // Other code ...
</script>

<!-- Somewhere else on the website -->
<div id="my-conference-schedule"></div>
```

In this case, only set the `title` element if appropriate, since the function of
the schedule should also be apparent from the page's context.

### `timeZone`

We absolutely and urgently recommend that you set this property. Set this to the
timezone in which the conference is happening. E.g., for a conference in New
York, set this to `America/New_York`, and for one in Norrköping (Sweden), set it
to `Europe/Stockholm`. This must be a IANA compatible timezone string, of which
you can find the correct one for you
[on this Wikipedia page](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones#List).

Setting this property ensures that Conferia.js does not get confused due to
conflicting timezones (see
"[A Note on Times and Timezones](#a-note-on-times-and-timezones)" below for more
information). Also, this can make creation of the spreadsheet simpler, as you
can ignore the timezone information (because this will be the same for all
events anyway).

### `dateParser`

This is a custom JavaScript function that you can utilize to transform the date
columns of the CSV file into correct, ISO 8601-compliant datetime strings. This
can be very handy if it is either faster for you to enter dates in a different
format, or if you face difficulties outputting proper dates into the CSV file.

This function receives a raw date string, coming directly from your CSV file,
and should return an ISO 8601-compliant datetime string. As its second argument,
it will return the Luxon `DateTime` constructor which gives you more flexibility
than JavaScript's built-in `Date` object (particularly since it will assume the
user's local timezone, instead of the correct one, when parsing data).

> **Note**: If you carelessly use JavaScript's Date function, you may run into
> issues since the ISO 8601-string returned by the date's `toISOString` function
> transforms the date into UTC. Be careful, and see the notes in the section on
> time and timezones below.

**Example: Turning a US-datestring into ISO 8601**

In this example, we assume that whichever program you use can only output (or
has accidentally output) US-style date strings. Often, you can work with the
`Date` object, but you are really only limited by whatever JavaScript can do.

```javascript
// ... other code ...
new Conferfia({
  // ... other options ...
  dateParser (dateString, luxon) {
    // We receive, e.g., "Mar 13, 2024, 9:00am". In this case, the
    // built-in parser of JavaScript can usually transform this easily.
    const date = new Date(dateString)
    // Returns 2024-03-13T08:00:00.000Z. NOTE that this is a different hour,
    // because (in this contrived example) my browser uses the GMT+0100 timezone
    // In that case, you can instead construct a date object with Luxon and pass
    // the appropriate timezone to it.
    return date.toISOString()
  }
})
// ... other code ...
```

**Example: Converting Google Docs Dates**

This is a real-life example: When preparing a first set of events for use with
Conferia.js, I inserted the dates to Google Sheets in the format
`YYYY-MM-DDTHH:MM:SS`. Google (correctly) assumed this was a date, but
unfortunately re-formatted the dates and removed the `T` in the middle, making
the library unable to parse the dates. We ended up using the following parser
function to fix this:

```javascript
dateParser (dateString, luxon) {
  // Input: YYYY-MM-DD HH:MM:SS
  return dateString.split(' ').join('T')
}
```

### `rowParser`

This is another optional JavaScript function you can provide to perform various
custom transformations on the data if necessary. To understand this, you should
note that you can provide whatever additional fields in your CSV file; Conferia
only requires the ones we explain below. Additional fields are permitted and
simply ignored by the library.

However, you may want to use this to your advantage to amend any information of
the events with additional columns from the CSV file, or even to simply modify
the auto-generated parsed record that Conferia generates.

If provided, the function will be called for each parsed CSV line and receives
three arguments:

* `row`: This is a string array containing the split, raw cells of the row.
* `header`: This is a string array containing the header row of the CSV file.
  You can use this to properly find the index of the correct column in your
  data.
* `record`: This is either an instance of `CSVRecord`, or
  `SessionPresentationRecord`, which represents the `row`s contents already
  parsed by the library. You can modify this record as you desire (but make
  sure not to delete fields or change their data type). You need to return the
  record afterwards.

The function **must** return the record again, after you are done modifying it.

**Example: Adding an OpenReview submission ID after the title**

This is a real-life example: We wanted to have the submission IDs which
OpenReview has assigned to our accepted presentations after the title so that
participants could quickly filter by this ID. However, that information lived in
a separate column in the CSV file, meaning that it was not yet part of the
title. While one solution would have been to manually adapt all titles, it was
quicker to utilize the `rowParser` function. In it, we retrieved the
corresponding column of the OpenReview submission IDs, extracted the cell
content, and amended the title accordingly.

```javascript
rowParser (row, header, record) {
  // Only the actual session_presentations have submission IDs.
  if (record.type !== 'session_presentation') {
    return record
  }

  // Use the `header` to retrieve the correct column
  const openReviewIdx = header.indexOf('openreview_id')
  if (openReviewIdx < 0) {
    console.warn('`openreview_id` Column not found in CSV')
    return record
  }

  // Return the record, but with its title property amended in the format
  // "Presentation title (#1234)"
  return {
    ...record,
    title: record.title + ` (#${row[openReviewIdx]})`
  }
}
```

> Note that this means that the `rowParser` function will **not** be called for
> any of the actual `session` records, since those are created after parsing the
> CSV file from the individual `session_presentation` records.

## A Note on Times and Timezones

Conferia.js requires you to provide time and date using the ISO 8601 format. The
reason is that this is a very comprehensive format that allows to specify where
and when something is extremely precisely, or very loosely. In the context of
conferences, most times are already precise enough if they only indicate day,
hour, and the minute. In ISO 8601, say, March 3rd, 2025 at 12:30pm corresponds
to `2025-03-03T12:30`. This would be a valid timestamp in ISO 8601.

When it comes to displaying these times in Conferia.js itself, it's straight
forward: Regardless of which timezone the user's device is set to, it will
always look the same. 12:30pm is always displayed as 12:30pm, and this is the
only thing the user cares about. If they look at the timetable from Europe and
then fly to the U.S. West Coast, the times will remain static, and only behind
the scenes will the timezone quietly change from CET to PST as their phone or
laptop recognizes they have landed on the other side of the world. Conferia.js
essentially ignores the timezone information on display.

*However*, this behavior breaks as soon as you move outside of Conferia.js. If
users export their (personalized) agenda as iCal files, for example, timezone
suddenly becomes important. The reason is that, when users import times into,
say, Apple or Google calendar, these apps will quietly assume the local
timezone, too, if no timezone information is specified. However, since calendars
always display the times in the current local timezone, this means that they
will now move the times around in accordance to the offset.

Think about the example with moving from CET to PST again. If a user is in
Europe, prepares which sessions they want to see, and exports that information
into their calendar, 12:30pm will show up as 12:30pm just fine. However, as they
leave the plane in San Francisco, their phone will recognize the new timezone,
and adjust the display of all events. And the 12:30pm event will suddenly show
up at 4:30am (8 hour time difference).

This is why providing the correct timezone is critical. Not for simply viewing
the schedule, but for letting users export these events as iCal files. In
addition, setting a timezone explicitly prevents any confusion to begin with.

You can provide the timezone in two ways:

1. You can add the timezone information to your spreadsheet. Software that lets
   you export a set of events to a spreadsheet often already comes with
   functionality to output "full" ISO 8601 timestamps. Then you won't have to
   worry, because the timezone information is present, and it will work out of
   the box both inside Conferia.js, and inside the users' calendars.
2. You can manually specify the timezone in the configuration of Conferia.js.
   Doing so will move every timestamp within the data file into the correct
   timezone. **We recommend this approach, unless you can be absolutely certain that all events have proper timezones.**

> **WARNING**: Since we are humans, we recommend to choose option 2 and leave
> out all timezone specific information in your spreadsheet. The reason is that
> we may forget the timezone at one of the events, and adding the timezone
> information is cumbersome. So, the times in the spreadsheet should look like
> this: `2025-07-22T13:00:00` (no timezone information afterwards). Then,
> provide the timezone in the Conferia template.
> **Note that, if you have events with timezone info attached, they will be silently converted to the configured timezone, yielding wrong information.**
