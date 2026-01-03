<template>
  <span v-if="isModerator">
    <VTooltip location="bottom" :disabled="!waitingForReload">
      <template #activator="{ props }">
        <span v-bind="props">
          <VBtn
            :to="{
              name: 'edit-genre',
              params: { id: genre.id },
              query: { redirect: $route.fullPath },
            }"
            :disabled="waitingForReload"
            color="warning"
            variant="text"
            icon
            size="small"
          >
            <VIcon size="x-large">mdi-pencil</VIcon>
          </VBtn>
        </span>
      </template>
      <span>{{ $t("common.disabled-while-loading") }}</span>
    </VTooltip>
    <VTooltip location="bottom" :disabled="!waitingForReload">
      <template #activator="{ props }">
        <span v-bind="props">
          <GenreMergeDialog :genre="genre" :disabled="waitingForReload" />
        </span>
      </template>
      <span>{{ $t("common.disabled-while-loading") }}</span>
    </VTooltip>
    <VTooltip location="bottom" :disabled="!waitingForReload">
      <template #activator="{ props }">
        <span v-bind="props">
          <VBtn
            :disabled="waitingForReload"
            color="error"
            class="mr-0"
            href="#"
            variant="text"
            icon
            size="small"
            @click.stop.prevent="deleteGenre"
          >
            <VIcon size="x-large">mdi-delete</VIcon>
          </VBtn>
        </span>
      </template>
      <span>{{ $t("common.disabled-while-loading") }}</span>
    </VTooltip>
  </span>
</template>

<script>
// @ts-nocheck
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
