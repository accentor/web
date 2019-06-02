<template>
  <div>
    <VDialog v-model="dialog" fullscreen scrollable>
      <template v-slot:activator="{ on }">
        <VBtn icon v-on="on">
          <VIcon>mdi-pencil</VIcon>
        </VBtn>
      </template>
      <VCard>
        <VToolbar dark color="primary">
          <VBtn icon dark @click="dialog = false">
            <VIcon>mdi-close</VIcon>
          </VBtn>
          <VToolbarTitle>Mass edit {{ tracks.length }} tracks</VToolbarTitle>
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
                    :disabled="!number.enabled"
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
                    :disabled="!titleReplacement.enabled"
                  />
                </VFlex>
              </VLayout>
              <VLayout>
                <VFlex xs12 sm6>
                  <VTextField
                    label="Search"
                    v-model="titleReplacement.search"
                    :disabled="!titleReplacement.enabled"
                  />
                </VFlex>
                <VFlex xs12 sm6>
                  <VTextField
                    label="Replace"
                    v-model="titleReplacement.replace"
                    :disabled="!titleReplacement.enabled"
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
                    :disabled="!album.enabled"
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
                    v-model="changeGenres.add"
                    label="Add genres instead of replacing"
                    :disabled="!changeGenres.enabled"
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
                    :disabled="!changeGenres.enabled"
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
                    v-model="changeArtists.add"
                    label="Add artists instead of replacing"
                    :disabled="!changeArtists.enabled"
                  />
                </VFlex>
              </VLayout>
              <VLayout
                :key="index"
                row
                v-for="(item, index) of changeArtists.track_artists"
              >
                <VLayout column class="no-grow">
                  <VBtn
                    @click="moveArtist(index, -1)"
                    icon
                    small
                    :disabled="index === 0 || !changeArtists.enabled"
                  >
                    <VIcon>mdi-menu-up</VIcon>
                  </VBtn>
                  <VBtn
                    @click="moveArtist(index, 1)"
                    icon
                    small
                    :disabled="
                      index === changeArtists.track_artists.length - 1 ||
                        !changeArtists.enabled
                    "
                  >
                    <VIcon>mdi-menu-down</VIcon>
                  </VBtn>
                  <VBtn
                    @click="removeArtist(index)"
                    icon
                    small
                    :disabled="!changeArtists.enabled"
                  >
                    <VIcon>mdi-close</VIcon>
                  </VBtn>
                </VLayout>
                <VLayout column>
                  <VCombobox
                    :items="sortedArtists"
                    item-text="name"
                    item-value="id"
                    label="Artist"
                    return-object
                    v-model="item.artist_id"
                    :disabled="!changeArtists.enabled"
                  />
                  <VTextField
                    label="Name"
                    v-model="item.name"
                    :disabled="!changeArtists.enabled"
                  />
                  <VAutocomplete
                    :items="roles"
                    label="Role"
                    v-model="item.role"
                    :disabled="!changeArtists.enabled"
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
                :disabled="!changeArtists.enabled"
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

export default {
  name: "MassEditDialog",
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
        add: false,
        track_artists: []
      },
      changeGenres: {
        enabled: false,
        add: false,
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
                if (this.changeArtists.add) {
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
                } else {
                  transformed.track_artists = transformedArtists;
                }
              }

              if (this.changeGenres.enabled) {
                if (this.changeGenres.add) {
                  transformedGenres.forEach(g => {
                    if (!transformed.genre_ids.includes(g)) {
                      transformed.genre_ids.push(g);
                    }
                  });
                } else {
                  transformed.genre_ids = transformedGenres;
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
          this.saving = false;
          this.dialog = false;
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
    }
  }
};
</script>

<style scoped></style>
