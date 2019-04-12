<template>
  <VContent>
    <VContainer fluid fill-height>
      <VLayout align-center justify-center>
        <VFlex xs12 sm8 md4>
          <VCard class="elevation-12">
            <VToolbar dark color="primary">
              <VToolbarTitle>Login</VToolbarTitle>
            </VToolbar>
            <VCardText>
              <VForm @submit.prevent="submit">
                <VAlert :value="Object.keys(error).length > 0" color="error">
                  <div v-for="(value, key) in error" :key="key">
                    <strong>{{ key | capitalize }}:</strong>
                    {{ value }}
                  </div>
                </VAlert>
                <VTextField
                  prepend-icon="fas fa-user"
                  label="Name"
                  placeholder="Name"
                  v-model="name"
                />
                <VTextField
                  prepend-icon="fas fa-key"
                  label="Password"
                  placeholder="Password"
                  type="password"
                  v-model="password"
                />
                <VBtn type="submit" color="primary">Login</VBtn>
              </VForm>
            </VCardText>
          </VCard>
        </VFlex>
      </VLayout>
    </VContainer>
  </VContent>
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
