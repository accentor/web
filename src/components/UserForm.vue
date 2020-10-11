<template>
  <div @change="isDirty = true">
    <VForm v-model="isValid" ref="userForm" @submit.prevent="submit">
      <VTextField
        :label="$t('common.name')"
        v-model="newUser.name"
        autocomplete="username"
        required
        :rules="[(v) => !!v || $t('errors.user.name-blank')]"
      />
      <VTextField
        v-if="user === currentUser"
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
        v-model="newUser.password_confirmation"
        :rules="rules.confirmation"
      />
      <VSelect
        v-if="showPermissions"
        :items="permissionOptions"
        :label="$t('users.permissions')"
        v-model="newUser.permission"
      />
      <VBtn color="primary" class="ma-2" type="submit">
        {{ $t("users.update") }}
      </VBtn>
    </VForm>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

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
  created() {
    this.$nextTick(() => {
      if (this.user) {
        this.fillValues();
      }
    });
  },
  watch: {
    user: function () {
      if (this.user && !this.isDirty) {
        this.fillValues();
      }
    },
  },
  computed: {
    ...mapGetters("auth", ["currentUser"]),
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
    ...mapActions("users", ["create", "update"]),
    fillValues() {
      this.newUser.name = this.user.name;
      this.newUser.permission = this.user.permission;
    },
    async submit() {
      this.$refs.userForm.validate();
      if (this.isValid) {
        let pendingResult = null;
        if (this.user) {
          pendingResult = this.update({
            id: this.user.id,
            newUser: this.newUser,
          });
        } else {
          pendingResult = this.create(this.newUser);
        }
        const succeeded = await pendingResult;
        if (succeeded) {
          this.$router.push(
            this.$route.query.redirect || { name: this.redirectFallback }
          );
        }
      }
    },
  },
};
</script>
