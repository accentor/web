<template>
  <VRow no-gutters align="center" justify="center">
    <VCol md="6" sm="8" cols="12" @change.once="isDirty = true">
      <VForm v-model="isValid" @submit.prevent="submit">
        <VTextField
          :label="$t('common.name')"
          v-model="newPlaylist.name"
          :rules="[(v) => !!v || $t('errors.playlist.name-blank')]"
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
        <VBtn :disabled="!isValid" color="primary" class="ma-2" type="submit">
          {{
            this.playlist
              ? $t("music.playlist.update")
              : $t("music.playlist.create")
          }}
        </VBtn>
      </VForm>
    </VCol>
  </VRow>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "PlaylistForm",
  props: { playlist: { type: Object, default: null } },
  data() {
    return {
      newPlaylist: {
        name: "",
        description: "",
        access: "shared",
        playlist_type: null,
      },
      playlistTypes: [
        {
          value: "album",
          text: this.$t("music.playlist.playlist_types.album"),
        },
        {
          value: "artist",
          text: this.$t("music.playlist.playlist_types.artist"),
        },
        {
          value: "tracks",
          text: this.$t("music.playlist.playlist_types.track"),
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
      isDirty: false,
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
    hasItems() {
      return this.playlist?.item_ids.length > 0;
    },
  },
  methods: {
    ...mapActions("playlists", ["create", "read", "update"]),
    fillValues() {
      this.newPlaylist.name = this.playlist.name;
      this.newPlaylist.description = this.playlist.description;
      this.newPlaylist.access = this.playlist.access;
      this.newPlaylist.playlist_type = this.playlist.playlist_type;
    },
    async submit() {
      let pendingResult = null;
      if (this.playlist) {
        pendingResult = this.update({
          id: this.playlist.id,
          newPlaylist: this.newPlaylist,
        });
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
