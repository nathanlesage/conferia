# Getting Started

On a very basic level, adopting Conferia.js requires just two steps:

1. Create an Excel spreadsheet with your conference schedule, and export this to
   CSV. Upload this file to your website and ensure it is publicly accessible.
2. Create (ideally) a new blank page on your website, and add the Conferia.js
   setup code to the page's HTML.

A minimal example for embedding Conferia.js on your website could look like
this:

```html
<!-- Import Conferia.js-specific styles. -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/nathanlesage/conferia@main/dist/conferia.css">
<!-- Import the library -->
<script defer src="https://cdn.jsdelivr.net/gh/nathanlesage/conferia@main/dist/conferia.js"></script>
<!-- Set up the library and instantiate your schedule. -->
<script>
document.addEventListener('DOMContentLoaded', () => {
  const conf = new Conferia({
    parent: document.body,
    src: '/program.csv' // You can also specify the full URL if necessary
  })
})
</script>
```

> [!info]
> You have several options to decide which version of Conferia.js you want to
> use. By default, the code above targets the main develop branch, which ensures
> that once in a while, new changes will be loaded. However, this is
> **not advisable**, since this can break over time.
> 
> To ensure that you load a fixed version, you should specify the corresponding
> tag name of the most recent version of Conferia at the time of your event. To
> do so, check the [available tags on GitHub](https://github.com/nathanlesage/conferia/tags)
> and replace `conferia@main` with the corresponding most recent tag, e.g.:
> `conferia@0.6.0`.

Conferia.js will do a lot of heavy lifting under the hood to render your
schedule appropriately and easy to parse for your conference participants.
