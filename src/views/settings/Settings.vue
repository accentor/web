<template>
  <VContainer class="fill-height" fluid v-if="user">
    <VRow no-gutters align="center" justify="center">
      <VCol lg="4" md="6" sm="8" cols="12" class="px-3">
        <VForm @submit.prevent="submitLocale">
          <VSelect
            v-model="newLocale"
            :items="langs"
            label="Language"
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
import { mapGetters, mapMutations, mapState } from "vuex";
import AuthTokensTable from "../../components/AuthTokensTable";
import UserForm from "@/components/UserForm";

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
    ...mapGetters("auth", { user: "currentUser" }),
    ...mapGetters("auth", ["authTokens"]),
    ...mapState("userSettings", ["locale"]),
  },
  methods: {
    ...mapMutations("userSettings", ["setLocale"]),
    fillValues() {
      if (this.locale) {
        this.newLocale = this.locale;
      }
    },
    submitLocale: function () {
      this.setLocale({
        locale: this.newLocale,
      });
    },
  },
};
</script>
