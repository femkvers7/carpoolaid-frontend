<script setup lang="ts">
const indexStore = useIndexStore();
const { isLoading } = storeToRefs(indexStore);

const profileStore = useProfileStore();
const { activeTab } = storeToRefs(profileStore);

const title = computed(() => {
  switch (activeTab.value) {
    case "saved-trips":
      return "Saved Trips";
    case "profile":
      return "Profile";
    case "settings":
      return "Settings";
    default:
      return "Profile";
  }
});
</script>

<template>
  <VFragment class="auth-page">
    <Loader v-show="isLoading" />
    <NavBar :show-hamburger="false" :show-profile="false" />
    <main>
      <ProfileSideBar />
      <Popup class="profile-main">
        <div class="p-4">
          <h2 class="mb-4">{{ title }}</h2>
          <slot />
        </div>
      </Popup>
    </main>
  </VFragment>
</template>

<style scoped lang="scss">
main {
  height: calc(100vh - 7.5rem);
  margin: 1rem 0;
  display: flex;
  .profile-main {
    width: 100%;
    margin-left: 1rem;
    padding: 1.25rem;
  }
}
</style>
