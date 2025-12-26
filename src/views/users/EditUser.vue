<template>
  <VContainer class="fill-height" fluid v-if="user">
    <VRow no-gutters align="center" justify="center">
      <VCol md="4" sm="8" cols="12">
        <UserForm :user="user" :showPermissions="true" />
      </VCol>
    </VRow>
  </VContainer>
</template>

<script>
import UserForm from "../../components/UserForm.vue";
import { useUsersStore } from "../../store/users";
import { mapState } from "pinia";

export default {
  name: "EditUser",
  metaInfo() {
    return { title: this.$t("page-titles.edit", { obj: this.user.name }) };
  },
  components: { UserForm },
  computed: {
    ...mapState(useUsersStore, ["users"]),
    user: function () {
      return this.users[this.$route.params.id];
    },
  },
};
</script>
