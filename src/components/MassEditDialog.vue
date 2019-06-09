<template>
  <div>
    <VDialog v-model="dialog" fullscreen scrollable>
      <template v-slot:activator="{ on }">
        <VBtn v-on="on" :disabled="tracks.length === 0">
          Edit {{ tracks.length }}
          {{ tracks.length === 1 ? "track" : "tracks" }}
        </VBtn>
      </template>
      <VCard>
        <VToolbar dark color="primary">
          <VBtn icon dark @click="dialog = false">
            <VIcon>mdi-close</VIcon>
          </VBtn>
          <VToolbarTitle>
            Edit {{ tracks.length }}
            {{ tracks.length === 1 ? "track" : "tracks" }}
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
        <div style="overflow-y: auto; backface-visibility: hidden">
          <VContainer>
            <Errors />
            <VContainer
              fluid
              grid-list-md
              v-if="tracks.filter(t => t.review_comment !== null).length > 0"
            >
              <VLayout>
                <VFlex xs12>
                  <VCheckbox v-model="showReviewComments">
                    <template v-slot:label>
                      <span class="black--text">Show review comments</span>
                    </template>
                  </VCheckbox>
                </VFlex>
              </VLayout>
              <VLayout>
                <VFlex xs12>
                  <VAlert
                    :value="showReviewComments"
                    type="warning"
                    icon="mdi-flag"
                  >
                    <table class="review-comment-table">
                      <tr
                        v-for="t of tracks.filter(
                          tr => tr.review_comment !== null
                        )"
                        :key="t.id"
                      >
                        <td class="text-xs-right">
                          <strong>{{ t.number }}</strong>
                        </td>
                        <td>
                          <strong>{{ t.title }}</strong>
                        </td>
                        <td>{{ t.review_comment }}</td>
                      </tr>
                    </table>
                  </VAlert>
                </VFlex>
              </VLayout>
            </VContainer>
            <VDivider
              v-if="tracks.filter(t => t.review_comment !== null).length > 0"
            />
            <VContainer fluid grid-list-md>
              <VLayout>
                <VFlex xs12 sm6>
                  <VCheckbox v-model="number.enabled">
                    <template v-slot:label>
                      <span class="black--text">Increase track numbers</span>
                    </template>
                  </VCheckbox>
                </VFlex>
                <VFlex xs12 sm6>
                  <VTextField
                    v-model="number.amount"
                    label="Amount"
                    type="number"
                    v-if="number.enabled"
                  />
                </VFlex>
              </VLayout>
            </VContainer>
            <VDivider />
            <VContainer fluid grid-list-md>
              <VLayout>
                <VFlex xs12 sm6>
                  <VCheckbox v-model="titleReplacement.enabled">
                    <template v-slot:label>
                      <span class="black--text">Title search and replace</span>
                    </template>
                  </VCheckbox>
                </VFlex>
                <VFlex xs12 sm6>
                  <VCheckbox
                    v-model="titleReplacement.regex"
                    label="Use regular expressions"
                    v-if="titleReplacement.enabled"
                  />
                </VFlex>
              </VLayout>
              <VLayout>
                <VFlex xs12 sm6>
                  <VTextField
                    label="Search"
                    v-model="titleReplacement.search"
                    v-if="titleReplacement.enabled"
                  />
                </VFlex>
                <VFlex xs12 sm6>
                  <VTextField
                    label="Replace"
                    v-model="titleReplacement.replace"
                    v-if="titleReplacement.enabled"
                  />
                </VFlex>
              </VLayout>
            </VContainer>
            <VDivider />
            <VContainer fluid grid-list-md>
              <VLayout>
                <VFlex xs12 sm6>
                  <VCheckbox v-model="album.enabled">
                    <template v-slot:label>
                      <span class="black--text">Set album</span>
                    </template>
                  </VCheckbox>
                </VFlex>
                <VFlex xs12 sm6>
                  <VAutocomplete
                    :items="sortedAlbums"
                    item-text="title"
                    item-value="id"
                    label="Album"
                    v-model="album.album"
                    v-if="album.enabled"
                  />
                </VFlex>
              </VLayout>
            </VContainer>
            <VDivider />
            <VContainer fluid grid-list-md>
              <VLayout>
                <VFlex xs12 sm6>
                  <VCheckbox v-model="changeGenres.enabled">
                    <template v-slot:label>
                      <span class="black--text">Change genres</span>
                    </template>
                  </VCheckbox>
                </VFlex>
                <VFlex xs12 sm6>
                  <VCheckbox
                    v-model="changeGenres.replace"
                    label="Replace genres instead of adding"
                    v-if="changeGenres.enabled"
                  />
                </VFlex>
              </VLayout>
              <VLayout>
                <VFlex xs12 sm6>
                  <VCombobox
                    :items="sortedGenres"
                    cache-items
                    chips
                    deletable-chips
                    item-text="name"
                    item-value="id"
                    label="Genre(s)"
                    multiple
                    return-object
                    v-model="changeGenres.genres"
                    v-if="changeGenres.enabled"
                  />
                </VFlex>
              </VLayout>
            </VContainer>
            <VDivider />
            <VContainer fluid grid-list-md>
              <VLayout>
                <VFlex xs12 sm6>
                  <VCheckbox v-model="changeArtists.enabled">
                    <template v-slot:label>
                      <span class="black--text">Change artists</span>
                    </template>
                  </VCheckbox>
                </VFlex>
                <VFlex xs12 sm6>
                  <VCheckbox
                    v-model="changeArtists.replace"
                    label="Replace artists instead of adding"
                    v-if="changeArtists.enabled"
                  />
                </VFlex>
              </VLayout>
              <VLayout
                :key="index"
                row
                v-for="(item, index) of changeArtists.track_artists"
              >
                <VLayout column class="no-grow" v-if="changeArtists.enabled">
                  <VBtn
                    @click="moveArtist(index, -1)"
                    icon
                    small
                    :disabled="index === 0"
                  >
                    <VIcon>mdi-menu-up</VIcon>
                  </VBtn>
                  <VBtn
                    @click="moveArtist(index, 1)"
                    icon
                    small
                    :disabled="index === changeArtists.track_artists.length - 1"
                  >
                    <VIcon>mdi-menu-down</VIcon>
                  </VBtn>
                  <VBtn @click="removeArtist(index)" icon small>
                    <VIcon>mdi-close</VIcon>
                  </VBtn>
                </VLayout>
                <VLayout column v-if="changeArtists.enabled">
                  <VCombobox
                    :items="sortedArtists"
                    item-text="name"
                    item-value="id"
                    label="Artist"
                    return-object
                    v-model="item.artist_id"
                  />
                  <VTextField label="Name" v-model="item.name" />
                  <VAutocomplete
                    :items="roles"
                    label="Role"
                    v-model="item.role"
                  />
                  <VDivider
                    light
                    v-if="index !== changeArtists.track_artists.length - 1"
                  />
                </VLayout>
              </VLayout>
              <VBtn
                @click="addArtist"
                color="success"
                v-if="changeArtists.enabled"
              >
                Add artist
              </VBtn>
            </VContainer>
            <VDivider />
            <VContainer fluid grid-list-md>
              <VLayout>
                <VFlex xs12 sm6>
                  <VCheckbox v-model="clearReviewComments">
                    <template v-slot:label>
                      <span class="black--text">Clear review comments</span>
                    </template>
                  </VCheckbox>
                </VFlex>
              </VLayout>
            </VContainer>
          </VContainer>
        </div>
      </VCard>
    </VDialog>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import Errors from "./Errors";

export default {
  name: "MassEditDialog",
  components: { Errors },
  props: {
    tracks: { default: () => [], type: Array }
  },
  data() {
    return {
      dialog: false,
      roles: [
        {
          value: "main",
          text: "Main"
        },
        {
          value: "performer",
          text: "Performer"
        },
        {
          value: "composer",
          text: "Composer"
        },
        {
          value: "conductor",
          text: "Conductor"
        },
        {
          value: "remixer",
          text: "Remixer"
        },
        {
          value: "producer",
          text: "Producer"
        },
        {
          value: "arranger",
          text: "Arranger"
        }
      ],
      titleReplacement: {
        enabled: false,
        search: "",
        replace: "",
        regex: false
      },
      changeArtists: {
        enabled: false,
        replace: false,
        track_artists: []
      },
      changeGenres: {
        enabled: false,
        replace: false,
        genres: []
      },
      album: {
        enabled: false,
        album: null
      },
      number: {
        enabled: false,
        amount: 0
      },
      clearReviewComments: false,
      showReviewComments: false,
      saving: false
    };
  },
  computed: {
    ...mapState("albums", ["albums"]),
    ...mapState("artists", ["artists"]),
    ...mapState("genres", ["genres"]),
    ...mapGetters("albums", {
      sortedAlbums: "albumsByTitle"
    }),
    ...mapGetters("artists", {
      sortedArtists: "artistsByName"
    }),
    ...mapGetters("genres", {
      sortedGenres: "genresByName"
    })
  },
  methods: {
    ...mapActions("tracks", ["update"]),
    ...mapActions({
      createArtist: "artists/create",
      createGenre: "genres/create"
    }),
    saveTracks() {
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
                review_comment: "New artist"
              }).then(id => {
                if (id) {
                  transformedArtists.push({
                    artist_id: id,
                    name: ta.name || ta.artist_id,
                    role: ta.role,
                    order: index + 1
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
              order: index + 1
            });
          }
        });
      }

      if (this.changeGenres.enabled) {
        for (let genre_id of this.changeGenres.genres) {
          if (typeof genre_id === "string") {
            promises.push(
              this.createGenre({ name: genre_id }).then(id => {
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
            this.tracks.map(t => {
              const transformed = {
                number: t.number,
                title: t.title,
                album_id: t.album_id,
                review_comment: this.clearReviewComments
                  ? null
                  : t.review_comment,
                genre_ids: t.genre_ids,
                track_artists: t.track_artists
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
                  transformedArtists.forEach(a => {
                    if (
                      transformed.track_artists.filter(
                        ta =>
                          ta.name === a.name &&
                          ta.role === a.role &&
                          ta.artist_id === a.artist_id
                      ).length === 0
                    ) {
                      transformed.track_artists.push(a);
                    }
                  });
                }
              }

              if (this.changeGenres.enabled) {
                if (this.changeGenres.replace) {
                  transformed.genre_ids = transformedGenres;
                } else {
                  transformedGenres.forEach(g => {
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
        });
    },
    addArtist() {
      this.changeArtists.track_artists.push({
        artist_id: null,
        name: "",
        role: "main"
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
        regex: false
      };
      this.changeArtists = {
        enabled: false,
        replace: false,
        track_artists: []
      };
      this.changeGenres = {
        enabled: false,
        replace: false,
        genres: []
      };
      this.album = {
        enabled: false,
        album: null
      };
      this.number = {
        enabled: false,
        amount: 0
      };
      this.clearReviewComments = false;
      this.showReviewComments = false;
    }
  }
};
</script>

<style scoped>
.review-comment-table td {
  padding: 0 0.5rem;
}
</style>
