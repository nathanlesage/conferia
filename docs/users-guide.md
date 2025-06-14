---
layout: page
title: User's Guide
permalink: /users-guide/
---

This documentation is intended for participants of conferences which use
Conferia.js to display an interactive agenda. If you are a conference organizer,
feel free to distribute a link to this document to ensure your participants know
how to utilize the schedule. It is also linked from the footer of any Conferia
instance so that users can click a link to land here.

## Overview

The schedule displays all events in a grid-like structure. On the horizontal
axis, you can see the conference days in ascending order, starting with the
first day. You can scroll horizontally to see the following days. On the
vertical axis, the schedule displays a time-grid giving you an overview of when
what happens. Scroll vertically to see all times.

If the conference features parallel sessions, each day is divided further into
sub-columns with all events grouped by their room. Events without a room or with
no conflicting, parallel event, will span the full column width.

Each event is represented by a card. In the top-left of each card, you can find
the name of the event in bold font. To the top-right, you can see the location
the event is happening in. Usually, this will be a room number, but for special
events such as dinners, it can specify the building/location.

You can click a card to display a detail view of the event.

Parallel sessions, i.e., events that feature multiple sequential presentations,
display a list of the presentation titles in the center of their card. You can
view the authors and abstracts of all presentations by clicking on the card to
open the detail view.

In the bottom right, you can find a "bookmark" icon. If you click it, this will
add the event to your personal agenda. Items on your personal agenda will
receive a colored highlight to indicate this fact to you.

## The Toolbar

Conferia features a toolbar at the top of the schedule, with some controls.

### Searching for Events

At top of the schedule, you can find a search field. Type a search string in
there to search for specific events. The display will automatically update to
only show you events matching this query. The function searches everything, such
as titles, abstracts, authors, or locations.

### Your Personal Agenda

Next to the search field, you can find a checkbox that, when clicked, will only
show items on your personal agenda. Use this to only view events you intend to
visit.

### Exporting Events

Finally, you can find an "Add to calendar" button in the toolbar. This will
generate an iCal-file, which you can import into most common calendar systems,
such as Apple or Google Calendar, Outlook, or Nextcloud.

When you click this button, the system will ask you what you wish to export:

* **All events**: Clicking this button will export all events on the schedule.
  This can be a lot, and it is usually not recommended.
* **Visible events**: This will only export those events that are currently
  visible. This lets you, e.g., export the results of a search query.
* **Personal Agenda**: This exports all events from your personal agenda.

### Viewing the Agenda in Fullscreen

The next button in the toolbar is a fullscreen button. Click it to make the
agenda fullscreen. This is especially convenient if the agenda lives on a page
on the conference website and has a lot of margin to the sides. This feature may
not work in all browsers (e.g., on iOS, this button unfortunately does nothing).

## Suggested Workflow / How to Use Conferia

Conferia tries to be accommodating to a wide variety of user wishes. However, it
does have a certain conference participant in mind. To finish the user guide,
let us describe how we intend you to use the library most efficiently. We use
the case of "Jane Doe" to explain how we imagine the workflow of the app.

Jane Doe has received an acceptance letter for a conference presentation. She
currently works as a Postdoc at the University of Vienna. The conference is in
Melbourne, Australia. About a month before the conference, she receives a
notification that the conference schedule is finally live and implemented via
Conferia.js.

Jane immediately opens the website on her work computer/laptop and is greeted
with the conference agenda. Naturally, she first wants to know when she will
present, so she uses the search box to find the session her submission is in.
She clicks the bookmark icon at the bottom of the session card to add her own
presentation to her personal agenda.

Next, Jane also adds all the keynotes to her personal agenda, since none of them
are overlapping, and this way she will be able to quickly confirm whether she
actually wants to visit one, or maybe skip it. She selects the checkbox in the
toolbar to get a first impression of what her personal schedule looks like now.
She browses the agenda a bit more to get an impression on other sessions that
will happen, but ultimately closes the agenda without adding other events so
that she can think about which sessions she is interested in.

A few days, and some chats with her colleagues later, she opens the agenda again
to make some decisions. Conferia has saved her personal agenda in her browser's
storage so that the system remembers which events she selected. Now, she selects
the sessions she is really interested in. On one day, she cannot really decide
between two parallel sessions, so she decides to add both to her agenda. With
another look at only her personal agenda, she confirms that she is mostly set
and happy with her schedule so far, and closes the browser again.

On the last day of work before she has to go to the airport to visit the
conference, she opens the agenda one final time in Vienna. This time, she wants
to add all events to her phone's calendar so that she knows what is happening
even if she has no access to the agenda itself. By doing this right before the
conference happens, she ensures that any changes to the agenda that have been
added after her last visit will be part of the events. After verifying her 
agenda one final time, she clicks the button to download an iCal file, and
chooses to download only her personal agenda. The website prompts her to
download the file. Since her calendar is synchronized with both her work
computer and her phone, she immediately opens the file on her laptop, adding all
events to her calendar. She waits a bit and confirms that her phone also shows
the events. She notices that all events are at odd times, confirming that they
are saved in the local Melbourne timezone.

The next morning, she boards a plane to Melbourne. After a long flight and some
time to acclimate to the new timezone, the conference starts. She checks her
phone to see where the opening remarks will happen, and walks to the conference
venue. Later that day, she has lunch with a colleague from the U.S., who
mentions that there is a very interesting session in the afternoon. Jane checks
her phone but sees that she has only selected another presentation to visit. To
check out the recommendation, she opens the agenda on her phone and searches for
the event to have another look. She decides it may be worthwhile to check it
out.

Since there is no personal agenda on her phone yet, she clicks the bookmark
icon, and download the single event she just added to her agenda as an iCal
file. The event immediately shows up, and she has another hour to decide. As the
conference progresses, she can use her agenda in the phone to quickly find her
rooms and effortlessly move between sessions, giving her time to chat with
colleagues and friends a little bit longer.
