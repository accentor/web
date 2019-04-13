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
                <Errors />
                <VTextField
                  prepend-icon="mdi-account"
                  label="Name"
                  placeholder="Name"
                  v-model="name"
                />
                <VTextField
                  prepend-icon="mdi-key"
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
import { mapActions, mapMutations } from "vuex";
import Errors from "../components/Errors";

export default {
  name: "login",
  components: { Errors },
  data: function() {
    return {
      name: "",
      password: "",
      error: {}
    };
  },
  methods: {
    ...mapActions("auth", ["login"]),
    ...mapMutations(["clearErrors"]),
    submit: function() {
      this.clearErrors();
      this.login({
        name: this.name,
        password: this.password
      }).then(succeeded => {
        if (succeeded) {
          this.redirect();
        }
      });
    },
    redirect: function() {
      const path = this.$route.query.redirect || "/app/";
      this.$router.push({ path });
    }
  }
};
</script>
