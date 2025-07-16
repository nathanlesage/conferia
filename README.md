# Conferia.js

> Turn your conference schedule into an interactive agenda. A simple and
> straight-forward plug-and-play solution in only three steps.
> [View an interactive demo](https://nathanlesage.github.io/conferia/demo/)

Towards the end of the planning stage, organizers of academic conferences
usually run against one very fundamental problem: We now have this large Excel
spreadsheet with dozens of the sessions and keynotes, filled in and ready to go,
but it dawns upon you: How should you visualize this to your participants in a
way that participants can easily parse the program, and pick and choose the
sessions most interesting to them?

Conference organizers often have three options:

1. Distribute a simple PDF program to all participants. This works well for
   small conferences, but as the number of sessions and presentations grows,
   this can become unwieldy.
2. Write a custom solution for an interactive program. This can be a nice
   exercise, but runs against the issue of limited time.
3. Pay for an app. This has become more prevalent in recent years, but runs
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

* Bookmark/star individual events to create a personalized agenda
* Export either all events or just your agenda in an iCal file to quickly add it
  to your phone's calendar to never miss your sessions
* Easy drop-in solution that does not require any additional infrastructure: It
  works with every conference website
* Builds off the data you already have

## Getting Started

Getting started takes only a few minutes and some preparation:

1. Prepare a spreadsheet with your agenda according to the specifications.
2. Upload that spreadsheet to your website in a CSV format, and note the link.
3. Add Conferia.js to your website, provide the link to your spreadsheet to it,
   and the library will build an interactive agenda for you.

You can find all necessary information to get set up in the
[organizer's guide](https://nathanlesage.github.io/conferia/organizers-guide/).

## CSV Format

For a quick reference guide on the required CSV format, please refer to the
[CSV format guide](https://nathanlesage.github.io/conferia/csv-format/).

## Configuration

When instantiating the Conferia.js-library, you can pass configuration options
that determine the way the library behaves. You can find more information in the
[configuration guide](https://nathanlesage.github.io/conferia/configuration/).

## Developing

Conferia is a TypeScript library that uses Rollup as a bundler. To get started,
make sure you have a Node.js stack installed on your machine. Then, clone the
repository and install its dependencies. We provide NPM lockfiles, but using
Yarn or pnpm should also work (albeit these might ignore the lockfile).

```bash
$ git clone https://github.com/nathanlesage/conferia
$ cd conferia
$ npm install
$ npm run watch # Or `npm run build`
```

There are two commands available:

* `npm run build`: Builds the entire project into the `dist` folder.
* `npm run watch`: Does the same, but keeps a server open to preview the demo
  data and which automatically recompiles the app whenever a file changes.

The repository contains a variety of folders with different purposes:

* `dist`: This folder serves as the target for the built files. Whenever you
  change something, the JavaScript bundle will change, too. You should commit
  the updated files to git. The directory also houses the CSS files which you
  may want to update.
* `docs`: This folder contains the Conferia website and user/developer manual
  that lives at <https://nathanlesage.github.io/conferia/>. It also contains the
  demo files.
* `src`: This folder contains the actual source code.

Inside the `src` folder, you will find a few files that Conferia references:

* `dom`: This folder contains files that can build DOM structures or interact
  with the DOM itself. Since we do not use a framework like Vue or React, these
  files contain a certain amount of boilerplate.
* `icons`: This folder contains SVG icons that the app uses.
* `util`: This contains helper functions for time functionality as well as the
  iCal exporting.
* `agenda.ts`: This contains code to manage the user's personal agenda
  (including storage management).
* `conferia.ts`: The main class file for Conferia.
* `csv.ts`: A small CSV parser library to load in CSV files.
* `main.ts`: The main entry point that binds Conferia to the global scope.
* `global.d.ts`: Some global typings required for the app.

## Acknowledgements

Many of the design decisions that shaped Conferia.js have been influenced by
custom solutions I've seen over the years and functionality I wish they had.
More specifically, I have been inspired immensely by the conference schedules
that Carl Nordlund (IAS) has built for the NSA 2024 conference, and Laura
Alessandretti (Copenhagen) has built for the IC2S2 2023 conference in
Copenhagen. Thank you!

## License

Conferia.js &copy; 2025 Hendrik Erz. Conferia.js is licensed via the AGPL v3
license. You may use the library free of charge for commercial and private use,
but any modifications must be made available under a compatible license. For
more information, see the [LICENSE file](LICENSE).
