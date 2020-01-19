<template>
  <VContainer class="fill-height" fluid>
    <VRow no-gutters align="center" justify="center">
      <VCol md="4" sm="8" cols="12">
        <VForm @submit.prevent="submit">
          <VTextField :label="$t('common.name')" v-model="newUser.name" />
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
          <VSelect
            :items="permissionOptions"
            :label="$t('users.permissions')"
            v-model="newUser.permission"
          />
          <VBtn color="primary" class="ma-2" type="submit">
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
  data: function() {
    return {
      newUser: {
        name: "",
        password: "",
        password_confirmation: "",
        permission: ""
      },
      permissionOptions: [
        { text: this.$t("users.permission.admin"), value: "admin" },
        { text: this.$t("users.permission.moderator"), value: "moderator" },
        { text: this.$t("users.permission.user"), value: "user" }
      ]
    };
  },
  methods: {
    ...mapActions("users", ["create"]),
    submit() {
      this.create(this.newUser).then(id => {
        if (id) {
          this.$router.push({ name: "user", params: { id } });
        }
      });
    }
  }
};
</script>
