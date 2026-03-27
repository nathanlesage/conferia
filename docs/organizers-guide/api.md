---
layout: page
title: API
---

While simply setting up Conferia is likely sufficient for many conferences, the
library comes with a powerful API that allows you to extend and customize its
functionality further.

> Using the API requires some basic knowledge of (asynchronous) JavaScript.
> Also, the API has no guard rails against improper behavior. Make sure you
> understand what you do! It is very easy to break things.

## Accessing the Conferia Instance

Before you can work with the Conferia library, you need to access the Conferia
instance that you create when calling `new Conferia()`. In the quickstart guide,
we have simply created a Conferia instance and assigned it to the variable
`conf`:

```javascript
const conf = new Conferia({
  parent: document.body,
  src: '/program.csv'
})
```

You can now access the `conf` object to programmatically control the instance.

## Awaiting the Initial Load

Immediately when you instantiate the library, it will not be of much use,
because it first needs to fetch the CSV data and parse it. This can take some
time. To get notified once this is done, you can use the `awaitBoot` method.
This method returns a `Promise`. When this promise resolves, you can be sure
that the library has loaded the initial batch of data and you can access it:

```javascript
conf.awaitBoot().then(() => {
  // Now you can, e.g., access the records from the object.
})
```

> Note that this will only work directly after the initialization of the
> library. If you have configured Conferia to periodically reload the data, you
> will have to retrieve the updated records yourself from time to time.

## API Reference

In the following, we document all methods and properties of the Conferia
instance that you can use.

### Instance Methods

Conferia offers three methods to retrieve a subset of CSV records from the
instance that you can access. Each one returns a list of CSVRecords. To see the
reference for the CSVRecord objects, see its type reference below.

`Conferia.getRecords() => CSVRecord[]`

: This method returns all records from the instance. These will be already parsed
and are the same that Conferia will display on the board. You can use this to,
e.g., offer the entire agenda also as a list. To see what this could look like,
take a look at the
[IC2S2 2025 program page](https://ic2s2-2025.org/program/#interactive-schedule).

`Conferia.getVisibleRecords() => CSVRecord[]`

: This method returns all *currently visible* records from the instance. That is,
this method gives you the same subset of the records that are currently visible
on the schedule board.

`Conferia.getUserAgendaRecords() => CSVRecord[]`

: Similar to the methods above, this returns all records that are also part of the
user agenda.

### Instance Properties

Besides methods, the Conferia instance also exposes a set of public properties
that allow you to interact with the instance:

#### `Conferia.state`

This is the state machine for the library. It exposes a `get` and a `set` method
to change the state, and an event listener to be notified when the state
changes. Which state properties are part of the application state can differ
between releases, so instead of documenting all current properties here, we
refer you to the source code, where you can always find an up-to-date list of
settings that the state includes.

In general, you can interact with the state like so:

```typescript
// Get a property
const value = conf.state.get('propertyName')
// Set a property
conf.state.set('propertyName', value)

conf.state.on('change', (which, value) => {
  // This callback will be called whenever the state changes. "which" includes
  // the property key, and "value" the new value.
})
```

> **Important**: We expose this for the convenience of extending Conferia, but
> we take no responsibility if you set the library into an erroneous state.
> There is no state recovery built in. Use this at your own risk.

#### `Conferia.agenda`

This accessor allows you to access the personal user agenda. You could use this,
e.g., in conjunction with the record retrieval methods to add or remove items
from a user's agenda if you provide a custom schedule list. The agenda works
very similar to the application state, except that the agenda always works with
the `id` properties of a CSV record.

You have the following methods at your disposal:

`conf.agenda.addItem(record.id)`

: Add an item to the user's agenda. Will show the intro dialog if the user has
never before added an item.

`conf.agenda.removeItem(record.id)`

: Removes an item from the user's agenda

`conf.agenda.clearPersonalAgenda()`

: Clears the entire agenda. Will trigger a user confirmation dialog.

`conf.agenda.hasItem(record.id)`

: Checks whether the provided record is on the user's agenda.

`conf.agenda.getItems()`

: Returns all items on the user's agenda.

### Type Reference: CSV Record

Since you will primarily interact with CSV records, we document their shape here.

`id`

: An auto-generated ID for this record.

`type`

: Describes the type of this record. Can be `single`, `keynote`, `meta`,
`special`, `session`, or `session_presentation`.

`dateStart`

: The start of the event, as a luxon `DateTime`.

`dateEnd`

: The end of the event, as a luxon `DateTime`.

`title`

: The title of the event.

`location`

: Optional (can be undefined), the location string for this event.

`chair`

: Optional (can be undefined), the chair for this event.

`notes`

: Optional (can be undefined), any notes for this event.

`presentations`

: Only for session records. Contains a list of all presentations in this session.
Presentations have all the general properties of CSV records (title, date, etc.)
plus `abstract`, `author`, `session` (the session title), and `sessionOrder`
(the sorting of the presentations).

`abstract`

: Only available for records of type `session_presentation`, `single`,
`keynote`, and `special`.

`author`

: Only available for records of type `session_presentation`, `single`,
`keynote`, and `special`.

> Note that, while `session_presentation` records contain the same type of
> information as other records, they will never be part of lists of CSV records
> returned from the object. Instead, they are always part of `session` records.
