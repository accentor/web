<template>
  <VContainer fill-height fluid v-if="track">
    <VLayout align-center justify-center>
      <VFlex md6 sm8 xs12>
        <VForm @submit.prevent="submit">
          <VTextField label="Title" v-model="newTrack.title" />
          <VAutocomplete
            :items="sortedAlbums"
            item-text="title"
            item-value="id"
            label="Album"
            v-model="newTrack.album_id"
          />
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
            v-model="newTrack.genre_ids"
          />
          <h4>Artists</h4>
          <VLayout
            :key="index"
            row
            v-for="(item, index) of newTrack.track_artists"
          >
            <VBtn @click="removeArtist(index)" icon small>
              <VIcon>mdi-close</VIcon>
            </VBtn>
            <VLayout column>
              <VCombobox
                :items="sortedArtists"
                item-text="name"
                item-value="id"
                label="Artist"
                return-object
                v-model="item.artist_id"
              />
              <VTextField label="Name" v-model="item.name" />
              <VAutocomplete :items="roles" label="Role" v-model="item.role" />
              <VDivider v-if="index !== newTrack.track_artists.length - 1" />
            </VLayout>
          </VLayout>
          <VLayout row>
            <VBtn color="primary" type="submit">Update track</VBtn>
            <VSpacer />
            <VBtn @click="addArtist" color="success">Add artist</VBtn>
          </VLayout>
        </VForm>
      </VFlex>
    </VLayout>
  </VContainer>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";

export default {
  name: "EditTrack",
  data() {
    return {
      newTrack: {
        title: "",
        album_id: null,
        track_artists: [],
        genre_ids: []
      },
      roles: [
        {
          value: "main",
          text: "Main"
        },
        {
          value: "guest",
          text: "Guest"
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
        }
      ]
    };
  },
  created() {
    setTimeout(() => {
      if (this.track) {
        this.fillValues();
      }
    });
  },
  watch: {
    track: function() {
      if (this.track) {
        this.fillValues();
      }
    }
  },
  computed: {
    ...mapState("albums", ["albums"]),
    ...mapState("artists", ["artists"]),
    ...mapState("genres", ["genres"]),
    ...mapState("tracks", ["tracks"]),
    ...mapGetters("albums", {
      sortedAlbums: "albumsByTitle"
    }),
    ...mapGetters("artists", {
      sortedArtists: "artistsByName"
    }),
    ...mapGetters("genres", {
      sortedGenres: "genresByName"
    }),
    track: function() {
      return this.tracks[this.$route.params.id];
    }
  },
  methods: {
    ...mapActions("tracks", ["update"]),
    ...mapActions({
      createArtist: "artists/create",
      createGenre: "genres/create"
    }),
    fillValues() {
      this.newTrack.title = this.track.title;
      this.newTrack.album_id = this.track.album_id;
      this.newTrack.track_artists = this.track.track_artists.map(ta => {
        return {
          artist_id: this.artists[ta.artist_id],
          name: ta.name,
          role: ta.role
        };
      });
      this.newTrack.genre_ids = this.track.genre_ids.map(id => this.genres[id]);
    },
    addArtist() {
      this.newTrack.track_artists.push({
        artist_id: null,
        name: "",
        role: "main"
      });
    },
    removeArtist(index) {
      this.newTrack.track_artists.splice(index, 1);
    },
    submit() {
      const transformed = {
        title: this.newTrack.title,
        album_id: this.newTrack.album_id,
        genre_ids: [],
        track_artists: []
      };
      const promises = [];

      for (let genre_id of this.newTrack.genre_ids) {
        if (typeof genre_id === "string") {
          promises.push(
            this.createGenre({ name: genre_id }).then(id => {
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

      for (let ta of this.newTrack.track_artists) {
        if (typeof ta.artist_id === "string") {
          promises.push(
            this.createArtist({ name: ta.artist_id }).then(id => {
              if (id) {
                transformed.track_artists.push({
                  artist_id: id,
                  name: ta.name,
                  role: ta.role
                });
              } else {
                return Promise.reject();
              }
            })
          );
        } else {
          transformed.track_artists.push({
            artist_id: ta.artist_id.id,
            name: ta.name,
            role: ta.role
          });
        }
      }

      Promise.all(promises).then(() => {
        this.update({ id: this.track.id, newTrack: transformed }).then(
          succeeded => {
            if (succeeded) {
              this.$router.push({ name: "tracks" });
            }
          }
        );
      });
    }
  }
};
</script>
