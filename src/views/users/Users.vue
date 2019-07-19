<template>
  <VContainer fluid grid-list-xl>
    <VLayout justify-end row wrap>
      <VBtn :to="{ name: 'new-user' }" color="success" v-if="isAdmin">
        <VIcon left>mdi-plus</VIcon>
        {{ $t("users.new") }}
      </VBtn>
    </VLayout>
    <VLayout row v-if="users.length > 0" wrap>
      <VFlex :key="user.id" lg3 md4 sm6 v-for="user in users" xl2 xs12>
        <VCard :to="{ name: 'user', params: { id: user.id } }">
          <VCardTitle primary-title>
            <div>
              <div class="headline">{{ user.name }}</div>
              <span class="grey--text">
                {{ $t(`users.permission.${user.permission}`) }}
              </span>
            </div>
          </VCardTitle>
          <VCardActions v-if="isAdmin">
            <VBtn
              @click.stop.prevent="deleteUser(user.id)"
              color="red"
              dark
              fab
              href="#"
              outline
              small
            >
              <VIcon>mdi-delete</VIcon>
            </VBtn>
            <VBtn
              :to="{
                name: 'edit-user',
                params: { id: user.id },
                query: { redirect: $route.fullPath }
              }"
              color="orange"
              dark
              fab
              outline
              small
            >
              <VIcon>mdi-pencil</VIcon>
            </VBtn>
          </VCardActions>
        </VCard>
      </VFlex>
    </VLayout>
  </VContainer>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "Users",
  methods: {
    ...mapActions("users", ["destroy"]),
    deleteUser: function(id) {
      if (confirm(this.$t("common.are-you-sure"))) {
        this.destroy(id);
      }
    }
  },
  computed: {
    ...mapGetters("auth", ["isAdmin"]),
    ...mapGetters("users", {
      users: "usersByName"
    })
  }
};
</script>
