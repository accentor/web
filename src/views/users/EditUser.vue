<template>
  <VContainer fill-height fluid v-if="user">
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
          <VBtn color="primary" type="submit">Update user</VBtn>
        </VForm>
      </VFlex>
    </VLayout>
  </VContainer>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "EditUser",
  data() {
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
  created() {
    setTimeout(() => {
      if (this.user) {
        this.fillValues();
      }
    });
  },
  watch: {
    user: function() {
      if (this.user) {
        this.fillValues();
      }
    }
  },
  computed: {
    ...mapState("users", ["users"]),
    user: function() {
      return this.users[this.$route.params.id];
    }
  },
  methods: {
    ...mapActions("users", ["update"]),
    fillValues() {
      this.newUser.name = this.user.name;
      this.newUser.permission = this.user.permission;
    },
    submit() {
      this.update({ id: this.user.id, newUser: this.newUser }).then(
        succeeded => {
          if (succeeded) {
            this.$router.push({ name: "users" });
          }
        }
      );
    }
  }
};
</script>
