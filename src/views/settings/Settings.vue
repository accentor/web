<template>
  <VContainer class="fill-height" fluid v-if="user">
    <vue-headful :title="$t('common.settings') + ' | Accentor'" />
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
        <VForm
          v-model="isValid"
          ref="userForm"
          @submit.prevent="submitPassword"
        >
          <VTextField
            :label="$t('common.name')"
            v-model="newUser.name"
            autocomplete="username"
            required
            :rules="[(v) => !!v || $t('errors.user.name-blank')]"
          />
          <VTextField
            :label="$t('users.current-password')"
            type="password"
            autocomplete="current-password"
            v-model="newUser.current_password"
            :rules="rules.current"
          />
          <VTextField
            :label="$t('users.password')"
            type="password"
            autocomplete="new-password"
            v-model="newUser.password"
            :rules="rules.password"
          />
          <VTextField
            :label="$t('users.confirm-password')"
            type="password"
            autocomplete="new-password"
            required
            :rules="rules.confirmation"
            v-model="newUser.password_confirmation"
          />
          <VBtn color="primary" class="ma-2" type="submit">
            {{ $t("common.change-settings") }}
          </VBtn>
        </VForm>
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
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";
import AuthTokensTable from "../../components/AuthTokensTable";

export default {
  name: "Settings",
  components: { AuthTokensTable },
  data() {
    return {
      newUser: {
        current_password: "",
        name: "",
        password: "",
        password_confirmation: "",
      },
      isValid: true,
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
    user() {
      this.fillValues();
    },
    locale() {
      this.fillValues();
    },
  },
  computed: {
    ...mapGetters("auth", { user: "currentUser" }),
    ...mapGetters("auth", ["authTokens"]),
    ...mapState("userSettings", ["locale"]),
    rules() {
      const rules = {
        confirmation: [],
        current: [],
        password: [],
      };
      if (this.newUser.password) {
        const confirmationBlank = (v) =>
          !!v || this.$t("errors.user.password-confirmation-blank");
        rules.confirmation.push(confirmationBlank);

        const confirmationMatch = (v) =>
          (!!v && v) === this.newUser.password ||
          this.$t("errors.user.password-confirmation");
        rules.confirmation.push(confirmationMatch);

        const currentBlank = (v) =>
          !!v || this.$t("errors.user.current-password-blank");
        rules.current.push(currentBlank);
      }

      if (this.newUser.current_password || this.newUser.password_confirmation) {
        const passwordBlank = (v) =>
          !!v || this.$t("errors.user.password-blank");
        rules.password.push(passwordBlank);
      }
      return rules;
    },
  },
  methods: {
    ...mapActions("users", ["update"]),
    ...mapMutations("userSettings", ["setLocale"]),
    fillValues() {
      if (this.user) this.newUser.name = this.user.name;
      if (this.locale) this.newLocale = this.locale;
    },
    submitLocale: function () {
      this.setLocale({
        locale: this.newLocale,
      });
    },
    submitPassword() {
      this.$refs.userForm.validate();
      if (this.isValid) {
        this.update({ id: this.user.id, newUser: this.newUser }).then(
          (succeeded) => {
            if (succeeded) {
              this.$router.push(this.$route.query.redirect || { name: "home" });
            }
          }
        );
      }
    },
  },
};
</script>
