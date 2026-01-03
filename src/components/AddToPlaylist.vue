<template>
  <VDialog v-if="playlistOptions.length" v-model="dialog" width="600px">
    <template #activator="{ props }">
      <VBtn
        color="primary"
        variant="text"
        icon
        size="small"
        v-bind="props"
        @click.stop.prevent
      >
        <VIcon size="x-large">mdi-playlist-plus</VIcon>
      </VBtn>
    </template>
    <VCard>
      <VCardTitle>
        <span class="text-h5">{{
          $t("music.playlist.add-item", { obj: item.name || item.title })
        }}</span>
      </VCardTitle>
      <VCardText>
        <VContainer>
          <VRow>
            <VCol cols="12">
              <VCombobox
                v-model="selectedPlaylist"
                :items="playlistOptions"
                :custom-filter="filterName"
                item-title="name"
                item-value="id"
                :label="$tc('music.playlists', 1)"
                return-object
              >
                <template #item="{ item: innerItem, props }">
                  <VListItem :disabled="innerItem.disabled" v-bind="props">
                    {{ innerItem.name }}
                    <span v-if="innerItem.disabled">
                      &nbsp;({{ $t("music.playlist.item-already-present") }})
                    </span>
                  </VListItem>
                </template>
              </VCombobox>
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
          {{ $t("music.playlist.add") }}
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script>
import { mapActions, mapState } from "pinia";
import { useAuthStore } from "../store/auth";
import { usePlaylistsStore } from "../store/playlists";

export default {
  name: "AddToPlaylist",
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
    ...mapState(useAuthStore, ["currentUser"]),
    ...mapState(usePlaylistsStore, ["editablePlaylists"]),
    playlistOptions() {
      return structuredClone(this.editablePlaylists).reduce((options, p) => {
        if (p.playlist_type === this.type) {
          p.disabled = p.item_ids.includes(this.item.id);
          options.push(p);
        }
        return options;
      }, []);
    },
  },
  methods: {
    ...mapActions(usePlaylistsStore, ["addItem"]),
    filterName(item, queryText) {
      const search = queryText.toLowerCase();
      return item.name.toLowerCase().indexOf(search) > -1;
    },
    addItemToPlaylist() {
      if (this.selectedPlaylist === null) {
        return;
      }

      // Item type requires a capitalized string
      const item_type =
        this.selectedPlaylist.playlist_type.charAt(0).toUpperCase() +
        this.selectedPlaylist.playlist_type.slice(1);
      this.addItem(this.selectedPlaylist.id, {
        item_id: this.item.id,
        item_type,
      }).finally(() => {
        this.dialog = false;
      });
    },
  },
};
</script>

<style></style>
