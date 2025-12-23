<template>
  <VContainer v-if="user" fluid>
    <VRow>
      <VCol>
        <div class="text-h4">
          {{ user.name }}
        </div>
        <span class="text-grey">
          {{ user.permission }}
        </span>
      </VCol>
    </VRow>
  </VContainer>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "User",
  metaInfo() {
    return { title: this.user.name };
  },
  computed: {
    ...mapState("users", ["users"]),
    user: function () {
      return this.users[this.$route.params.id];
    },
  },
  watch: {
    user: function () {
      if (this.user === undefined) {
        this.$router.go(-1);
      }
    },
  },
};
</script>
