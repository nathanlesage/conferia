<script setup lang="ts">
import ParentLayout from '@vuepress/theme-default/layouts/Layout.vue'
import { computed, ref, watch } from 'vue'
import { useClientData } from 'vuepress/client'
import { Conferia } from "../../../src/conferia"

// We override the Layout to inject some JS code to provide the Demo page properly here.
// The big benefit of having switched to VuePress is that we can now finally use
// the exact state of Conferia in the repository to ensure the demo always reflects
// the latest state.
const clientData = useClientData()
// Only show on demo page
const isDemoPage = computed(() => clientData.pageData.value.path.startsWith("/demo"))
const conferiaDiv = ref<HTMLDivElement|null>(null)

watch(conferiaDiv, div => {
  // As soon as the div gets mounted on the page, set up Conferia
  if (div === null) {
    return
  }

  const conf = new Conferia({
    parent: div,
    src: 'test_data.csv',
    eventCardPadding: 10,
    timeZone: 'Europe/Stockholm'
  });

  conf.awaitBoot().then(() => {
    console.log('Conferia booted successfully. Access the instantiated Conferia.js object with "conf"');
    // @ts-expect-error Of course `conf` is not a property of the window object
    window.conf = conf;
  });
})
</script>

<template>
  <ParentLayout>
    <template #page-content-bottom>
      <div v-if="isDemoPage" ref="conferiaDiv" id="conferia">
      </div>
    </template>
    <template #page-bottom>
      <footer>Conferia.js &copy; Hendrik Erz</footer>
    </template>
  </ParentLayout>
</template>

<style lang="css">
/* Import the Conferia CSS styles */
@import "../../../dist/conferia.css";

footer {
  text-align: center;
}

/* VuePress sets some properties which we need to reset here */
h3.cf-event-title {
  padding-top: 0;
}
</style>
