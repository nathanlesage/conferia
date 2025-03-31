# User's Guide

This documentation is intended for participants of conferences which use
Conferia.js to display an interactive agenda. If you are a conference organizer,
feel free to distribute a link to this document to ensure your participants know
how to utilize the schedule.

## Overview

The schedule displays all events in a grid-like structure. On the horizontal
axis, you can see the conference days in ascending order, starting with the
first day. You can scroll horizontally to see the following days. On the
vertical axis, the schedule displays a time-grid giving you an overview of when
what happens. Scroll vertically to see all times.

If the conference features parallel sessions, each day is divided further into
sub-columns with all events grouped by their room. Events without a room will
span the full column width.

Each event is represented by a card. In the top-left, you can find the name of
the event in bold font. To the top-right, you can see the location the event is
happening in. Usually, this will be a room number, but for special events such
as dinners, it can specify the building/location.

You can click a card to display a detail view of the event.

Parallel sessions, i.e., events that feature multiple sequential presentations,
display a list of the presentation titles in the center of their card. You can
see the authors and abstracts of all presentations by clicking on the card to
open the detail view.

In the bottom right, you can find a "bookmark" icon. If you click it, this will
add the event to your personal agenda. Items on your personal agenda will
receive a colored highlight to indicate this fact to you.

## Searching for Events

On top of the schedule, you can find a search field. Type a search string in
there to search for specific events. The display will automatically update to
only show you events matching this query. The function searches everything, such
as titles, abstracts, authors, or locations.

## Your Personal Agenda

On top of the schedule, you can find a checkbox that, when clicked, will only
show items on your personal agenda. Use this to only view events you intend to
visit.

## Exporting Events

Finally, you can find an "Add to calendar" button over the schedule. This will
generate an iCal-file, which you can import into most common calendar systems,
such as Apple or Google Calendar, Outlook, or Nextcloud.

When you click this button, the system will ask you what you wish to export:

* **All events**: Clicking this button will export all events on the schedule.
  This can be a lot, and it is usually not recommended.
* **Visible events**: This will only export those events that are currently
  visible. This lets you, e.g., export the results of a search query.
* **Personal Agenda**: This exports all events from your personal agenda.

