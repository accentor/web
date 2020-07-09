<template>
  <VContainer class="fill-height" fluid v-if="user">
    <vue-headful
      :title="$t('page-titles.edit', { obj: user.name }) + ' | Accentor'"
    />
    <VRow no-gutters align="center" justify="center">
      <VCol md="4" sm="8" cols="12">
        <UserForm :user="user" :showPermissions="true" />
      </VCol>
    </VRow>
  </VContainer>
</template>

<script>
import { mapState } from "vuex";
import UserForm from "../../components/UserForm";

export default {
  name: "EditUser",
  components: { UserForm },
  computed: {
    ...mapState("users", ["users"]),
    user: function () {
      return this.users[this.$route.params.id];
    },
  },
};
</script>
