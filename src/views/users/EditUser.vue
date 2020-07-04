<template>
  <VContainer class="fill-height" fluid v-if="user">
    <vue-headful
      :title="$t('page-titles.edit', { obj: user.name }) + ' | Accentor'"
    />
    <VRow no-gutters align="center" justify="center">
      <VCol md="4" sm="8" cols="12">
        <VForm v-model="isValid" ref="userForm" @submit.prevent="submit">
          <VTextField
            :label="$t('common.name')"
            v-model="newUser.name"
            required
            :rules="[(v) => !!v || $t('errors.user.name-blank')]"
          />
          <VTextField
            v-if="user === currentUser"
            :label="$t('users.current-password')"
            type="password"
            v-model="newUser.current_password"
            :rules="rules.current"
          />
          <VTextField
            :label="$t('users.password')"
            type="password"
            v-model="newUser.password"
            :rules="rules.password"
          />
          <VTextField
            :label="$t('users.confirm-password')"
            type="password"
            v-model="newUser.password_confirmation"
            :rules="rules.confirmation"
          />
          <VSelect
            :items="permissionOptions"
            :label="$t('users.permissions')"
            v-model="newUser.permission"
          />
          <VBtn color="primary" class="ma-2" type="submit">
            {{ $t("users.update") }}
          </VBtn>
        </VForm>
      </VCol>
    </VRow>
  </VContainer>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";

export default {
  name: "EditUser",
  data() {
    return {
      newUser: {
        current_password: "",
        name: "",
        password: "",
        password_confirmation: "",
        permission: "",
      },
      permissionOptions: [
        { text: this.$t("users.permission.admin"), value: "admin" },
        { text: this.$t("users.permission.moderator"), value: "moderator" },
        { text: this.$t("users.permission.user"), value: "user" },
      ],
      isValid: true,
    };
  },
  created() {
    this.$nextTick(() => {
      if (this.user) {
        this.fillValues();
      }
    });
  },
  watch: {
    user: function () {
      if (this.user) {
        this.fillValues();
      }
    },
  },
  computed: {
    ...mapGetters("auth", ["currentUser"]),
    ...mapState("users", ["users"]),
    user: function () {
      return this.users[this.$route.params.id];
    },
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
    fillValues() {
      this.newUser.name = this.user.name;
      this.newUser.permission = this.user.permission;
    },
    submit() {
      this.$refs.userForm.validate();
      if (this.isValid) {
        this.update({ id: this.user.id, newUser: this.newUser }).then(
          (succeeded) => {
            if (succeeded) {
              this.$router.push(
                this.$route.query.redirect || { name: "users" }
              );
            }
          }
        );
      }
    },
  },
};
</script>
