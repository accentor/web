<template>
  <VContainer class="fill-height" fluid>
    <VRow no-gutters align="center" justify="center">
      <VCol md="4" sm="8" cols="12">
        <UserForm :show-permissions="true" />
      </VCol>
    </VRow>
  </VContainer>
</template>

<script setup lang="ts">
import { useHead } from "@unhead/vue";
import UserForm from "@/components/UserForm.vue";
import i18n from "@/i18n";

useHead({ title: i18n.global.t("users.new") });
</script>
