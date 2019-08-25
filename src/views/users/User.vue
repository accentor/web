<template>
  <VContainer fluid grid-list-xl v-if="user">
    <VLayout wrap>
      <div>
        <div class="display-1">{{ user.name }}</div>
        <span class="grey--text">
          {{ user.permission }}
        </span>
      </div>
    </VLayout>
  </VContainer>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "User",
  computed: {
    ...mapState("users", ["users"]),
    user: function() {
      return this.users[this.$route.params.id];
    }
  }
};
</script>
