<template>
  <VContainer fluid grid-list-xl>
    <VLayout justify-end wrap>
      <VBtn :to="{ name: 'new-user' }" color="success" v-if="isAdmin">
        <VIcon left>mdi-plus</VIcon>
        {{ $t("users.new") }}
      </VBtn>
    </VLayout>
    <VLayout v-if="users.length > 0" wrap>
      <VFlex :key="user.id" lg3 md4 sm6 v-for="user in users" xl2 xs12>
        <VCard :to="{ name: 'user', params: { id: user.id } }">
          <VCardTitle class="pb-0">
            {{ user.name }}
          </VCardTitle>
          <VCardText>
            {{ $t(`users.permission.${user.permission}`) }}
          </VCardText>
          <VCardActions v-if="isAdmin">
            <VBtn
              @click.stop.prevent="deleteUser(user.id)"
              color="danger"
              class="ma-2"
              dark
              fab
              href="#"
              outlined
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
              color="edit"
              class="ma-2"
              dark
              fab
              outlined
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
