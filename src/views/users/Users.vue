<template>
  <VContainer fluid>
    <VRow justify="end">
      <VBtn v-if="isAdmin" :to="{ name: 'new-user' }" color="success">
        <VIcon start>mdi-plus</VIcon>
        {{ $t("users.new") }}
      </VBtn>
    </VRow>
    <VRow v-if="users.length > 0">
      <VCol
        v-for="user in users"
        :key="user.id"
        xl="2"
        lg="3"
        md="4"
        sm="6"
        cols="12"
      >
        <VCard :to="{ name: 'user', params: { id: user.id } }">
          <VCardTitle class="pb-0">
            {{ user.name }}
          </VCardTitle>
          <VCardText>
            {{ $t(`users.permission.${user.permission}`) }}
          </VCardText>
          <VCardActions v-if="isAdmin">
            <VBtn
              :to="{
                name: 'edit-user',
                params: { id: user.id },
                query: { redirect: $route.fullPath },
              }"
              color="warning"
              class="ma-2"
              icon
              size="small"
            >
              <VIcon size="x-large">mdi-pencil</VIcon>
            </VBtn>
            <VBtn
              color="error"
              class="ma-2"
              href="#"
              icon
              size="small"
              @click.stop.prevent="deleteUser(user.id)"
            >
              <VIcon size="x-large">mdi-delete</VIcon>
            </VBtn>
          </VCardActions>
        </VCard>
      </VCol>
    </VRow>
  </VContainer>
</template>

<script>
import { mapActions, mapState } from "pinia";
import { useAuthStore } from "../../store/auth";
import { useUsersStore } from "../../store/users";

export default {
  name: "Users",
  head() {
    return { title: this.$tc("users.users", 2) };
  },
  computed: {
    ...mapState(useAuthStore, ["isAdmin"]),
    ...mapState(useUsersStore, { users: "usersByName" }),
  },
  methods: {
    ...mapActions(useUsersStore, ["destroy"]),
    deleteUser: function (id) {
      if (confirm(this.$t("common.are-you-sure"))) {
        this.destroy(id);
      }
    },
  },
};
</script>
