<template>
  <div @change="isDirty = true">
    <VForm ref="userForm" v-model="isValid" @submit.prevent="submit">
      <VTextField
        v-model="newUser.name"
        :label="$t('common.name')"
        autocomplete="username"
        required
        :rules="[(v) => !!v || $t('errors.user.name-blank')]"
      />
      <VTextField
        v-if="user === currentUser"
        v-model="newUser.current_password"
        :label="$t('users.current-password')"
        type="password"
        autocomplete="current-password"
        :rules="rules.current"
      />
      <VTextField
        v-model="newUser.password"
        :label="$t('users.password')"
        type="password"
        autocomplete="new-password"
        :rules="rules.password"
      />
      <VTextField
        v-model="newUser.password_confirmation"
        :label="$t('users.confirm-password')"
        type="password"
        autocomplete="new-password"
        :rules="rules.confirmation"
      />
      <VSelect
        v-if="showPermissions"
        v-model="newUser.permission"
        :items="permissionOptions"
        :label="$t('users.permissions')"
      />
      <VBtn color="primary" class="ma-2" type="submit">
        {{ user ? $t("users.update") : $t("users.create") }}
      </VBtn>
    </VForm>
  </div>
</template>

<script>
// @ts-nocheck
import { useAuthStore } from "../store/auth";
import { mapActions, mapState } from "pinia";
import { useUsersStore } from "../store/users";

export default {
  name: "UserForm",
  props: {
    user: { type: Object, default: null },
    redirectFallback: { type: String, default: "users" },
    showPermissions: { type: Boolean, default: false },
  },
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
      isDirty: false,
      isValid: true,
    };
  },
  computed: {
    ...mapState(useAuthStore, ["currentUser"]),
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
  watch: {
    user: function () {
      if (this.user && !this.isDirty) {
        this.fillValues();
      }
    },
  },
  created() {
    this.$nextTick(() => {
      if (this.user) {
        this.fillValues();
      }
    });
  },
  methods: {
    ...mapActions(useUsersStore, ["create", "update"]),
    fillValues() {
      this.newUser.name = this.user.name;
      this.newUser.permission = this.user.permission;
    },
    async submit() {
      this.$refs.userForm.validate();
      if (this.isValid) {
        let pendingResult = null;
        if (this.user) {
          pendingResult = this.update(this.user.id, this.newUser);
        } else {
          pendingResult = this.create(this.newUser);
        }
        const succeeded = await pendingResult;
        if (succeeded) {
          this.$router.push(
            this.$route.query.redirect || { name: this.redirectFallback },
          );
        }
      }
    },
  },
};
</script>
