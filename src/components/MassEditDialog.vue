<template>
  <VDialog v-model="dialog" fullscreen scrollable>
    <template v-slot:activator="{ on }">
      <VBtn v-on="on" color="edit" class="ma-2" :disabled="tracks.length === 0">
        {{
          $tc("music.mass.edit-tracks", tracks.length, { count: tracks.length })
        }}
      </VBtn>
    </template>
    <VCard>
      <VForm v-model="isValid" ref="form">
        <VToolbar dark color="primary" class="flex-grow-0">
          <VBtn icon dark @click="dialog = false">
            <VIcon>mdi-close</VIcon>
          </VBtn>
          <VToolbarTitle>
            {{
              $tc("music.mass.edit-tracks", tracks.length, {
                count: tracks.length,
              })
            }}
          </VToolbarTitle>
          <VSpacer></VSpacer>
          <VToolbarItems>
            <VBtn icon @click="saveTracks" :disabled="saving">
              <VIcon>
                {{ saving ? "mdi-refresh mdi-spin" : "mdi-content-save" }}
              </VIcon>
            </VBtn>
          </VToolbarItems>
        </VToolbar>
        <div style="overflow-y: auto; backface-visibility: hidden;">
          <VContainer>
            <Errors />
            <VContainer
              fluid
              v-if="tracks.filter((t) => t.review_comment !== null).length > 0"
            >
              <VRow dense>
                <VCol cols="12">
                  <VCheckbox v-model="showReviewComments">
                    <template v-slot:label>
                      <span class="black--text">
                        {{
                          $tc(
                            "music.flag.show",
                            tracks.filter((t) => t.review_comment !== null)
                              .length
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
                    <table class="review-comment-table">
                      <tr
                        v-for="t of tracks.filter(
                          (tr) => tr.review_comment !== null
                        )"
                        :key="t.id"
                      >
                        <td class="text-right">
                          <strong>{{ t.number }}</strong>
                        </td>
                        <td>
                          <strong>{{ t.title }}</strong>
                        </td>
                        <td>{{ t.review_comment }}</td>
                      </tr>
                    </table>
                  </VAlert>
                </VCol>
              </VRow>
            </VContainer>
            <VDivider
              v-if="tracks.filter((t) => t.review_comment !== null).length > 0"
            />
            <VContainer fluid>
              <VRow dense>
                <VCol cols="12" sm="6">
                  <VCheckbox v-model="number.enabled">
                    <template v-slot:label>
                      <span class="black--text">
                        {{ $t("music.mass.increase-track") }}
                      </span>
                    </template>
                  </VCheckbox>
                </VCol>
                <VCol cols="12" sm="6">
                  <VTextField
                    v-model="number.amount"
                    :label="$t('common.amount')"
                    type="number"
                    step="1"
                    v-if="number.enabled"
                    hide-details="true"
                  />
                </VCol>
              </VRow>
            </VContainer>
            <VDivider />
            <VContainer fluid>
              <VRow dense>
                <VCol cols="12" sm="6">
                  <VCheckbox v-model="titleReplacement.enabled">
                    <template v-slot:label>
                      <span class="black--text">
                        {{ $t("music.mass.title-search") }}
                      </span>
                    </template>
                  </VCheckbox>
                </VCol>
                <VCol cols="12" sm="6">
                  <VCheckbox
                    v-model="titleReplacement.regex"
                    :label="$t('music.mass.regex')"
                    v-if="titleReplacement.enabled"
                  />
                </VCol>
              </VRow>
              <VRow v-if="titleReplacement.enabled">
                <VCol cols="12" sm="6">
                  <VTextField
                    :label="$t('common.search')"
                    v-model="titleReplacement.search"
                  />
                </VCol>
                <VCol cols="12" sm="6">
                  <VTextField
                    :label="$t('common.replace')"
                    v-model="titleReplacement.replace"
                  />
                </VCol>
              </VRow>
            </VContainer>
            <VDivider />
            <VContainer fluid>
              <VRow dense>
                <VCol cols="12" sm="6">
                  <VCheckbox v-model="album.enabled">
                    <template v-slot:label>
                      <span class="black--text">
                        {{ $t("music.mass.set-album") }}
                      </span>
                    </template>
                  </VCheckbox>
                </VCol>
                <VCol cols="12" sm="6">
                  <VAutocomplete
                    :items="sortedAlbums"
                    item-text="title"
                    item-value="id"
                    label="Album"
                    hide-details="true"
                    v-model="album.album"
                    :rules="rules.album"
                    v-if="album.enabled"
                  />
                </VCol>
              </VRow>
            </VContainer>
            <VDivider />
            <VContainer fluid>
              <VRow dense>
                <VCol cols="12" sm="6">
                  <VCheckbox v-model="changeGenres.enabled">
                    <template v-slot:label>
                      <span class="black--text">
                        {{ $t("music.mass.change-genres") }}
                      </span>
                    </template>
                  </VCheckbox>
                </VCol>
                <VCol cols="12" sm="6">
                  <VCheckbox
                    v-model="changeGenres.replace"
                    :label="$t('music.mass.replace-instead-genres')"
                    v-if="changeGenres.enabled"
                  />
                </VCol>
              </VRow>
              <VRow v-if="changeGenres.enabled">
                <VCol cols="12" sm="6">
                  <VCombobox
                    :items="sortedGenres"
                    cache-items
                    chips
                    deletable-chips
                    item-text="name"
                    item-value="id"
                    :label="$t('music.genre-s')"
                    multiple
                    return-object
                    v-model="changeGenres.genres"
                    :rules="rules.genre"
                    validate-on-blur
                  />
                </VCol>
              </VRow>
            </VContainer>
            <VDivider />
            <VContainer fluid>
              <VRow dense>
                <VCol cols="12" sm="6">
                  <VCheckbox v-model="changeArtists.enabled">
                    <template v-slot:label>
                      <span class="black--text">
                        {{ $t("music.mass.change-artists") }}
                      </span>
                    </template>
                  </VCheckbox>
                </VCol>
                <VCol cols="12" sm="6">
                  <VCheckbox
                    v-model="changeArtists.replace"
                    :label="$t('music.mass.replace-instead-artists')"
                    v-if="changeArtists.enabled"
                  />
                </VCol>
              </VRow>
              <VRow
                :key="index"
                v-for="(item, index) of changeArtists.track_artists"
                no-gutters
              >
                <VCol class="flex-column no-grow" v-if="changeArtists.enabled">
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
                    :disabled="index === changeArtists.track_artists.length - 1"
                  >
                    <VIcon>mdi-menu-down</VIcon>
                  </VBtn>
                  <VBtn @click="removeArtist(index)" icon small class="ma-2">
                    <VIcon>mdi-close</VIcon>
                  </VBtn>
                </VCol>
                <VCol v-if="changeArtists.enabled">
                  <VCombobox
                    :items="sortedArtists"
                    item-text="name"
                    item-value="id"
                    :label="$tc('music.artists', 2)"
                    :rules="rules.artist"
                    return-object
                    v-model="item.artist_id"
                  />
                  <VTextField :label="$t('common.name')" v-model="item.name" />
                  <VAutocomplete
                    :items="roles"
                    :label="$t('music.artist.role')"
                    v-model="item.role"
                  />
                  <VDivider
                    light
                    v-if="index !== changeArtists.track_artists.length - 1"
                  />
                </VCol>
              </VRow>
              <VBtn
                @click="addArtist"
                color="success"
                class="ma-2"
                v-if="changeArtists.enabled"
              >
                {{ $t("music.artist.add") }}
              </VBtn>
            </VContainer>
            <VDivider
              v-if="tracks.filter((t) => t.review_comment !== null).length > 0"
            />
            <VContainer
              fluid
              v-if="tracks.filter((t) => t.review_comment !== null).length > 0"
            >
              <VRow dense>
                <VCol cols="12" sm="6">
                  <VCheckbox v-model="clearReviewComments">
                    <template v-slot:label>
                      <span class="black--text">
                        {{
                          $tc(
                            "music.flag.clear",
                            tracks.filter((t) => t.review_comment !== null)
                              .length
                          )
                        }}
                      </span>
                    </template>
                  </VCheckbox>
                </VCol>
              </VRow>
            </VContainer>
          </VContainer>
        </div>
      </VForm>
    </VCard>
  </VDialog>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import Errors from "./Errors";

export default {
  name: "MassEditDialog",
  components: { Errors },
  props: {
    tracks: { default: () => [], type: Array },
  },
  data() {
    return {
      dialog: false,
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
    ...mapGetters("artists", {
      sortedArtists: "artistsByName",
    }),
    ...mapGetters("genres", {
      sortedGenres: "genresByName",
    }),
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
      if (this.changeGenres.enabled) {
        rules.genre.push(genreValidation);
      }

      if (this.changeArtists.enabled) {
        const artistValidation = (v) =>
          !!v || this.$t("errors.artists.artist-blank");
        rules.artist.push(artistValidation);
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
    saveTracks() {
      this.$refs.form.validate();
      if (!this.isValid) return false;

      this.saving = true;
      const transformedArtists = [];
      const transformedGenres = [];
      const promises = [];

      if (this.changeArtists.enabled) {
        this.changeArtists.track_artists.forEach((ta, index) => {
          if (typeof ta.artist_id === "string") {
            promises.push(
              this.createArtist({
                name: ta.artist_id,
                review_comment: "New artist",
              }).then((id) => {
                if (id) {
                  transformedArtists.push({
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
            transformedArtists.push({
              artist_id: ta.artist_id.id,
              name: ta.name || ta.artist_id.name,
              role: ta.role,
              order: index + 1,
            });
          }
        });
      }

      if (this.changeGenres.enabled) {
        for (let genre_id of this.changeGenres.genres) {
          if (typeof genre_id === "string") {
            promises.push(
              this.createGenre({ name: genre_id }).then((id) => {
                if (id) {
                  transformedGenres.push(id);
                } else {
                  return Promise.reject();
                }
              })
            );
          } else {
            transformedGenres.push(genre_id.id);
          }
        }
      }

      Promise.all(promises)
        .then(() => {
          return Promise.all(
            this.tracks.map((t) => {
              const transformed = {
                number: t.number,
                title: t.title,
                album_id: t.album_id,
                review_comment: this.clearReviewComments
                  ? null
                  : t.review_comment,
                genre_ids: t.genre_ids,
                track_artists: t.track_artists,
              };

              if (this.number.enabled) {
                transformed.number += parseInt(this.number.amount);
              }

              if (this.titleReplacement.enabled) {
                if (this.titleReplacement.regex) {
                  transformed.title = transformed.title.replace(
                    new RegExp(this.titleReplacement.search),
                    this.titleReplacement.replace
                  );
                } else {
                  transformed.title = transformed.title.replace(
                    this.titleReplacement.search,
                    this.titleReplacement.replace
                  );
                }
              }

              if (this.changeArtists.enabled) {
                if (this.changeArtists.replace) {
                  transformed.track_artists = transformedArtists;
                } else {
                  transformedArtists.forEach((a) => {
                    if (
                      transformed.track_artists.filter(
                        (ta) =>
                          ta.name === a.name &&
                          ta.role === a.role &&
                          ta.artist_id === a.artist_id
                      ).length === 0
                    ) {
                      a.order += t.track_artists.length - 1;
                      transformed.track_artists.push(a);
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

              return this.update({ id: t.id, newTrack: transformed });
            })
          );
        })
        .then(() => {
          this.dialog = false;
          this.resetState();
        })
        .finally(() => {
          this.saving = false;
          this.$emit("close");
        });
    },
    addArtist() {
      this.changeArtists.track_artists.push({
        artist_id: null,
        name: "",
        role: "main",
      });
    },
    removeArtist(index) {
      this.changeArtists.track_artists.splice(index, 1);
    },
    moveArtist(index, direction) {
      this.changeArtists.track_artists.splice(
        index + direction,
        0,
        this.changeArtists.track_artists.splice(index, 1)[0]
      );
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
.review-comment-table td {
  padding: 0 0.5rem;
}
</style>
