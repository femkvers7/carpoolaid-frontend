<script setup lang="ts">
import { logoutUser } from "~/modules/api/auth";
import { useProfileStore } from "~/stores/profile";

const handleLogout = () => {
  logoutUser();
};

const profileStore = useProfileStore();
const { activeTab } = storeToRefs(profileStore);
</script>
<template>
  <Popup class="wrapper">
    <ul>
      <div>
        <!--
        <li>
          <NuxtLink
            to="/profile"
            :class="{
              active: activeTab === 'profile',
            }"
          >
            <Icon fill="var(--green)" size="16px" name="person-fill" />
            Profile
          </NuxtLink>
        </li>
        -->
        <li>
          <NuxtLink
            to="/profile/saved-trips"
            :class="{
              active: activeTab === 'saved-trips',
            }"
          >
            <Icon
              fill="var(--green)"
              size="16px"
              width="12px"
              name="bookmark"
            />
            Saved trips
          </NuxtLink>
        </li>
        <!--
        <li>
          <NuxtLink
            to="/profile/settings"
            :class="{
              active: activeTab === 'settings',
            }"
          >
            <Icon fill="var(--green)" size="16px" name="settings" />
            Settings
          </NuxtLink>
        </li>
        -->
      </div>
      <li>
        <Button variant="neutral" class="logout" @click="handleLogout">
          <Icon fill="var(--purple)" height="12px" size="16px" name="logout" />
          Logout
        </Button>
      </li>
    </ul>
  </Popup>
</template>

<style scoped lang="scss">
.wrapper {
  width: 18rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  overflow-y: auto;
  ul {
    padding: 1.25rem 1.75rem;
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    justify-content: space-between;
    li > * {
      display: flex;
      gap: 0.5rem;
      align-items: center;
      margin: 0.75rem 0;
      position: relative;
      &.active::after {
        content: "";
        width: 5px;
        height: 100%;
        position: absolute;
        right: 0;
        background-color: var(--green);
        border-radius: 12px;
      }
      &:hover {
        font-weight: bold;
      }
    }
    li:not(:last-child) {
      border-bottom: 1px solid var(--purple);
    }
    .logout {
      padding: 1rem 0;
    }
  }
}
</style>
