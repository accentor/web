<template>
  <span class="actions">
    <VTooltip bottom :disabled="!waitingForReload" v-if="isAllowedToEdit">
      <template v-slot:activator="{ on }">
        <span v-on="on">
          <VBtn
            :to="{
              name: 'edit-playlist',
              params: { id: playlist.id },
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
    <VTooltip bottom :disabled="!waitingForReload" v-if="isAllowedToEdit">
      <template v-slot:activator="{ on }">
        <span v-on="on">
          <VBtn
            @click.stop.prevent="deletePlaylist"
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
import { mapActions, mapState } from "vuex";

export default {
  name: "PlaylistActions",
  components: { },
  props: {
    playlist: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState("auth", { currentUser: "user_id"}),
    ...mapState("playlists", ["startLoading"]),
    waitingForReload() {
      return this.startLoading > this.playlist.loaded;
    },
    isAllowedToEdit() {
      return [null, this.currentUser].includes(this.playlist.user_id);
    },
  },
  methods: {
    ...mapActions("playlists", ["destroy", "update"]),
    deletePlaylist: function () {
      if (confirm(this.$t("common.are-you-sure"))) {
        this.destroy(this.playlist.id);
      }
    },
  },
};
</script>
