<template>
  <VContainer fluid>
    <VRow justify="end">
      <VBtn v-if="isAdmin" :to="{ name: 'new-user' }" color="success">
        <VIcon start> mdi-plus </VIcon>
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
              color="danger"
              class="ma-2"
              dark
              fab
              href="#"
              variant="outlined"
              size="small"
              @click.stop.prevent="deleteUser(user.id)"
            >
              <VIcon>mdi-delete</VIcon>
            </VBtn>
            <VBtn
              :to="{
                name: 'edit-user',
                params: { id: user.id },
                query: { redirect: $route.fullPath },
              }"
              color="edit"
              class="ma-2"
              dark
              fab
              variant="outlined"
              size="small"
            >
              <VIcon>mdi-pencil</VIcon>
            </VBtn>
          </VCardActions>
        </VCard>
      </VCol>
    </VRow>
  </VContainer>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "Users",
  metaInfo() {
    return { title: this.$tc("users.users", 2) };
  },
  methods: {
    ...mapActions("users", ["destroy"]),
    deleteUser: function (id) {
      if (confirm(this.$t("common.are-you-sure"))) {
        this.destroy(id);
      }
    },
  },
  computed: {
    ...mapGetters("auth", ["isAdmin"]),
    ...mapGetters("users", {
      users: "usersByName",
    }),
  },
};
</script>
