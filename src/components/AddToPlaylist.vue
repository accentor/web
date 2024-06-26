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
          $t("music.playlist.add-item", { obj: item.name || item.title })
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
              >
                <template v-slot:item="{ item, on }">
                  <VListItem :disabled="item.disabled" v-on="on">
                    {{ item.name }}
                    <span v-if="item.disabled">
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
    ...mapGetters("playlists", ["editablePlaylists"]),
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
    ...mapActions("playlists", ["addItem"]),
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
      this.addItem({
        id: this.selectedPlaylist.id,
        newItem: {
          item_id: this.item.id,
          item_type,
        },
      }).finally(() => {
        this.dialog = false;
      });
    },
  },
};
</script>

<style></style>
