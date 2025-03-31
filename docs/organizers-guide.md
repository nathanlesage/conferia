# Organizer's Guide

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
    src: 'http://www.example.com/program.csv',
    groupByLocation: true
  })
})
</script>
```

Conferia.js will do a lot of heavy lifting under the hood to render your
schedule appropriately and easy to parse for your conference participants.

## Detailed Instructions

We recommend you make the decision to adopt Conferia.js at the latest during the
review stage for the abstracts. In any case, you should do so before you begin
actually planning the bulk of your conference program. You can also adopt it at
the last minute, but this may involve double-work, which you may want to avoid.

### Preparing and Filling in the Excel Spreadsheet

Once you have adopted Conferia.js, we recommend that you immediately begin to
prepare an Excel spreadsheet (or Google Docs -- whichever floats your boat), and
pre-set it with the necessary columns. Then, you can fill in the information you
already have (such as the conference days or keynotes, coffee breaks, or dinner)
in placeholder cells so that you can just copy them around once you start
filling in the main program.

If you already know in advance how many (parallel) sessions your conference will
end up having, it may also make sense to fill in empty rows for each
presentation so that you only have to fill in authors, titles, and abstracts
after the assignment is over.

Be prepared that filling in this information will take some time. (It may also
be wise to build an automated program export based on this Excel spreadsheet if
you plan to distribute a PDF/printed program, too.)

Once your spreadsheet is ready, make sure to test it before releasing the
interactive schedule to the participants. Errors are human and errors happen,
but an error you spot in advance is a good error ;)

Export it to CSV and ensure that the CSV file looks good. The CSV parser that
comes with Conferia.js may not be the most robust one, so it is imperative to
ensure that it can properly parse it in advance.

### Preparing a Location for Your Schedule

While the spreadsheet is being prepared, begin scouting for a good location for
the schedule. If you can, set up a dummy page already at this stage. If the page
is publicly accessible, feel free to add a message, e.g., "The schedule will
follow soon," to prepare your participants that the schedule will go live here.

Make sure the following conditions are true:

1. You can edit the page's HTML code, specifically, you have access to the `<head>`
2. You can upload a CSV file to your website and view it in your browser (or be prompted to download it)

### Adopting Conferia.js

Once you have a good location and a final CSV file, it is time to set up
Conferia.js. To do so, first upload the CSV file to your website. Ideally, it
will be available under the same domain as the schedule, because otherwise your
visitors may run into so-called CORS errors.

Then, add the corresponding code to your page, and provide the path to your
CSV file. Adapt the various configuration options as necessary.

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

### Customizing Conferia.js

Configuring the schedule is possible via a set of configuration options. Please
refer to the [README.md](../README.md) to see a full list of configuration
options and their meaning.

In this section, we only highlight a few more important options that we believe
you are most likely to customize or make use of:

#### `parent`

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

#### `groupByLocation`

This property allows you to determine if the library should create a single
column for each day, or generate sub-columns for each individual room. If you
have a conference without any overlaps, we recommend setting this to `false` to
make the schedule more compact.

However, since Conferia.js has been developed mainly for larger conferences, and
those usually feature parallel sessions, we recommend setting this to `true`. In
this case, the library will, for each day, determine which locations are present
and put events happening at that location into their own column.

> **Note**: If you set this to `false` but have parallel sessions, those will be
> displayed on top of each other, meaning that only one session is actually
> visible to participants, with the rest being hidden behind that one.

#### `timeZone`

We absolutely and urgently recommend that you set this property. Set this to the
timezone in which the conference is happening. E.g., for a conference in New
York, set this to `America/New_York`, and for one in Norrköping (Sweden), set it
to `Europe/Stockholm`. This must be a IANA compatible timezone string, of which
you can find the correct one for you [on this Wikipedia page](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones#List).

Setting this property ensures that Conferia.js does not get confused due to
conflicting timezones (see "A Note on Times and Timezones" below for more
information). Also, this can make creation of the spreadsheet simpler, as you
can ignore the timezone information (because this will be the same for all
events anyway).

#### `dateParser`

This is a custom JavaScript function that you can utilize to transform the date
columns of the CSV file into correct, ISO 8601-compliant datetime strings. This
can be very handy if it is either faster for you to enter dates in a different
format, or if you face difficulties outputting proper dates into the CSV file.

This function receives a raw date string, coming directly from your CSV file,
and should return an ISO 8601-compliant datetime string. As its second argument,
it will return the Luxon `DateTime` constructor which gives you more flexibility
than JavaScript's built-int `Date` object (particularly since it will assume the
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
   timezone.

> [!WARNING]
> If you use option 2 and specify the timezone in the configuration, this will
> direct the library to set the timezone of each date accordingly. If the
> datetimes in your data file have no timezone information present, this will
> just add the timezone information without further changes. However, if some
> datetimes have timezone information present, this will adjust the times
> according to the time difference between the existing timezone and the new
> one.
