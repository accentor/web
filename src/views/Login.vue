<template>
  <VMain>
    <VContainer class="fill-height" fluid>
      <VRow no-gutters align="center" justify="center">
        <VCol md="4" sm="8" cols="12">
          <VCard class="elevation-12">
            <VToolbar color="primary" dark>
              <VToolbarTitle>
                {{ I18n.t("common.login") }}
              </VToolbarTitle>
            </VToolbar>
            <VCardText>
              <VForm @submit.prevent="submit">
                <Errors />
                <VTextField
                  v-model="name"
                  :label="I18n.t('users.name')"
                  :placeholder="I18n.t('users.name')"
                  prepend-icon="mdi-account"
                  autocomplete="username"
                />
                <VTextField
                  v-model="password"
                  :label="I18n.t('users.password')"
                  :placeholder="I18n.t('users.password')"
                  prepend-icon="mdi-key"
                  type="password"
                  autocomplete="current-password"
                />
                <VBtn color="primary" class="ma-2" type="submit">
                  {{ I18n.t("common.login") }}
                </VBtn>
              </VForm>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
    </VContainer>
  </VMain>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useHead } from "@unhead/vue";
import Errors from "@/components/Errors.vue";
import { useErrorsStore } from "@/store/errors";
import { useAuthStore } from "@/store/auth";
import { useI18n } from "vue-i18n";

const I18n = useI18n();
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const errorsStore = useErrorsStore();

const name = ref("");
const password = ref("");

useHead({ title: I18n.t("common.login") });

async function redirect(): Promise<void> {
  const path = (route.query.redirect || "/app/") as string;
  await router.push({ path });
}

async function submit(): Promise<void> {
  errorsStore.clearErrors();
  const succeeded = await authStore.login({
    name: name.value,
    password: password.value,
  });
  if (succeeded) {
    redirect();
  }
}
</script>
