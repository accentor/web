<template>
  <VContainer class="fill-height" fluid>
    <vue-headful :title="$t('users.new') + ' | Accentor'" />
    <VRow no-gutters align="center" justify="center">
      <VCol md="4" sm="8" cols="12">
        <VForm v-model="isValid" @submit.prevent="submit">
          <VTextField
            :label="$t('common.name')"
            v-model="newUser.name"
            required
            :rules="[(v) => !!v || $t('errors.user.name-blank')]"
          />
          <VTextField
            :label="$t('users.password')"
            type="password"
            v-model="newUser.password"
            required
            :rules="[(v) => !!v || $t('errors.user.password-blank')]"
          />
          <VTextField
            :label="$t('users.confirm-password')"
            type="password"
            v-model="newUser.password_confirmation"
            required
            :rules="rules.confirmation"
          />
          <VSelect
            :items="permissionOptions"
            :label="$t('users.permissions')"
            required
            v-model="newUser.permission"
            :rules="[(v) => !!v || $t('errors.user.permission-blank')]"
          />
          <VBtn :disabled="!isValid" color="primary" class="ma-2" type="submit">
            {{ $t("users.create") }}
          </VBtn>
        </VForm>
      </VCol>
    </VRow>
  </VContainer>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "NewUser",
  data: function () {
    return {
      newUser: {
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
    };
  },
  computed: {
    rules() {
      const rules = {
        confirmation: [
          (v) => !!v || this.$t("errors.user.password-confirmation-blank"),
          (v) =>
            (!!v && v) === this.newUser.password ||
            this.$t("errors.user.password-confirmation"),
        ],
      };

      return rules;
    },
  },
  methods: {
    ...mapActions("users", ["create"]),
    submit() {
      this.create(this.newUser).then((id) => {
        if (id) {
          this.$router.push({ name: "user", params: { id } });
        }
      });
    },
  },
};
</script>
