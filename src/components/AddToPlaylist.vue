<template>
  <VDialog v-model="dialog" width="600px" v-if="playlistOptions.length">
    <template v-slot:activator="{ on }">
      <VBtn
        v-on="on"
        @click.stop.prevent
        class="actions__button"
        color="primary"
        text
        icon
        small
      >
        <VIcon>mdi-playlist-plus</VIcon>
      </VBtn>
    </template>
    <VCard>
      <VCardTitle>
        <span class="text-h5">{{
          $t("music.playlist.add", { obj: item.name || item.title })
        }}</span>
      </VCardTitle>
      <VCardText>
        <VContainer>
          <VRow>
            <VCol cols="12">
              <VCombobox
                :items="playlistOptions"
                :filter="filterName"
                cache-items
                item-text="name"
                item-value="id"
                :label="$tc('music.playlists', 1)"
                return-object
                v-model="selectedPlaylist"
              />
            </VCol>
          </VRow>
        </VContainer>
      </VCardText>
      <VDivider></VDivider>
      <VCardActions>
        <VSpacer></VSpacer>
        <VBtn
          color="primary"
          class="ma-2"
          type="submit"
          :disabled="selectedPlaylist === null"
          @click="addItemToPlaylist"
        >
          <VIcon>mdi-playlist-plus</VIcon>
          {{ $t("music.playlist.add") }}
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "AddToPlaylistDialog",
  props: {
    item: {
      type: Object,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      dialog: false,
      selectedPlaylist: null,
    };
  },
  computed: {
    ...mapGetters("auth", ["currentUser"]),
    ...mapGetters("playlists", ["playlists"]),
    playlistOptions() {
      return this.playlists.filter(
        (p) =>
          [null, this.currentUser.id].includes(p.user_id) &&
          p.playlist_type === this.type
      );
    },
  },
  methods: {
    ...mapActions("playlists", ["update"]),
    filterName(item, queryText) {
      const search = queryText.toLowerCase();
      return item.name.toLowerCase().indexOf(search) > -1;
    },
    addItemToPlaylist() {
      const newItems = [...this.playlists.item_ids, this.item.id];
      this.update({
        id: this.selectedPlaylist.id,
        newPlaylist: { item_ids: newItems },
      }).finally(() => {
        this.dialog = false;
      });
    },
  },
};
</script>

<style></style>
