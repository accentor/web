<template>
  <VContainer fill-height fluid>
    <VLayout align-center justify-center>
      <VFlex md4 sm8 xs12>
        <VForm @submit.prevent="submit">
          <VTextField label="Name" v-model="newUser.name" />
          <VTextField
            label="Password"
            type="password"
            v-model="newUser.password"
          />
          <VTextField
            label="Confirm password"
            type="password"
            v-model="newUser.password_confirmation"
          />
          <VSelect
            :items="permissionOptions"
            label="Permission"
            v-model="newUser.permission"
          />
          <VBtn color="primary" type="submit">Create user</VBtn>
        </VForm>
      </VFlex>
    </VLayout>
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
        { text: "Admin", value: "admin" },
        { text: "Moderator", value: "moderator" },
        { text: "User", value: "user" }
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
