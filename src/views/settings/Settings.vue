<template>
  <VContainer class="fill-height" fluid v-if="user">
    <VRow no-gutters align="center" justify="center">
      <VCol lg="4" md="6" sm="8" cols="12" class="px-3">
        <VForm @submit.prevent="submitSettings">
          <VSelect
            v-model="newLocale"
            :items="langs"
            label="Language"
          ></VSelect>
          <VSelect
            v-model="newCodecConversion"
            :items="codecConversions"
            :label="$t('settings.codec-conversion.label')"
          ></VSelect>
          <VBtn color="primary" class="ma-2" type="submit">
            {{ $t("common.change-settings") }}
          </VBtn>
        </VForm>
      </VCol>
      <VCol lg="4" md="6" sm="8" cols="12" class="px-3">
        <UserForm :user="user" redirectFallback="home" />
      </VCol>
    </VRow>
    <VRow>
      <VCol>
        <AuthTokensTable :authTokens="authTokens" />
      </VCol>
    </VRow>
  </VContainer>
</template>

<script>
import { mapActions, mapState } from "pinia";
import AuthTokensTable from "../../components/AuthTokensTable.vue";
import UserForm from "@/components/UserForm.vue";
import { useAuthStore } from "../../store/auth";
import { useAuthTokensStore } from "../../store/auth_tokens";
import { useCodecConversionsStore } from "../../store/codec_conversions";
import { useUserSettingsStore } from "../../store/user_settings";

export default {
  name: "Settings",
  components: { AuthTokensTable, UserForm },
  metaInfo() {
    return { title: this.$t("common.settings") };
  },
  data() {
    return {
      newLocale: "",
      langs: [
        { value: "en", text: "English" },
        { value: "nl", text: "Nederlands" },
      ],
      newCodecConversion: null,
    };
  },
  created() {
    this.$nextTick(() => {
      this.fillValues();
    });
  },
  watch: {
    locale() {
      this.fillValues();
    },
  },
  computed: {
    ...mapState(useAuthStore, { user: "currentUser" }),
    ...mapState(useAuthTokensStore, ["authTokens"]),
    ...mapState(useCodecConversionsStore, {
      storeCodecConversions: "allCodecConversions",
    }),
    ...mapState(useUserSettingsStore, ["locale", "codecConversion"]),
    codecConversions() {
      return this.storeCodecConversions.reduce(
        (acc, cc) => {
          acc.push({
            text: cc.name,
            value: cc.id,
          });
          return acc;
        },
        [{ text: this.$t("settings.codec-conversion.original"), value: null }],
      );
    },
  },
  methods: {
    ...mapActions(useUserSettingsStore, ["setSettings"]),
    fillValues() {
      if (this.locale) {
        this.newLocale = this.locale;
      }
      if (this.codecConversion) {
        this.newCodecConversion = this.codecConversion.id;
      }
    },
    submitSettings: function () {
      this.setSettings({
        locale: this.newLocale,
        codecConversionID: this.newCodecConversion,
      });
    },
  },
};
</script>
