<template>
  <span v-if="isModerator">
    <VTooltip bottom :disabled="!waitingForReload">
      <template v-slot:activator="{ on }">
        <span v-on="on">
          <VBtn
            :to="{
              name: 'edit-genre',
              params: { id: genre.id },
              query: { redirect: $route.fullPath },
            }"
            :disabled="waitingForReload"
            color="edit"
            class="actions__button"
            text
            icon
            small
          >
            <VIcon>mdi-pencil</VIcon>
          </VBtn>
        </span>
      </template>
      <span>{{ $t("common.disabled-while-loading") }}</span>
    </VTooltip>
    <VTooltip bottom :disabled="!waitingForReload">
      <template v-slot:activator="{ on }">
        <span v-on="on">
          <GenreMergeDialog :genre="genre" :disabled="waitingForReload" />
        </span>
      </template>
      <span>{{ $t("common.disabled-while-loading") }}</span>
    </VTooltip>
    <VTooltip bottom :disabled="!waitingForReload">
      <template v-slot:activator="{ on }">
        <span v-on="on">
          <VBtn
            @click.stop.prevent="deleteGenre"
            :disabled="waitingForReload"
            color="danger"
            class="actions__button mr-0"
            href="#"
            text
            icon
            small
          >
            <VIcon>mdi-delete</VIcon>
          </VBtn>
        </span>
      </template>
      <span>{{ $t("common.disabled-while-loading") }}</span>
    </VTooltip>
  </span>
</template>

<script>
import { mapActions, mapState } from "pinia";
import GenreMergeDialog from "./GenreMergeDialog.vue";
import { useAuthStore } from "../store/auth";
import { useGenresStore } from "../store/genres";

export default {
  name: "GenreActions",
  components: {
    GenreMergeDialog,
  },
  props: {
    genre: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState(useAuthStore, ["isModerator"]),
    ...mapState(useGenresStore, ["startLoading"]),
    waitingForReload() {
      return this.startLoading > this.genre.loaded;
    },
  },
  methods: {
    ...mapActions(useGenresStore, ["destroy", "merge"]),
    deleteGenre: function () {
      if (confirm(this.$t("common.are-you-sure"))) {
        this.destroy(this.genre.id);
      }
    },
  },
};
</script>
