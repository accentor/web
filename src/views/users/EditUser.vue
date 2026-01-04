<template>
  <VContainer v-if="user" class="fill-height" fluid>
    <VRow no-gutters align="center" justify="center">
      <VCol md="4" sm="8" cols="12">
        <UserForm :user="user" :show-permissions="true" />
      </VCol>
    </VRow>
  </VContainer>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useHead } from "@unhead/vue";
import UserForm from "@/components/UserForm.vue";
import { useUsersStore } from "@/store/users";
import i18n from "@/i18n";

const usersStore = useUsersStore();
const route = useRoute();
const user = computed(() => usersStore.users[route.params.id as string]);
const title = computed(() =>
  i18n.global.t("page-titles.edit", { obj: user.value?.name }),
);

useHead({ title });
</script>
