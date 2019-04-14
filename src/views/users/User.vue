<template>
  <div v-if="user">
    <VContainer fluid grid-list-xl>
      <VLayout row wrap>
        <div>
          <div class="headline">{{ user.name }}</div>
          <span class="grey--text">
            {{ user.permission | capitalize }}
          </span>
        </div>
      </VLayout>
    </VContainer>
  </div>
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
