---
layout: home
---

Conferia.js is a drop-in solution that connects the needs of conference
organizers and participants. For organizers, it aims to make it easy to create
an interactive agenda with little overhead. This is especially crucial since
organizing a conference usually involves many working hours, especially once the
abstracts are accepted and the agenda setting begins. Conferia.js stays out of
the way by only requiring a data file that conference organizers usually need to
create anyhow.

At the same time, Conferia.js makes it easy and straight-forward for
participants to parse and understand the conference schedule. Conferia.js comes
as a full solution for participants to find and filter events, create their own
personal schedule, and even add the events to their own calendar to never miss
an exciting presentation.

> You can see an [interactive demo](demo) to experience Conferia.js.

This documentation includes three documents:

* [An interactive demo with test data to try the tool out.](demo/index.md)
* [A comprehensive setup guide for conference organizers.](organizers-guide.md)
* [A user's guide for participants and users of the app.](users-guide.md)

If you spot a bug, please
[create a bug report](https://github.com/nathanlesage/conferia/issues) on GitHub
to make the app better for everyone.

## Why Conferia.js?

Academic conferences are fun. At least they are while you're there, after your
presentation, while you're enjoying your time at the conference dinner. But in
order for a conference to be fun, someone needs to organize it.

If you have ever organized a conference, you will know how exhausting it can be.
Essentially, you need to manage a team of people, most of which have little to
no experience with event management, in order to ensure that a bigger group of
people have a good time. You need to organize abstract submissions, create a
website, set up registration, book rooms, organize keynote speakers, and more.

One of the last things conference organizers do before the event starts is
finalize the agenda. This is where things become difficult. Organizers naturally
want to spend as little time as possible on making the agenda beautiful, with
the limited energy better directed towards the many construction sites that
still remain. Participants, on the other hand, can feel quite lost if they have
difficulties parsing the conference agenda. They can't find the sessions they
are interested in, or the correct room. They have no way to manage their time,
and this can be very frustrating.

In order to avoid issues, conference organizers usually choose one of three ways
to deal with the problem of agenda creation:

1. Do nothing. Simply paste the agenda into a Word document and call it a day.
   This works especially for small conferences with few (and not overlapping)
   sessions.
2. Pay a company to transform the program into an interactive agenda. This is
   usually the fastest way, but it often comes with proprietary apps that
   participants need to download for a single-time use. Also, data privacy is
   always a gamble, and not every institute has the necessary funds to afford
   such a solution.
3. Develop a custom solution. This can sometimes be seen in Computer Science and
   adjacent fields, where people possess the necessary knowledge to come up with
   some small interactive agenda tool. However, this is almost never possible
   due to the complexity and time-constraints.

Conferia.js is the answer to all of these ails. It satisfies both the time and
organizing capabilities of conference organizers and delivers a great user
experience when it comes to navigating your participants through the maze of
your event. Conference organizers need to spend almost no time setting it up, it
works out of the box, and it immediately delivers a great experience.

## Case Study: IC2S2 2025

Conferia.js has been developed as a solution for the International Conference on
Computational Social Science (IC2S2) 2025 in Norrköping, Sweden. Organized by
the small Institute for Analytical Sociology (IAS), it felt a bit like David
versus Goliath: A small organizing team versus the largest international
conference of the entire discipline.

This immediately created a problem: With only a few people involved in the
day-to-day planning of the event, every available minute was already reserved
months in advance. However, the sheer scale of the event necessitated a
professional solution to agenda planning. With over 290 accepted presentations,
sorted into 48 parallel sessions and 8 available rooms over 3 days, any solution
would need to be resilient, efficient, and fast.

In the early days of the organization, the conference chairs agreed that a
custom solution was needed. The chairs decided that forcing participants to
download a single-use app onto their phones was not great, and so the only
option was to build a custom solution. Over the span of a few weeks, Hendrik Erz
sat down and started developing such a solution which eventually would become
Conferia.js.

And the work paid off: Once the initial solution was ready, program creation
started. After about two weeks of intense work by the conference chair team, all
talks were properly sorted into the available sessions and spread out over the
three conference days. With a few additional lines for the keynotes, tutorials,
coffee breaks and the conference dinner, the spreadsheet that emerged from the
program creation process could be turned into a properly functioning Conferia.js
instance with almost no changes to the Excel file. It took a single person about
one single working day to add rooms, dates, session names, and a bit of
additional information to the program, which could be loaded into Conferia with
zero overhead.

And the best? From now on, any conference – regardless of how big or small – can
use this solution to generate conference agendas with very little overhead for
either organizers or participants.
