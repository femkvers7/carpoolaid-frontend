<script setup lang="ts">
import { useProfileStore } from "../../stores/profile";

definePageMeta({
  title: "Profile",
  layout: "profile",
});

const profileStore = useProfileStore();
const { activeTab } = storeToRefs(profileStore);

activeTab.value = "profile";
</script>

<template>
  <div>this is the profile page</div>
</template>
