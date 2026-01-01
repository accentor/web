<template>
  <VContainer v-if="track" class="fill-height" fluid>
    <VRow no-gutters align="center" justify="center">
      <VCol md="6" sm="8" cols="12" @change.once="isDirty = true">
        <VAlert
          :value="track.review_comment !== null"
          type="warning"
          icon="mdi-flag"
        >
          {{ track.review_comment }}
        </VAlert>
        <VForm v-if="loaded" v-model="isValid" @submit.prevent="submit">
          <VTextField
            v-model="newTrack.number"
            type="number"
            :label="$t('music.track.number')"
            :rules="rules.number"
            min="0"
            step="1"
          />
          <VTextField
            v-model="newTrack.title"
            :label="$t('music.title')"
            :rules="[(v) => !!v || $t('errors.tracks.title-blank')]"
          />
          <VAutocomplete
            v-model="newTrack.album_id"
            :items="sortedAlbums"
            :custom-filter="filterTitle"
            item-title="title"
            item-value="id"
            :label="$tc('music.albums', 1)"
          >
            <template #item="{ item, props }">
              <VListItem v-bind="props" :title="null">
                <VListItemTitle>
                  {{ item.title }}
                </VListItemTitle>
                <template #append>
                  <span class="text-grey pl-2 text-body-2">
                    {{ item.raw.id }}
                  </span>
                </template>
              </VListItem>
            </template>
          </VAutocomplete>
          <VCombobox
            v-model="newTrack.genre_ids"
            :items="sortedGenres"
            :custom-filter="filterName"
            chips
            closable-chips
            item-title="name"
            item-value="id"
            :label="$t('music.genre-s')"
            multiple
            return-object
            :rules="rules.genre"
            validate-on="blur"
          />
          <h4 class="text-subtitle-1">{{ $tc("music.artists", 2) }}</h4>
          <TrackFormArtists
            v-model="newTrack.track_artists"
            @update:value.once="isDirty = true"
          />
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
            <VBtn
              color="success"
              class="ma-2"
              @click="addArtist"
              @click.once="isDirty = true"
            >
              {{ $t("music.artist.add") }}
            </VBtn>
          </VRow>
        </VForm>
      </VCol>
    </VRow>
  </VContainer>
</template>

<script>
import { mapState, mapActions } from "pinia";
import TrackFormArtists from "@/components/TrackFormArtists.vue";
import { useGenresStore } from "../../store/genres";
import { useArtistsStore } from "../../store/artists";
import { useAlbumsStore } from "../../store/albums";
import { useTracksStore } from "../../store/tracks";

export default {
  name: "EditTrack",
  components: { TrackFormArtists },
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
      clear_review_comment: true,
      isDirty: false,
      isValid: true,
      loaded: false,
    };
  },
  head() {
    return { title: this.$t("page-titles.edit", { obj: this.track.title }) };
  },
  computed: {
    ...mapState(useArtistsStore, {
      artists: "artists",
      sortedArtists: "artistsByName",
    }),
    ...mapState(useGenresStore, {
      genres: "genres",
      sortedGenres: "genresByName",
    }),
    ...mapState(useAlbumsStore, {
      albums: "albums",
      sortedAlbums: "albumsByTitle",
    }),
    track: function () {
      return useTracksStore().tracks[this.$route.params.id];
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
                g.normalized_name === newGenre.toLowerCase(),
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
  watch: {
    track: function () {
      if (this.track && !this.isDirty) {
        this.loaded = true;
        this.fillValues();
      }
    },
  },
  async created() {
    if (this.track) {
      await this.read(this.track.id);
      this.loaded = true;
      this.fillValues();
    }
  },
  methods: {
    ...mapActions(useTracksStore, ["read", "update"]),
    ...mapActions(useArtistsStore, { createArtist: "create" }),
    ...mapActions(useGenresStore, { createGenre: "create" }),
    filterName(item, queryText) {
      const search = queryText.toLowerCase();
      return (
        item.name.toLowerCase().indexOf(search) > -1 ||
        item.normalized_name.indexOf(search) > -1
      );
    },
    filterTitle(item, queryText) {
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
            hidden: ta.hidden,
          };
        })
        .sort((a1, a2) => a1.order - a2.order);
      this.newTrack.genre_ids = this.track.genre_ids.map(
        (id) => this.genres[id],
      );
    },
    addArtist() {
      this.newTrack.track_artists.push({
        artist_id: null,
        name: "",
        role: "main",
        hidden: false,
      });
    },
    async submit() {
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

      const mappedGenres = this.newTrack.genre_ids.map(async (genre_id) => {
        if (typeof genre_id === "string") {
          const id = await this.createGenre({ name: genre_id });
          if (id) {
            transformed.genre_ids.push(id);
          } else {
            throw false;
          }
        } else {
          transformed.genre_ids.push(genre_id.id);
        }
      });

      const mappedArtists = this.newTrack.track_artists.map(
        async (ta, index) => {
          if (typeof ta.artist_id === "string") {
            const id = await this.createArtist({
              name: ta.artist_id,
              review_comment: "New artist",
            });
            if (id) {
              transformed.track_artists.push({
                artist_id: id,
                name: ta.name || ta.artist_id,
                role: ta.role,
                hidden: ta.hidden ? 1 : 0,
                order: index + 1,
              });
            } else {
              throw false;
            }
          } else {
            transformed.track_artists.push({
              artist_id: ta.artist_id.id,
              name: ta.name || ta.artist_id.name,
              role: ta.role,
              hidden: ta.hidden ? 1 : 0,
              order: index + 1,
            });
          }
        },
      );

      await Promise.all([...mappedGenres, ...mappedArtists]);
      const succeeded = await this.update(this.track.id, transformed);
      if (succeeded) {
        this.$router.push(this.$route.query.redirect || { name: "tracks" });
      }
    },
  },
};
</script>
