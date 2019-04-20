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
          <VBtn color="primary" type="submit">Change settings</VBtn>
        </VForm>
      </VFlex>
    </VLayout>
  </VContainer>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "Settings",
  data() {
    return {
      newUser: {
        name: "",
        password: "",
        password_confirmation: ""
      }
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
    ...mapGetters("auth", { user: "currentUser" })
  },
  methods: {
    ...mapActions("users", ["update"]),
    fillValues() {
      this.newUser.name = this.user.name;
    },
    submit() {
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
