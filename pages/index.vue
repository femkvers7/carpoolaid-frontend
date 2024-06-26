<script setup lang="ts">
import { useIndexStore } from "~/stores";
const indexStore = useIndexStore();
const { showSidebar, showSavePopup } = storeToRefs(indexStore);

const homeSuggestionsStore = useHomeSuggestionsStore();
const { suggestions, hideSuggestions } = storeToRefs(homeSuggestionsStore);

const homeCsvStore = useHomeCsvStore();
const { showColumnPopup, showPreviewPopup, columnChecks, columnNames } =
  storeToRefs(homeCsvStore);

const closePopups = () => {
  showColumnPopup.value = false;
  showPreviewPopup.value = false;
  columnChecks.value = {
    name: false,
    shift: false,
    carAvailability: false,
  };
  columnNames.value = {
    country: "Country",
    city: "City",
    postcode: "Postcode",
    street: "Street",
    address_number: "Address Number",
    name: "",
    startTime: "",
    endTime: "",
    carAvailability: "",
  };
};
</script>

<template>
  <VFragment>
    <Transition name="slide-fade">
      <HomeSideBar v-if="showSidebar" class="sidebar mt-4" />
    </Transition>
    <Transition name="slide">
      <SuggestionsContainer
        v-if="suggestions.length"
        class="suggestions"
        :style="{
          left: showSidebar ? 'calc(400px + 2rem)' : '1rem',
          bottom: hideSuggestions ? '-11rem' : '1rem',
          'max-width': showSidebar
            ? 'calc(100vw - 2rem - 1rem - 2rem - 400px)'
            : 'calc(100vw - 2rem - 2rem)',
        }"
      />
    </Transition>
    <Map class="map" />
    <ColumnPopup v-if="showColumnPopup" @close="closePopups" />
    <PreviewPopup v-if="showPreviewPopup" @close="closePopups" />
    <SavePopup v-if="showSavePopup" @close="showSavePopup = false" />
  </VFragment>
</template>

<style scoped lang="scss">
.map {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1;
}

.sidebar {
  position: relative;
  z-index: 2;
}

.suggestions {
  position: absolute;
  left: 1rem;
  z-index: 2;
  transition: left 0.3s ease-out;
  transition: bottom 0.3s ease-out;
}

/** Toggle sidebar transition */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s ease-out;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(-500px);
  opacity: 0;
}
</style>
