# Workflow

Conferia.js is designed to fit right into any conference organizing team's
workflow. However, since it is an additional piece to juggle, it is crucial to
embed any steps necessary to adopt Conferia.js at the right time to keep the
overhead minimal.

If done right, we expect that you will need to account for **a single additional
person-day of about 8 hours** to make it work.

## Precautions

Before integrating Conferia.js, you should make three precautions to ensure you
are all set for using Conferia.js for your conference.

### Deciding to Adopt Conferia.js

If you wish to offer an interactive agenda to your conference participants, you
should make the decision to integrate with Conferia.js in the early stages of
your planning. We recommend making this decision before the call even goes out
to ensure that the entire team is aware that Conferia.js is part of the
organization effort and everyone can be on the lookout to account for the
library throughout the effort, including how the abstract submission system is
set up.

> [!caution]
> The latest time to decide to adopt Conferia.js without incurring additional
> work is the day you send out acceptance letters. As soon as you start to
> develop the program, you should ensure to do this in a format that allows you
> to copy and paste the schedule.

### Requirements for Conferia.js

After deciding to use Conferia.js, you should immediately start to make the
necessary preparations to use Conferia.js for your conference. The library has
been designed to be extremely resource-efficient. You do not have to write any
code to use it, and we have ensured that the library does all the heavy lifting
so that you can focus on the actual academic part of your conference.

Nevertheless, the library does have a few simple requirements that you should
get sorted out as soon as possible:

* You will need to have some web space where you can upload HTML code (typically
  a conference website).
* You need to be able to upload a CSV file that is publicly accessible.

These requirements can be easily met. We have developed Conferia.js with many
common setups in mind so that most organizers should be able to use it. Some
common ones are:

* **Custom Conference Website**: This is the easiest way. Many scholars tend to
  create their own conference websites, either from scratch or via GitHub Pages.
  In those cases, you already have all prerequisites for using Conferia and have
  additionally a lot of flexibility to customize the library to your needs.
* **Managed CMS (WordPress, Drupal, etc.)**: The next-best case is a managed CMS
  that many universities offer for conferences. It is important to test out
  how to include Conferia.js early so that you know what you need to keep in
  mind.
* **WYSIWYG Website Builder**: Some universities and institutes have very
  restrictive setups where you are merely allowed to edit some text and images
  on the website. In those cases, it can be a bit more difficult to set up
  Conferia. However, in the past, we have had some conferences in this setup and
  it was possible to talk to the IT department who were happy to help out to
  ensure we could use Conferia regardless.

> [!tip]
> Even if you think that adopting Conferia.js works out of the box, we highly
> recommend you test it out, for example using a hidden test-page with some test
> data. Experience shows that technology will always throw some curveballs, so
> being prepared is important to not face issues as the conference is proceeding
> when many other fires want to be tended to as well.

### Oddities with Exporting

Some spreadsheet software has some quirks when exporting to CSV, and this might
become an issue if you are not prepared. Especially the dates need to be in the
ISO 8601 format, and, for example, Google Drive, does not retain the format,
even if you add it in.

The library offers you a set of options that you can use to work around such
quirks, but you need to be aware of them. Please take a look at the
[configuration documentation](./configuration.md) to learn all about the ways to
mitigate any software quirks you have.

## Step 1: Prepare the Schedule

To use Conferia.js, you will need to provide it with a CSV-file (Comma-separated
Values) that contains a set of fields which need to conform to certain
requirements.

The library assumes that you will plan the conference schedule with all
sessions, presentations, and keynotes, in an Excel spreadsheet (or,
alternatively, Google Drive). We recommend that you create the template for this
spreadsheet as early as possible and have a meeting where the organizing team is
informed about the format so that no mistakes happen when the spreadsheet is
filled in.

The spreadsheet must contain one event per row, with a set of columns that
correspond to the event type. To learn about all required fields, please consult
the [CSV Format Documentation](csv-format.md).

> [!tip]
> If you already name the columns exactly as the CSV format dictates, you will
> be able to export the schedule and have it ready to go immediately without
> having to rename anything.

## Step 2: Fill in the Schedule

Once the acceptance letters are sent out, it is time to fill the schedule. In
the past it has proven great to divide up the schedule into sections. We
recommend you place any workshops or tutorials at the beginning, followed by the
keynotes and special events. Afterwards, add a section for all coffee and lunch
breaks, followed by any social events in the evening(s). After those "special"
sections, you can start adding your parallel sessions with all their
presentations.

The reason is that you typically know early on which workshops or tutorials are
going to happen, and neither lunch- nor coffee-breaks withdraw their attendance.
This means that the most volatile part where you will need to add and remove
presentations as the conference approaches is in one place.

Finally, when it comes to adding all presentations, this is typically a large
amount of events in the hundreds. We recommend you export a long list of all
accepted presentations alongside their titles, author(s), and abstracts, and
place them in the spreadsheet before sorting them into individual sessions. Of
course, this also depends on whether sessions are set prior to submission, or
will be formed based on what came in.

> [!tip]
> The library will ignore empty lines, so we recommend you separate your various
> sections with empty lines, which will make it easier to parse the schedule and
> find the correct places to edit.
> 
> The same holds true for parallel sessions: Since each session consists
> typically of four to eight rows with individual presentations, spacing each
> session with an empty line makes it much easier to find the correct session.
>
> Finally, we recommend you make use of colors. Most spreadsheet software allows
> you to color text, and these colors don't get exported into the CSV file. This
> can additionally make it easier for you to keep an overview over your
> schedule.

## Step 3: Testing Locally

Once you have a first draft of your schedule, we recommend that you test this
locally. By exporting your spreadsheet to CSV and loading it in a minimal HTML
file, you can see if everything looks good. Oftentimes, there will be subtle
errors that become clear only once Conferia.js attempts to load your data, and
by testing locally, you can ensure that you catch those issues before they cause
detriment for your participants.
