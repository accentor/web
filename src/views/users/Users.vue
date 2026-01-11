<template>
  <VContainer fluid>
    <VRow justify="end">
      <VBtn v-if="isAdmin" :to="{ name: 'new-user' }" color="success">
        <VIcon start>mdi-plus</VIcon>
        {{ $t("users.new") }}
      </VBtn>
    </VRow>
    <VRow v-if="users.length > 0">
      <VCol
        v-for="user in users"
        :key="user.id"
        xl="2"
        lg="3"
        md="4"
        sm="6"
        cols="12"
      >
        <VCard :to="{ name: 'user', params: { id: user.id } }">
          <VCardTitle class="pb-0">
            {{ user.name }}
          </VCardTitle>
          <VCardText>
            {{ $t(`users.permission.${user.permission}`) }}
          </VCardText>
          <VCardActions v-if="isAdmin">
            <VBtn
              :to="{
                name: 'edit-user',
                params: { id: user.id },
                query: { redirect: $route.fullPath },
              }"
              color="warning"
              class="ma-2"
              icon
              size="small"
              variant="text"
            >
              <VIcon size="x-large">mdi-pencil</VIcon>
            </VBtn>
            <VBtn
              color="error"
              class="ma-2"
              href="#"
              icon
              size="small"
              variant="text"
              @click.stop.prevent="deleteUser(user.id)"
            >
              <VIcon size="x-large">mdi-delete</VIcon>
            </VBtn>
          </VCardActions>
        </VCard>
      </VCol>
    </VRow>
  </VContainer>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/store/auth";
import { useUsersStore } from "@/store/users";
import { useHead } from "@unhead/vue";
import i18n from "@/i18n";

const usersStore = useUsersStore();

useHead({ title: i18n.global.tc("users.users", 2) });

const { isAdmin } = storeToRefs(useAuthStore());
const { usersByName: users } = storeToRefs(usersStore);

async function deleteUser(id: number): Promise<void> {
  if (confirm(i18n.global.t("common.are-you-sure"))) {
    await usersStore.destroy(id);
  }
}
</script>
