<template>
  <div class="login">
    <VContainer>
      <VLayout row wrap>
        <VFlex xs10 sm6 md4 offset-xs1 offset-sm3 offset-md4>
          <VForm @submit.prevent="submit">
            <VAlert :value="Object.keys(error).length > 0" color="error">
              <div v-for="(value, key) in error" :key="key">
                <strong>{{ key | capitalize }}:</strong>
                {{ value }}
              </div>
            </VAlert>
            <VTextField label="Name" placeholder="Name" v-model="name" />
            <VTextField
              label="Password"
              placeholder="Password"
              type="password"
              v-model="password"
            />
            <VBtn type="submit" color="primary">Login</VBtn>
          </VForm>
        </VFlex>
      </VLayout>
    </VContainer>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "login",
  data: function() {
    return {
      name: "",
      password: "",
      error: {}
    };
  },
  methods: {
    ...mapActions(["login"]),
    submit: function() {
      this.login({
        name: this.name,
        password: this.password
      })
        .then(() => this.redirect())
        .catch(error => {
          this.error = error.error;
        });
    },
    redirect: function() {
      const path = this.$route.query.redirect || "/app/";
      this.$router.push({ path });
    }
  },
  filters: {
    capitalize: function(value) {
      if (!value) return "";
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
    }
  }
};
</script>

<style lang="scss">
.login {
  background: #dfdfdf;
  min-height: 100vh;
  height: 100%;

  form {
    background: white;
    margin-top: 4rem;
    padding: 2rem;
  }
}
</style>
