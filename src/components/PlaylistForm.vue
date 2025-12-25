<template>
  <VRow no-gutters align="center" justify="center">
    <VCol cols="12" @change.once="isDirty = true">
      <VForm v-model="isValid" @submit.prevent="submit">
        <VRow no-gutters align="center" justify="center">
          <VCol md="6" sm="8" cols="12" @change.once="isDirty = true">
            <VTextField
              :label="$t('common.name')"
              v-model="newPlaylist.name"
              :rules="[(v) => !!v || $t('errors.playlists.name-blank')]"
              required
            />
            <VTextarea
              :label="$t('common.description')"
              rows="3"
              v-model="newPlaylist.description"
            />
            <VAutocomplete
              :items="playlistTypes"
              :label="$t('music.playlist.playlist_type')"
              v-model="newPlaylist.playlist_type"
              :disabled="hasItems"
            />
            <VAutocomplete
              :items="accessOptions"
              :label="$t('music.playlist.access')"
              v-model="newPlaylist.access"
            />
            <VBtn
              :disabled="!isValid"
              color="primary"
              class="ma-2"
              type="submit"
            >
              {{
                this.playlist
                  ? $t("music.playlist.update")
                  : $t("music.playlist.create")
              }}
            </VBtn>
          </VCol>
        </VRow>
        <VRow
          no-gutters
          align="center"
          justify="center"
          v-if="newPlaylist.item_ids.length"
        >
          <VCol
            md="9"
            sm="10"
            cols="12"
            @change.once="
              isDirty = true;
              itemsDirty = true;
            "
          >
            <h4 class="text-h6 mt-6 ml-4">
              {{ $tc("music.playlist.items", 2) }}
            </h4>
            <VSimpleTable>
              <thead>
                <tr>
                  <th style="width: 1px" class="text-center">Sort</th>
                  <th>{{ mainPropName }}</th>
                  <th></th>
                </tr>
              </thead>
              <Draggable
                tag="tbody"
                v-model="newPlaylist.item_ids"
                handle="[data-draggable=handle]"
              >
                <tr
                  v-for="(item_id, index) of newPlaylist.item_ids"
                  :key="item_id"
                >
                  <td class="text-no-wrap">
                    <VBtn small icon text class="" data-draggable="handle">
                      <VIcon>mdi-drag-horizontal-variant</VIcon>
                    </VBtn>
                    {{ index + 1 }}
                  </td>
                  <td class="play-queue__cell">
                    {{
                      newPlaylist.playlist_type === "artist"
                        ? items[item_id].name
                        : items[item_id].title
                    }}
                  </td>
                  <td class="text-right">
                    <VBtn
                      small
                      icon
                      text
                      class="ma-2 red--text"
                      @click="() => removeItem(index)"
                    >
                      <VIcon>mdi-close</VIcon>
                    </VBtn>
                  </td>
                </tr>
              </Draggable>
            </VSimpleTable>
          </VCol>
        </VRow>
      </VForm>
    </VCol>
  </VRow>
</template>

<script>
import { mapState } from "vuex";
import { mapActions } from "pinia";
import Draggable from "vuedraggable";
import { usePlaylistsStore } from "../store/playlists";

export default {
  name: "PlaylistForm",
  components: { Draggable },
  props: { playlist: { type: Object, default: null } },
  data() {
    return {
      newPlaylist: {
        name: "",
        description: "",
        access: "shared",
        playlist_type: null,
        item_ids: [],
      },
      playlistTypes: [
        {
          value: "track",
          text: this.$t("music.playlist.playlist_types.track"),
        },
        {
          value: "album",
          text: this.$t("music.playlist.playlist_types.album"),
        },
        {
          value: "artist",
          text: this.$t("music.playlist.playlist_types.artist"),
        },
      ],
      accessOptions: [
        {
          value: "shared",
          text: this.$t("music.playlist.access_options.shared"),
        },
        {
          value: "personal",
          text: this.$t("music.playlist.access_options.personal"),
        },
        {
          value: "secret",
          text: this.$t("music.playlist.access_options.secret"),
        },
      ],
      headers: [
        {
          text: "#",
          value: "index",
        },
        {
          text: this.$t("music.title"),
          value: "title",
        },
        {
          text: "remove",
          value: "remove",
        },
      ],
      isDirty: false,
      itemsDirty: false,
      isValid: true,
    };
  },
  async created() {
    if (this.playlist) {
      await this.read(this.$route.params.id);
      this.fillValues();
    }
  },
  watch: {
    playlist: function () {
      if (this.playlist && !this.isDirty) {
        this.fillValues();
      }
    },
  },
  computed: {
    ...mapState("albums", ["albums"]),
    ...mapState("artists", ["artists"]),
    ...mapState("tracks", ["tracks"]),
    hasItems() {
      return this.newPlaylist.item_ids.length > 0;
    },
    items() {
      return this[`${this.newPlaylist.playlist_type}s`];
    },
    mainPropName() {
      return {
        artist: this.$t("common.name"),
        album: this.$t("music.title"),
        track: this.$t("music.title"),
      }[this.newPlaylist.playlist_type];
    },
  },
  methods: {
    ...mapActions(usePlaylistsStore, ["create", "read", "update"]),
    fillValues() {
      this.newPlaylist.name = this.playlist.name;
      this.newPlaylist.description = this.playlist.description;
      this.newPlaylist.access = this.playlist.access;
      this.newPlaylist.playlist_type = this.playlist.playlist_type;
      this.newPlaylist.item_ids = [...this.playlist.item_ids];
    },
    removeItem(index) {
      this.isDirty = true;
      this.itemsDirty = true;
      this.newPlaylist.item_ids.splice(index, 1);
    },
    async submit() {
      let pendingResult = null;
      if (this.playlist) {
        // Remove the `item_ids` from the update if it hasn't changed
        const newPlaylist = { ...this.newPlaylist };
        if (!this.itemsDirty) {
          delete newPlaylist.item_ids;
        }

        pendingResult = this.update(this.playlist.id, newPlaylist);
      } else {
        pendingResult = this.create(this.newPlaylist);
      }
      const succeeded = await pendingResult;
      if (succeeded) {
        this.$router.push(this.$route.query.redirect || { name: "playlists" });
      }
    },
  },
};
</script>

<style></style>
