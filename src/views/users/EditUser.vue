<template>
  <VContainer v-if="user" class="fill-height" fluid>
    <VRow no-gutters align="center" justify="center">
      <VCol md="4" sm="8" cols="12">
        <UserForm :user="user" :show-permissions="true" />
      </VCol>
    </VRow>
  </VContainer>
</template>

<script>
import { mapState } from "vuex";
import UserForm from "../../components/UserForm.vue";

export default {
  name: "EditUser",
  metaInfo() {
    return { title: this.$t("page-titles.edit", { obj: this.user.name }) };
  },
  components: { UserForm },
  computed: {
    ...mapState("users", ["users"]),
    user: function () {
      return this.users[this.$route.params.id];
    },
  },
};
</script>
