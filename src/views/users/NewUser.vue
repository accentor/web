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
import { useI18n } from "vue-i18n";

const I18n = useI18n();
useHead({ title: I18n.t("users.new") });
</script>
