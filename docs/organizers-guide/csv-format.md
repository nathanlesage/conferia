---
layout: page
title: CSV Format
---

The agenda data file needs to be a CSV file following a specific schema. The CSV
file contains one individual event per line. Not all the information is required
for all types of events.

> Tip: You can [download the demo test data](demo/test_data.csv) which allows
> you to quickly set up the correct file structure.

The CSV file needs to include these columns:

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
* `notes`: This column does not need to be present in the CSV file, but if it
  does, it can contain some text with notes for an event. For example, if you
  offer hybrid sessions, you could add the Zoom link here. Notes will be shown
  in the event details below the chair.

## Example

The following shows the demo data as a table, which gives you a visual
impression of how the data could look like:

|date_start         |date_end           |type                |title               |abstract                     |author              |location|session   |session_order|chair      |
|-------------------|-------------------|--------------------|--------------------|-----------------------------|--------------------|--------|----------|-------------|-----------|
|2025-01-01T12:00:00|2025-01-01T13:00:00|session_presentation|Presentation 1 Title|Abstract for presentation 1  |Author One          |TP22    |Parallel 1|1            |Author One |
|2025-01-01T12:00:00|2025-01-01T13:00:00|session_presentation|Presentation 2 Title|Abstract for presentation 2  |Author Two          |TP22    |Parallel 1|2            |Author One |
|2025-01-01T12:00:00|2025-01-01T13:00:00|session_presentation|Presentation 3 Title|Abstract for presentation 3  |Author Three        |TP22    |Parallel 1|3            |Author One |
|2025-01-01T12:00:00|2025-01-01T13:00:00|session_presentation|Presentation 4 Title|Abstract for presentation 4  |Author Four         |TP22    |Parallel 1|4            |Author One |
|2025-01-01T12:00:00|2025-01-01T13:00:00|session_presentation|Presentation 5 Title|Abstract for presentation 5  |Author Five         |TP23    |Parallel 2|1            |Author Five|
|2025-01-01T12:00:00|2025-01-01T13:00:00|session_presentation|Presentation 6 Title|Abstract for presentation 6  |Author Six          |TP23    |Parallel 2|2            |Author Five|
|2025-01-01T12:00:00|2025-01-01T13:00:00|session_presentation|Presentation 7 Title|Abstract for presentation 7  |Author Seven        |TP23    |Parallel 2|3            |Author Five|
|2025-01-01T12:00:00|2025-01-01T13:00:00|session_presentation|Presentation 8 Title|Abstract for presentation 8  |Author Eight        |TP23    |Parallel 2|4            |Author Five|
|2025-01-01T11:30:00|2025-01-01T12:00:00|special             |Opening remarks     |These are the opening remarks|Conference Committee|TP21    |          |             |           |
|2025-01-02T15:55:00|2025-01-02T16:00:00|special             |Closing remarks     |These are the closing remarks|Conference Committee|TP21    |          |             |           |
|2025-01-01T13:00:00|2025-01-01T13:30:00|meta                |Coffee break        |                             |                    |        |          |             |           |
|2025-01-02T13:00:00|2025-01-02T13:30:00|meta                |Coffee break        |                             |                    |        |          |             |           |
|2025-01-01T13:30:00|2025-01-01T15:00:00|keynote             |Keynote Title       |Abstract for keynote         |Keynote Author      |TP24    |          |             |           |
|2025-01-02T13:30:00|2025-01-02T15:00:00|keynote             |Second Keynote      |Abstract for second keynote  |Keynote Two Author  |TP24    |          |             |           |

## Tips

From having used Conferia.js in production, here are a few tips to help you save
more time and make your experience more pleasurable when working with the
schedule CSV file:

* Make use of colors in your spreadsheet. Since those won't be exported to CSV,
  they won't mess with your formatting, but can make it easier for you to
  navigate your schedule.
* The library will automatically filter out empty lines. Make use of this to
  space out groups of events to make identifying individual sessions easier.
* You can add as many arbitrary columns as you want to. Conferia ignores any
  column it doesn't recognize, so it is safe to store arbitrary data.
* Make use of Conferia's callback functions in the constructor to adjust your
  data in bulk. It can be faster to change a certain column in bulk using the
  callback function rather than ensuring that it has the appropriate format in
  the first place.
