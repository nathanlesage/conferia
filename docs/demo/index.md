---
permalink: /demo/
layout: default
---

# Demo

Below you can find a demo of Conferia.js using a test agenda. This demo utilizes
some random generated fake data to showcase the library. Any similarities with
real existing people or research projects are mere coincidence.

You can [download the demo data (CSV file)](test_data.csv).

<div id="conferia"></div>

<script>
  document.addEventListener('DOMContentLoaded', () => {
    const conf = new Conferia({
      parent: document.getElementById('conferia'),
      src: 'test_data.csv',
      eventCardPadding: 10,
      timeZone: 'Europe/Stockholm'
    })

    conf.awaitBoot().then(() => {
      console.log('Conferia booted successfully. Access the instantiated Conferia.js object with `conf`.')
      window.conf = conf
    })
  })
</script>
