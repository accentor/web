<template>
  <VContainer class="fill-height" fluid v-if="track">
    <vue-headful
      :title="$t('page-titles.edit', { obj: track.title }) + ' | Accentor'"
    />
    <VRow no-gutters align="center" justify="center">
      <VCol md="6" sm="8" cols="12">
        <VAlert
          :value="track.review_comment !== null"
          type="warning"
          icon="mdi-flag"
        >
          {{ track.review_comment }}
        </VAlert>
        <VForm v-model="isValid" @submit.prevent="submit">
          <VTextField
            type="number"
            :label="$t('music.track.number')"
            :rules="rules.number"
            min="0"
            step="1"
            v-model="newTrack.number"
          />
          <VTextField
            :label="$t('music.title')"
            :rules="[(v) => !!v || $t('errors.tracks.title-blank')]"
            v-model="newTrack.title"
          />
          <VAutocomplete
            :items="sortedAlbums"
            :filter="filterTitle"
            item-text="title"
            item-value="id"
            :label="$tc('music.albums', 1)"
            v-model="newTrack.album_id"
          />
          <VCombobox
            :items="sortedGenres"
            :filter="filterName"
            cache-items
            chips
            deletable-chips
            item-text="name"
            item-value="id"
            :label="$t('music.genre-s')"
            multiple
            return-object
            :rules="rules.genre"
            validate-on-blur
            v-model="newTrack.genre_ids"
          />
          <h4 class="text-subtitle-1">{{ $tc("music.artists", 2) }}</h4>
          <VRow
            :key="index"
            v-for="(item, index) of newTrack.track_artists"
            no-gutters
          >
            <VCol class="flex-grow-0 flex-column">
              <VBtn
                @click="moveArtist(index, -1)"
                icon
                small
                class="ma-2"
                :disabled="index === 0"
              >
                <VIcon>mdi-menu-up</VIcon>
              </VBtn>
              <VBtn
                @click="moveArtist(index, 1)"
                icon
                small
                class="ma-2"
                :disabled="index === newTrack.track_artists.length - 1"
              >
                <VIcon>mdi-menu-down</VIcon>
              </VBtn>
              <VBtn @click="removeArtist(index)" icon small class="ma-2">
                <VIcon>mdi-close</VIcon>
              </VBtn>
            </VCol>
            <VCol>
              <VCombobox
                :items="sortedArtists"
                :filter="filterName"
                item-text="name"
                item-value="id"
                :label="$tc('music.artists', 1)"
                return-object
                v-model="item.artist_id"
              />
              <VTextField :label="$t('common.name')" v-model="item.name" />
              <VAutocomplete
                :items="roles"
                :label="$t('music.artist.role')"
                v-model="item.role"
              />
              <VDivider v-if="index !== newTrack.track_artists.length - 1" />
            </VCol>
          </VRow>
          <VCheckbox
            v-if="track.review_comment !== null"
            v-model="clear_review_comment"
            :label="$tc('music.flag.clear', 1)"
          />
          <VRow>
            <VBtn
              :disabled="!isValid"
              color="primary"
              class="ma-2"
              type="submit"
            >
              {{ $t("music.track.update") }}
            </VBtn>
            <VSpacer />
            <VBtn @click="addArtist" color="success" class="ma-2">
              {{ $t("music.artist.add") }}
            </VBtn>
          </VRow>
        </VForm>
      </VCol>
    </VRow>
  </VContainer>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";

export default {
  name: "EditTrack",
  data() {
    return {
      newTrack: {
        number: 0,
        title: "",
        album_id: null,
        review_comment: null,
        track_artists: [],
        genre_ids: [],
      },
      roles: [
        {
          value: "main",
          text: this.$t("music.artist.roles.main"),
        },
        {
          value: "performer",
          text: this.$t("music.artist.roles.performer"),
        },
        {
          value: "composer",
          text: this.$t("music.artist.roles.composer"),
        },
        {
          value: "conductor",
          text: this.$t("music.artist.roles.conductor"),
        },
        {
          value: "remixer",
          text: this.$t("music.artist.roles.remixer"),
        },
        {
          value: "producer",
          text: this.$t("music.artist.roles.producer"),
        },
        {
          value: "arranger",
          text: this.$t("music.artist.roles.arranger"),
        },
      ],
      clear_review_comment: true,
      isValid: true,
    };
  },
  created() {
    this.$nextTick(() => {
      if (this.track) {
        this.fillValues();
      }
    });
  },
  watch: {
    track: function () {
      if (this.track) {
        this.fillValues();
      }
    },
  },
  computed: {
    ...mapState("albums", ["albums"]),
    ...mapState("artists", ["artists"]),
    ...mapState("genres", ["genres"]),
    ...mapGetters("albums", {
      sortedAlbums: "albumsByTitle",
    }),
    ...mapGetters("artists", {
      sortedArtists: "artistsByName",
    }),
    ...mapGetters("genres", {
      sortedGenres: "genresByName",
    }),
    track: function () {
      return (
        this.$store.state.tracks &&
        this.$store.state.tracks.tracks[this.$route.params.id]
      );
    },
    rules: function () {
      const rules = {
        number: [
          (v) => !!v || this.$t("errors.tracks.number-blank"),
          (v) => Number(v) % 1 === 0 || this.$t("errors.tracks.number-whole"),
        ],
        genre: [],
      };

      const genreValidation = (v) => {
        let valid = true;
        v.forEach((newGenre) => {
          if (typeof newGenre !== "object") {
            const double = this.sortedGenres.some(
              (g) =>
                g.name === newGenre ||
                g.normalized_name === newGenre.toLowerCase()
            );
            if (double) {
              valid = this.$t("errors.genre.name-taken-obj", { obj: newGenre });
            } else if (!newGenre.trim().length) {
              valid = this.$t("errors.genre.name-blank");
            }
          }
        });
        return valid; // We only return the last error, since we can only display one
      };
      rules.genre.push(genreValidation);

      return rules;
    },
  },
  methods: {
    ...mapActions("tracks", ["update"]),
    ...mapActions({
      createArtist: "artists/create",
      createGenre: "genres/create",
    }),
    filterName(item, queryText, itemText) {
      const search = queryText.toLowerCase();
      return (
        item.name.toLowerCase().indexOf(search) > -1 ||
        item.normalized_name.indexOf(search) > -1
      );
    },
    filterTitle(item, queryText, itemText) {
      const search = queryText.toLowerCase();
      return (
        item.title.toLowerCase().indexOf(search) > -1 ||
        item.normalized_title.indexOf(search) > -1
      );
    },
    fillValues() {
      this.newTrack.number = this.track.number;
      this.newTrack.title = this.track.title;
      this.newTrack.album_id = this.track.album_id;
      this.newTrack.review_comment = this.track.review_comment;
      this.newTrack.track_artists = this.track.track_artists
        .map((ta) => {
          return {
            artist_id: this.artists[ta.artist_id],
            name: ta.name,
            role: ta.role,
            order: ta.order,
          };
        })
        .sort((a1, a2) => a1.order - a2.order);
      this.newTrack.genre_ids = this.track.genre_ids.map(
        (id) => this.genres[id]
      );
    },
    addArtist() {
      this.newTrack.track_artists.push({
        artist_id: null,
        name: "",
        role: "main",
      });
    },
    removeArtist(index) {
      this.newTrack.track_artists.splice(index, 1);
    },
    moveArtist(index, direction) {
      this.newTrack.track_artists.splice(
        index + direction,
        0,
        this.newTrack.track_artists.splice(index, 1)[0]
      );
    },
    submit() {
      const transformed = {
        number: this.newTrack.number,
        title: this.newTrack.title,
        album_id: this.newTrack.album_id,
        review_comment: this.clear_review_comment
          ? null
          : this.newTrack.review_comment,
        genre_ids: [],
        track_artists: [],
      };
      const promises = [];

      for (let genre_id of this.newTrack.genre_ids) {
        if (typeof genre_id === "string") {
          promises.push(
            this.createGenre({ name: genre_id }).then((id) => {
              if (id) {
                transformed.genre_ids.push(id);
              } else {
                return Promise.reject();
              }
            })
          );
        } else {
          transformed.genre_ids.push(genre_id.id);
        }
      }

      this.newTrack.track_artists.forEach((ta, index) => {
        if (typeof ta.artist_id === "string") {
          promises.push(
            this.createArtist({
              name: ta.artist_id,
              review_comment: "New artist",
            }).then((id) => {
              if (id) {
                transformed.track_artists.push({
                  artist_id: id,
                  name: ta.name || ta.artist_id,
                  role: ta.role,
                  order: index + 1,
                });
              } else {
                return Promise.reject();
              }
            })
          );
        } else {
          transformed.track_artists.push({
            artist_id: ta.artist_id.id,
            name: ta.name || ta.artist_id.name,
            role: ta.role,
            order: index + 1,
          });
        }
      });

      Promise.all(promises).then(() => {
        this.update({ id: this.track.id, newTrack: transformed }).then(
          (succeeded) => {
            if (succeeded) {
              this.$router.push(
                this.$route.query.redirect || { name: "tracks" }
              );
            }
          }
        );
      });
    },
  },
};
</script>
