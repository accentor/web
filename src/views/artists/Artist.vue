<template>
  <VContainer fluid grid-list-xl v-if="artist">
    <VLayout row wrap>
      <VFlex lg3 md4 sm6 v-if="artist.image" xs12>
        <VImg :src="artist.image" class="elevation-3" />
      </VFlex>
      <VFlex lg9 md8 sm6 xs12>
        <h3>{{ artist.name }}</h3>
      </VFlex>
    </VLayout>
    <VDataIterator
      :items="artistAlbums"
      :filter="(obj, search) => obj.title.contains(search)"
      :rows-per-page-items="[12]"
      v-if="artistAlbums.length > 0"
      content-class="layout row wrap"
    >
      <template v-slot:item="props">
        <VFlex lg3 md4 sm6 xl2 xs12>
          <VCard :to="{ name: 'album', params: { id: props.item.id } }">
            <VImg
              :aspect-ratio="1"
              :src="props.item.image"
              v-if="props.item.image"
            />
            <VCardTitle primary-title>
              <div>
                <div class="headline">{{ props.item.title }}</div>
                <span>
                  {{ props.item.albumartist }}
                </span>
              </div>
            </VCardTitle>
            <VCardText>
              <span class="grey--text">
                {{ props.item.release }}
              </span>
            </VCardText>
            <VCardActions v-if="isModerator">
              <VBtn
                @click.stop.prevent="deleteAlbum(props.item.id)"
                color="red"
                dark
                fab
                href="#"
                outline
                small
              >
                <VIcon>mdi-delete</VIcon>
              </VBtn>
              <VBtn
                :to="{ name: 'edit-album', params: { id: props.item.id } }"
                color="orange"
                dark
                fab
                outline
                small
              >
                <VIcon>mdi-pencil</VIcon>
              </VBtn>
            </VCardActions>
          </VCard>
        </VFlex>
      </template>
    </VDataIterator>
    <VLayout row wrap>
      <VFlex xs12>
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
            <td>{{ albums[props.item.album_id].title }}</td>
            <td>{{ props.item.track_artists.map(a => a.name).join(" / ") }}</td>
            <td>
              {{ props.item.genre_ids.map(id => genres[id].name).join(" / ") }}
            </td>
            <td class="text-xs-right">
              <TrackActions :track="props.item" />
            </td>
          </template>
        </VDataTable>
      </VFlex>
    </VLayout>
  </VContainer>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { compareStrings } from "../../comparators";
import TrackActions from "../../components/TrackActions";

export default {
  name: "Artist",
  components: {
    TrackActions
  },
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
          text: "Album",
          value: "album_id",
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
      return this.$store.getters["tracks/tracksFilterByArtist"](
        this.$route.params.id
      );
    },
    artist: function() {
      return this.artists[this.$route.params.id];
    },
    artistAlbums() {
      return [...new Set(this.tracks.map(t => t.album_id))]
        .map(id => this.albums[id])
        .sort((a1, a2) => {
          if (a1.release === a2.release) {
            return compareStrings(a1.title, a2.title);
          } else {
            return new Date(a1.release) - new Date(a2.release);
          }
        });
    }
  }
};
</script>
