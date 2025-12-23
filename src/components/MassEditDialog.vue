<template>
  <VDialog v-model="dialog" fullscreen scrollable>
    <template #activator="{ props: activatorProps }">
      <VBtn
        color="edit"
        class="ma-2"
        :disabled="tracks.length === 0"
        v-bind="activatorProps"
      >
        {{
          $tc("music.mass.edit-tracks", tracks.length, { count: tracks.length })
        }}
      </VBtn>
    </template>
    <VCard>
      <VToolbar dark color="primary" class="flex-grow-0">
        <VBtn icon @click="dialog = false">
          <VIcon>mdi-close</VIcon>
        </VBtn>
        <VToolbarTitle>
          {{
            $tc("music.mass.edit-tracks", tracks.length, {
              count: tracks.length,
            })
          }}
        </VToolbarTitle>
        <VSpacer />
        <VToolbarItems>
          <VBtn icon :disabled="saving" @click="saveTracks">
            <VIcon>
              {{ saving ? "mdi-refresh mdi-spin" : "mdi-content-save" }}
            </VIcon>
          </VBtn>
        </VToolbarItems>
      </VToolbar>
      <div style="overflow-y: auto; backface-visibility: hidden">
        <VForm ref="form" v-model="isValid" @submit.prevent="saveTracks">
          <VContainer>
            <Errors />
            <VContainer
              v-if="tracksWithReviewComments.length > 0"
              key="showReviewComments"
              fluid
            >
              <VRow dense>
                <VCol cols="12">
                  <VCheckbox v-model="showReviewComments">
                    <template #label>
                      <span class="text-black">
                        {{
                          $tc(
                            "music.flag.show",
                            tracksWithReviewComments.length,
                            { count: tracksWithReviewComments.length },
                          )
                        }}
                      </span>
                    </template>
                  </VCheckbox>
                </VCol>
              </VRow>
              <VRow v-if="showReviewComments">
                <VCol cols="12">
                  <VAlert
                    :value="showReviewComments"
                    type="warning"
                    icon="mdi-flag"
                  >
                    <table class="review-comments">
                      <tr v-for="t of tracksWithReviewComments" :key="t.id">
                        <td class="review-comments__cell text-right">
                          <strong>{{ t.number }}</strong>
                        </td>
                        <td class="review-comments__cell">
                          <strong>{{ t.title }}</strong>
                        </td>
                        <td class="review-comments__cell">
                          {{ t.review_comment }}
                        </td>
                      </tr>
                    </table>
                  </VAlert>
                </VCol>
              </VRow>
            </VContainer>
            <VDivider v-if="tracksWithReviewComments.length > 0" />
            <VContainer key="increaseTrackNumbers" fluid>
              <VRow dense>
                <VCol cols="12" sm="6">
                  <VCheckbox v-model="number.enabled">
                    <template #label>
                      <span class="text-black">
                        {{ $t("music.mass.increase-track") }}
                      </span>
                    </template>
                  </VCheckbox>
                </VCol>
                <VCol cols="12" sm="6">
                  <VTextField
                    v-if="number.enabled"
                    v-model="number.amount"
                    :label="$t('common.amount')"
                    type="number"
                    step="1"
                    hide-details="true"
                  />
                </VCol>
              </VRow>
            </VContainer>
            <VDivider />
            <VContainer key="searchAndReplaceTitle" fluid>
              <VRow dense>
                <VCol cols="12" sm="6">
                  <VCheckbox v-model="titleReplacement.enabled">
                    <template #label>
                      <span class="text-black">
                        {{ $t("music.mass.title-search") }}
                      </span>
                    </template>
                  </VCheckbox>
                </VCol>
                <VCol cols="12" sm="6">
                  <VCheckbox
                    v-if="titleReplacement.enabled"
                    v-model="titleReplacement.regex"
                    :label="$t('music.mass.regex')"
                  />
                </VCol>
              </VRow>
              <VRow v-if="titleReplacement.enabled">
                <VCol cols="12" sm="6">
                  <VTextField
                    v-model="titleReplacement.search"
                    :label="$t('common.search')"
                  />
                </VCol>
                <VCol cols="12" sm="6">
                  <VTextField
                    v-model="titleReplacement.replace"
                    :label="$t('common.replace')"
                  />
                </VCol>
              </VRow>
            </VContainer>
            <VDivider />
            <VContainer key="setAlbum" fluid>
              <VRow dense>
                <VCol cols="12" sm="6">
                  <VCheckbox v-model="album.enabled">
                    <template #label>
                      <span class="text-black">
                        {{ $t("music.mass.set-album") }}
                      </span>
                    </template>
                  </VCheckbox>
                </VCol>
                <VCol cols="12" sm="6">
                  <VAutocomplete
                    v-if="album.enabled"
                    v-model="album.album"
                    :items="sortedAlbums"
                    :custom-filter="filterTitle"
                    item-value="id"
                    item-title="title"
                    label="Album"
                    hide-details="true"
                    :rules="rules.album"
                  >
                    <template #item="{ item }">
                      {{ item.title }}
                      <span class="text-grey pl-2 ml-auto text-body-2">
                        {{ item.id }}
                      </span>
                    </template>
                  </VAutocomplete>
                </VCol>
              </VRow>
            </VContainer>
            <VDivider />
            <VContainer key="changeGenres" fluid>
              <VRow dense>
                <VCol cols="12" sm="6">
                  <VCheckbox v-model="changeGenres.enabled">
                    <template #label>
                      <span class="text-black">
                        {{ $t("music.mass.change-genres") }}
                      </span>
                    </template>
                  </VCheckbox>
                </VCol>
                <VCol cols="12" sm="6">
                  <VCheckbox
                    v-if="changeGenres.enabled"
                    v-model="changeGenres.replace"
                    :label="$t('music.mass.replace-instead-genres')"
                  />
                </VCol>
              </VRow>
              <VRow v-if="changeGenres.enabled">
                <VCol cols="12" sm="6">
                  <VCombobox
                    v-model="changeGenres.genres"
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
                </VCol>
              </VRow>
            </VContainer>
            <VDivider />
            <VContainer key="changeArtists" fluid>
              <VRow dense>
                <VCol cols="12" sm="6">
                  <VCheckbox v-model="changeArtists.enabled">
                    <template #label>
                      <span class="text-black">
                        {{ $t("music.mass.change-artists") }}
                      </span>
                    </template>
                  </VCheckbox>
                </VCol>
                <VCol cols="12" sm="6">
                  <VCheckbox
                    v-if="changeArtists.enabled"
                    v-model="changeArtists.replace"
                    :label="$t('music.mass.replace-instead-artists')"
                  />
                </VCol>
              </VRow>
              <TrackFormArtists
                v-if="changeArtists.enabled"
                v-model="changeArtists.track_artists"
              />
              <VBtn
                v-if="changeArtists.enabled"
                color="success"
                class="ma-2"
                @click="addArtist"
              >
                {{ $t("music.artist.add") }}
              </VBtn>
            </VContainer>
            <VDivider v-if="tracksWithReviewComments.length > 0" />
            <VContainer
              v-if="tracksWithReviewComments.length > 0"
              key="clearReviewComments"
              fluid
            >
              <VRow dense>
                <VCol cols="12" sm="6">
                  <VCheckbox v-model="clearReviewComments">
                    <template #label>
                      <span class="text-black">
                        {{
                          $tc(
                            "music.flag.clear",
                            tracksWithReviewComments.length,
                          )
                        }}
                      </span>
                    </template>
                  </VCheckbox>
                </VCol>
              </VRow>
            </VContainer>
          </VContainer>
        </VForm>
      </div>
    </VCard>
  </VDialog>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import { compareTracks } from "../comparators";
import Errors from "./Errors.vue";
import TrackFormArtists from "./TrackFormArtists.vue";

export default {
  name: "MassEditDialog",
  components: { Errors, TrackFormArtists },
  props: {
    tracks: { default: () => [], type: Array },
  },
  data() {
    return {
      dialog: false,
      titleReplacement: {
        enabled: false,
        search: "",
        replace: "",
        regex: false,
      },
      changeArtists: {
        enabled: false,
        replace: false,
        track_artists: [
          {
            artist_id: null,
            name: "",
            role: "main",
          },
        ],
      },
      changeGenres: {
        enabled: false,
        replace: false,
        genres: [],
      },
      album: {
        enabled: false,
        album: null,
      },
      number: {
        enabled: false,
        amount: 0,
      },
      clearReviewComments: false,
      showReviewComments: false,
      saving: false,
      isValid: true,
    };
  },
  computed: {
    ...mapState("albums", ["albums"]),
    ...mapState("artists", ["artists"]),
    ...mapState("genres", ["genres"]),
    ...mapGetters("albums", {
      sortedAlbums: "albumsByTitle",
    }),
    ...mapGetters("genres", {
      sortedGenres: "genresByName",
    }),
    sortedTracks() {
      return [...this.tracks].sort(compareTracks(this.albums));
    },
    tracksWithReviewComments() {
      return this.sortedTracks.filter((t) => t.review_comment !== null);
    },
    rules: function () {
      const rules = {
        genre: [],
        artist: [],
        album: [],
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
      if (this.changeGenres.enabled) {
        rules.genre.push(genreValidation);
      }

      if (this.album.enabled) {
        const albumValidation = (v) =>
          !!v || this.$t("errors.albums.album-blank");
        rules.album.push(albumValidation);
      }

      return rules;
    },
  },
  methods: {
    ...mapActions("tracks", ["update"]),
    ...mapActions({
      createArtist: "artists/create",
      createGenre: "genres/create",
    }),
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
    async saveTracks() {
      this.$refs.form.validate();
      if (!this.isValid) {
        return false;
      }

      this.saving = true;
      const transformedArtists = [];
      const transformedGenres = [];
      const pendingResults = [];

      if (this.changeArtists.enabled) {
        const mappedArtists = this.changeArtists.track_artists.map(
          async (ta, index) => {
            if (typeof ta.artist_id === "string") {
              const id = await this.createArtist({
                name: ta.artist_id,
                review_comment: "New artist",
              });
              if (id) {
                transformedArtists.push({
                  artist_id: id,
                  name: ta.name || ta.artist_id,
                  role: ta.role,
                  hidden: ta.hidden,
                  order: index + 1,
                });
              } else {
                throw false;
              }
            } else {
              transformedArtists.push({
                artist_id: ta.artist_id.id,
                name: ta.name || ta.artist_id.name,
                role: ta.role,
                hidden: ta.hidden,
                order: index + 1,
              });
            }
          },
        );
        pendingResults.push(...mappedArtists);
      }

      if (this.changeGenres.enabled) {
        const mappedGenres = this.changeGenres.genres.map(async (genre_id) => {
          if (typeof genre_id === "string") {
            const id = await this.createGenre({ name: genre_id });
            if (id) {
              transformedGenres.push(id);
            } else {
              throw false;
            }
          } else {
            transformedGenres.push(genre_id.id);
          }
        });
        pendingResults.push(...mappedGenres);
      }

      await Promise.all(pendingResults);
      const mappedTracks = this.tracks.map(async (t) => {
        const transformed = {
          number: t.number,
          title: t.title,
          album_id: t.album_id,
          review_comment: this.clearReviewComments ? null : t.review_comment,
          genre_ids: [...t.genre_ids],
          track_artists: [...t.track_artists],
        };

        if (this.number.enabled) {
          transformed.number += parseInt(this.number.amount);
        }

        if (this.titleReplacement.enabled) {
          if (this.titleReplacement.regex) {
            transformed.title = transformed.title.replace(
              new RegExp(this.titleReplacement.search),
              this.titleReplacement.replace,
            );
          } else {
            transformed.title = transformed.title.replace(
              this.titleReplacement.search,
              this.titleReplacement.replace,
            );
          }
        }

        if (this.changeArtists.enabled) {
          if (this.changeArtists.replace) {
            transformed.track_artists = transformedArtists;
          } else {
            transformedArtists.forEach((a) => {
              const index = transformed.track_artists.findIndex(
                (ta) =>
                  ta.name === a.name &&
                  ta.role === a.role &&
                  ta.artist_id === a.artist_id,
              );
              if (index === -1) {
                a.order += t.track_artists.length;
                transformed.track_artists.push(a);
              } else {
                transformed.track_artists[index].hidden = a.hidden;
              }
            });
          }
        }

        if (this.changeGenres.enabled) {
          if (this.changeGenres.replace) {
            transformed.genre_ids = transformedGenres;
          } else {
            transformedGenres.forEach((g) => {
              if (!transformed.genre_ids.includes(g)) {
                transformed.genre_ids.push(g);
              }
            });
          }
        }

        if (this.album.enabled) {
          transformed.album_id = this.album.album;
        }

        await this.update({ id: t.id, newTrack: transformed });
      });
      await Promise.all(mappedTracks);
      this.dialog = false;
      this.resetState();
      this.saving = false;
      this.$emit("close");
    },
    addArtist() {
      this.changeArtists.track_artists.push({
        artist_id: null,
        name: "",
        role: "main",
        hidden: false,
      });
    },
    resetState() {
      this.titleReplacement = {
        enabled: false,
        search: "",
        replace: "",
        regex: false,
      };
      this.changeArtists = {
        enabled: false,
        replace: false,
        track_artists: [],
      };
      this.changeGenres = {
        enabled: false,
        replace: false,
        genres: [],
      };
      this.album = {
        enabled: false,
        album: null,
      };
      this.number = {
        enabled: false,
        amount: 0,
      };
      this.clearReviewComments = false;
      this.showReviewComments = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.review-comments {
  &__cell {
    padding: 0 0.5rem;
  }
}
</style>
