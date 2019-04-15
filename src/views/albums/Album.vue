<template>
  <VContainer fluid grid-list-xl v-if="album">
    <VLayout row wrap>
      <VFlex lg3 md4 sm6 v-if="album.image" xs12>
        <VImg :src="album.image" />
      </VFlex>
      <VFlex lg9 md8 sm6 xs12>
        <div>
          <div class="headline">{{ album.title }}</div>
          <div>
            {{ album.albumartist }}
          </div>
          <div class="grey--text">
            {{ album.release }}
          </div>
        </div>
      </VFlex>
      <VFlex>
        <VDataTable
          :headers="headers"
          :items="tracks"
          :rows-per-page-items="[30]"
          class="elevation-3"
        >
          <template v-slot:items="props">
            <td>{{ props.item.number }}</td>
            <td>{{ props.item.title }}</td>
            <td>
              {{ props.item.length | length }}
            </td>
            <td>{{ props.item.track_artists.map(a => a.name).join(" / ") }}</td>
            <td>
              {{ props.item.genre_ids.map(id => genres[id].name).join(" / ") }}
            </td>
            <td class="text-xs-right">
              <VBtn
                @click="startTrack(props.item.id)"
                color="primary"
                dark
                fab
                outline
                small
              >
                <VIcon>mdi-play</VIcon>
              </VBtn>
              <span v-if="isModerator">
                <VBtn
                  :to="{ name: 'edit-track', params: { id: props.item.id } }"
                  color="orange"
                  dark
                  fab
                  outline
                  small
                >
                  <VIcon>mdi-pencil</VIcon>
                </VBtn>
                <VBtn
                  @click.stop.prevent="deleteTrack(props.item.id)"
                  color="red"
                  dark
                  fab
                  href="#"
                  outline
                  small
                >
                  <VIcon>mdi-delete</VIcon>
                </VBtn>
              </span>
            </td>
          </template>
        </VDataTable>
      </VFlex>
    </VLayout>
  </VContainer>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";

export default {
  name: "Album",
  data() {
    return {
      headers: [
        {
          text: "#",
          value: "number",
          sortable: false
        },
        {
          text: "Title",
          value: "title",
          sortable: false
        },
        {
          text: "Length",
          value: "length",
          sortable: false
        },
        {
          text: "Artist(s)",
          value: "track_artists",
          sortable: false
        },
        {
          text: "Genre(s)",
          value: "genre_ids",
          sortable: false
        },
        {
          text: "Actions",
          sortable: false,
          align: "right"
        }
      ]
    };
  },
  computed: {
    ...mapGetters("auth", ["isModerator"]),
    ...mapState("albums", ["albums"]),
    ...mapState("artists", ["artists"]),
    ...mapState("genres", ["genres"]),
    tracks: function() {
      return this.$store.getters["tracks/tracksFilterByAlbum"](
        this.$route.params.id
      );
    },
    album: function() {
      return this.albums[this.$route.params.id];
    }
  },
  methods: {
    ...mapActions("tracks", ["destroy"]),
    deleteTrack: function(id) {
      if (confirm("Are you sure?")) {
        this.destroy(id);
      }
    },
    startTrack: function(id) {
      this.$store.commit("player/playTrack", id);
    }
  }
};
</script>
