<template>
  <VContent>
    <VContainer class="fill-height" fluid>
      <VRow no-gutters align="center" justify="center">
        <VCol md="4" sm="8" cols="12">
          <VCard class="elevation-12">
            <VToolbar color="primary" dark>
              <VToolbarTitle>
                {{ $t("common.login") }}
              </VToolbarTitle>
            </VToolbar>
            <VCardText>
              <VForm @submit.prevent="submit">
                <Errors />
                <VTextField
                  :label="$t('users.name')"
                  :placeholder="$t('users.name')"
                  prepend-icon="mdi-account"
                  v-model="name"
                />
                <VTextField
                  :label="$t('users.password')"
                  :placeholder="$t('users.password')"
                  prepend-icon="mdi-key"
                  type="password"
                  v-model="password"
                />
                <VBtn color="primary" class="ma-2" type="submit">
                  {{ $t("common.login") }}
                </VBtn>
              </VForm>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
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
