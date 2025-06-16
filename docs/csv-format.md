---
layout: page
title: CSV Format
---

The agenda data file needs to be a CSV file following a specific schema. The CSV
file contains one individual event per line. Not all the information is required
for all types of events.

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

> Tip: The CSV file can contain more than these columns, which spares you from
> having to remove superfluous columns. Also, sometimes columns don't have to be
> filled in and can remain empty (e.g., locations for coffee breaks).
