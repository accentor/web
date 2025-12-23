<template>
  <div>
    <VDataTable
      ref="table"
      v-model="selected"
      v-model:page="pagination.page"
      :footer-props="{
        disableItemsPerPage: true,
        itemsPerPageOptions: [30],
        showFirstLastPage: true,
      }"
      :headers="headers"
      :items="authTokens"
      :items-per-page="30"
      show-select
      class="elevation-3"
    >
      <template #header.actions>
        <VBtn
          color="danger"
          class="ma-2"
          :disabled="selected.length === 0"
          @click.stop.prevent="deleteAuthTokens"
        >
          {{ $t("users.auth.destroy-selected") }}
        </VBtn>
      </template>
      <template #item.actions="props">
        <VBtn
          color="danger"
          class="ma-1"
          href="#"
          variant="text"
          icon
          size="small"
          :disabled="props.item.isSelectable === false"
          @click.stop.prevent="deleteAuthToken(props.item)"
        >
          <VIcon>mdi-delete</VIcon>
        </VBtn>
      </template>
    </VDataTable>
  </div>
</template>
<script>
import Paginated from "../mixins/Paginated";
import { mapActions } from "vuex";

export default {
  name: "AuthTokensTable",
  mixins: [Paginated],
  props: {
    savePagination: { default: true, type: Boolean },
  },
  data() {
    const headers = [
      {
        text: "#",
        value: "id",
        sortable: false,
        align: "center",
        width: "1px",
      },
      {
        text: this.$t("users.auth.user-agent"),
        value: "user_agent",
        sortable: false,
      },
      {
        text: this.$t("common.actions"),
        value: "actions",
        sortable: false,
        align: "end",
      },
    ];
    return {
      destroyAllDisabled: false,
      headers,
      selected: [],
    };
  },
  computed: {
    authTokens() {
      const getter = this.$store.getters["auth/authTokens"];
      const currentSession = this.$store.getters["auth/currentSession"];
      getter.find(({ id }) => id === currentSession).isSelectable = false;
      return getter;
    },
  },
  methods: {
    ...mapActions("auth", ["destroy"]),
    deleteAuthToken: function (item) {
      if (confirm(this.$t("common.are-you-sure"))) {
        this.destroy(item.id);
      }
    },
    deleteAuthTokens: function () {
      if (confirm(this.$t("common.are-you-sure"))) {
        this.destroyAllDisabled = true;
        this.selected.forEach((authToken) => {
          this.destroy(authToken.id);
        });
        this.destroyAllDisabled = false;
      }
    },
  },
};
</script>
