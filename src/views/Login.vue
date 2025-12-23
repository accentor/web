<template>
  <VMain>
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
                  v-model="name"
                  :label="$t('users.name')"
                  :placeholder="$t('users.name')"
                  prepend-icon="mdi-account"
                  autocomplete="username"
                />
                <VTextField
                  v-model="password"
                  :label="$t('users.password')"
                  :placeholder="$t('users.password')"
                  prepend-icon="mdi-key"
                  type="password"
                  autocomplete="current-password"
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
  </VMain>
</template>

<script>
import { mapActions, mapMutations } from "vuex";
import Errors from "../components/Errors.vue";

export default {
  name: "Login",
  components: { Errors },
  metaInfo() {
    return { title: this.$t("common.login") };
  },
  data: function () {
    return {
      name: "",
      password: "",
      error: {},
    };
  },
  methods: {
    ...mapActions("auth", ["login"]),
    ...mapMutations(["clearErrors"]),
    async submit() {
      this.clearErrors();
      const succeeded = await this.login({
        name: this.name,
        password: this.password,
      });
      if (succeeded) {
        this.redirect();
      }
    },
    redirect: function () {
      const path = this.$route.query.redirect || "/app/";
      this.$router.push({ path });
    },
  },
};
</script>
