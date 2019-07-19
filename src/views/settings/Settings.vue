<template>
  <VContainer fill-height fluid v-if="user">
    <VLayout align-center justify-center>
      <VFlex md4 sm8 xs12>
        <VForm @submit.prevent="submitLocale">
          <VSelect
            v-model="newLocale"
            :items="langs"
            label="Language"
          ></VSelect>
          <VBtn color="primary" type="submit">
            {{ $t("common.change-settings") }}
          </VBtn>
        </VForm>
      </VFlex>
    </VLayout>
    <VLayout align-center justify-center>
      <VFlex md4 sm8 xs12>
        <VForm @submit.prevent="submitPassword">
          <VTextField :label="$t('common.name')" v-model="newUser.name" />
          <VTextField
            :label="$t('users.passwords')"
            type="password"
            v-model="newUser.password"
          />
          <VTextField
            :label="$t('users.confirm-password')"
            type="password"
            v-model="newUser.password_confirmation"
          />
          <VBtn color="primary" type="submit">
            {{ $t("common.change-settings") }}
          </VBtn>
        </VForm>
      </VFlex>
    </VLayout>
  </VContainer>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";

export default {
  name: "Settings",
  data() {
    return {
      newUser: {
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
