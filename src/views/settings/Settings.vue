<template>
  <VContainer fluid v-if="user">
    <VLayout align-center justify-center>
      <VFlex lg4 md6 sm8 xs12 class="px-3">
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
      </VFlex>
      <VFlex lg4 md6 sm8 xs12 class="px-3">
        <VForm @submit.prevent="submitPassword">
          <VTextField :label="$t('common.name')" v-model="newUser.name" />
          <VTextField
            :label="$t('users.current-password')"
            type="password"
            v-model="newUser.current_password"
          />
          <VTextField
            :label="$t('users.password')"
            type="password"
            v-model="newUser.password"
          />
          <VTextField
            :label="$t('users.confirm-password')"
            type="password"
            v-model="newUser.password_confirmation"
          />
          <VBtn color="primary" class="ma-2" type="submit">
            {{ $t("common.change-settings") }}
          </VBtn>
        </VForm>
      </VFlex>
    </VLayout>
    <VLayout>
      <VFlex>
        <AuthTokensTable :authTokens="authTokens" />
      </VFlex>
    </VLayout>
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
        password_confirmation: ""
      },
      newLocale: "",
      langs: [
        { value: "en", text: "English" },
        { value: "nl", text: "Nederlands" }
      ]
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
    }
  },
  computed: {
    ...mapGetters("auth", { user: "currentUser" }),
    ...mapGetters("auth", ["authTokens"]),
    ...mapState("userSettings", ["locale"])
  },
  methods: {
    ...mapActions("users", ["update"]),

    ...mapMutations("userSettings", ["setLocale"]),
    fillValues() {
      if (this.user) this.newUser.name = this.user.name;
      if (this.locale) this.newLocale = this.locale;
    },
    submitLocale: function() {
      this.setLocale({
        locale: this.newLocale
      });
    },
    submitPassword() {
      this.update({ id: this.user.id, newUser: this.newUser }).then(
        succeeded => {
          if (succeeded) {
            this.$router.push(this.$route.query.redirect || { name: "home" });
          }
        }
      );
    }
  }
};
</script>
