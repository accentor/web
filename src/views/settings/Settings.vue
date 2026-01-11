<template>
  <template v-if="user">
    <VRow no-gutters align="center" justify="center">
      <VCol lg="4" md="6" sm="8" cols="12" class="px-3">
        <VForm @submit.prevent="submitSettings">
          <VSelect v-model="newLocale" :items="langs" label="Language" />
          <VSelect
            v-model="newCodecConversion"
            :items="codecConversions"
            :label="I18n.t('settings.codec-conversion.label')"
          />
          <VBtn color="primary" class="ma-2" type="submit">
            {{ I18n.t("common.change-settings") }}
          </VBtn>
        </VForm>
      </VCol>
      <VCol lg="4" md="6" sm="8" cols="12" class="px-3">
        <UserForm :user="user" redirect-fallback="home" />
      </VCol>
    </VRow>
    <VRow>
      <VCol>
        <AuthTokensTable :auth-tokens="authTokens" />
      </VCol>
    </VRow>
  </template>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import AuthTokensTable from "@/components/AuthTokensTable.vue";
import UserForm from "@/components/UserForm.vue";
import { useAuthStore } from "@/store/auth";
import { useAuthTokensStore } from "@/store/auth_tokens";
import { useCodecConversionsStore } from "@/store/codec_conversions";
import { useUserSettingsStore } from "@/store/user_settings";
import { computed, onMounted, ref, watch } from "vue";
import { useHead } from "@unhead/vue";
import { useI18n } from "vue-i18n";

const I18n = useI18n();
const codecConversionsStore = useCodecConversionsStore();
const userSettingsStore = useUserSettingsStore();

useHead({ title: I18n.t("common.settings") });

const newLocale = ref<"en" | "nl" | "">("");

const langs = [
  { value: "en", title: "English" },
  { value: "nl", title: "Nederlands" },
];

const newCodecConversion = ref<number | null>(null);

const { currentUser: user } = storeToRefs(useAuthStore());
const { authTokens } = storeToRefs(useAuthTokensStore());
const { locale, codecConversion } = storeToRefs(userSettingsStore);

const codecConversions = computed(() => {
  return [
    {
      title: I18n.t("settings.codec-conversion.original"),
      value: null as number | null,
    },
  ].concat(
    ...codecConversionsStore.allCodecConversions.map((cc) => ({
      title: cc.name,
      value: cc.id,
    })),
  );
});

watch(locale, fillValues);
onMounted(fillValues);

function fillValues(): void {
  if (locale.value) {
    newLocale.value = locale.value;
  }
  if (codecConversion.value) {
    newCodecConversion.value = codecConversion.value.id;
  }
}

function submitSettings(): void {
  if (newLocale.value) {
    userSettingsStore.setSettings({
      locale: newLocale.value,
      codecConversionID: newCodecConversion.value,
    });
  }
}
</script>
