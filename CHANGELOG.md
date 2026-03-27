# Release 0.21.0

* Feature: Added a new, "compact" view mode that, when enabled, will only show
  events on a single day. If this mode is active, the toolbar now shows a new
  day selector which users can use to navigate through the conference. By
  default, users on mobile devices will start in the single-day compact mode,
  while desktop users get the full view. Conference organizers can determine
  which mode the library should initialize in.
* Feature: As long as the user does not interact with the schedule board, the
  library will keep the current time always on screen as long as the conference
  is currently happening. As soon as they scroll manually, auto-scrolling will
  be disabled.
* Added a spacer to separate the more used buttons from others (clear and help).
* Fixed a bug that would not trigger the "clear data" action when the
  corresponding toolbar button was pressed.
* Added a time indicator that shows the current time relative to the events
  during the conference to visualize where in the conference the current time
  is. This is indicated as a red bar across the schedule bar that slowly moves
  with the time. This indicator only shows up when the conference is actually
  happening to help participants quickly identify happening events.
* When the conference is happening, the library will now re-draw the UI every
  minute to update the position of the time indicator properly.
* Allow configuring an autoreload of the schedule (#3).
* Minor code refactors.
* Fixed keynote authors not appearing in iCal download (#2).

# Release 0.20.0

* If the user has no items on the personal agenda and toggles it, the no-events
  card now indicates that.
* Only show the day tick background color for the actual column to avoid visual
  clutter.
* Lots of clean up in the code.

# Release 0.19.0

* Scroll to top when updating the UI with no records to show.
* Make day dividers span the entire height of the schedule board.
* The day indicator now always stays visible while scrolling left and right.
* Fix day gutter height to match time gutter width.
* Fix wrapper font color in dark mode.

# Releases 0.1.0–0.18.0

*This changelog has been started after version 0.18.0. Please refer to the git history for a list of changes.*
