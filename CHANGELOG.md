# Upcoming

* Refactored Rollup config and dev-server to pull in a test-index from the new
  resources folder. The program.csv to be loaded is also stored there.
* Conferia now stores the user config to local storage. This allows users to
  retain any customization (i.e., the default view mode or a search query)
  across reloads of the browser window, saved per each individual device.
* The maximum height of the standalone Conferia app is now 80% of the available
  window height. This will show the footer bar on most devices.

# Release 0.27.0

* Improve no-results-found message to indicate why no events could not be found.
  Now, the no-results message is contextualized based on settings, and indicate
  if no results have been found *on the personal agenda*, or *on a given day* or
  *in general*, depending on which view the user has selected.
* Improve rollup config for better development UX.
* Refactored a few additional datetime helpers.

# Release 0.26.0

* Explicitly type Window augmentation in export.
* Default font from serif to sans-serif (can still be overridden by the site
  CSS).
* Add unit testing framework
* Move some remaining `console.log`s to `debug`.

# Release 0.25.0

* Export the `Conferia` object as a default export to give organizers more
  flexibility.
* Fix coloring of the day indicator in compact mode in the dark color scheme.
* Fix module system and configuration. Now the package explicitly declares
  itself as an ECMA module (because it is intended entirely for use in the
  browser).

# Release 0.24.0

* Improved error messages: Mistakes in the CSV will now log the (0-based) line
  number where the error originated to make it easier to fix problems.
* Sessions are now grouped not just by the session names, but also by their
  start dates. This allows conference organizers to re-use the exact same
  session name multiple times, which allows splitting up larger logical sessions
  into multiple blocks (i.e., interspersed with coffee/lunch breaks).

# Release 0.23.0

* Minify the widget when releasing a new version. This reduces the bundle size
  by about 4x (ca. 500kb to ca. 130kb). This should speed up library loading.
* Fixed a styling issue that would cause the widget not to fill the entire
  screen in fullscreen mode.
* Updated all dependencies.
* Changed the target to ES2023 to get access to newer APIs. This means that
  Conferia now requires a browser that implements at least the 2023 standard of
  JavaScript (previously: 2015). All major browsers have supported this standard
  since July 2023. See more at https://www.w3schools.com/js/js_2023.asp.

# Release 0.22.0

* Feature: Allow organizers to add some `intro` information to better describe
  their conference
* Fixed mounting position of title and intro information. If any of these are
  present they will now be correctly mounted before the entire Conferia widget
  itself, ensuring they can be hidden when the widget is in full screen, and are
  not interfering with the rest of the DOM structure.

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
