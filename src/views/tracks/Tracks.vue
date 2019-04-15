<template>
  <VContainer fill-height fluid>
    <VLayout row>
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
import { mapActions, mapGetters, mapState } from "vuex";
import TrackActions from "../albums/TrackActions";

export default {
  name: "Tracks",
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
    ...mapGetters("tracks", {
      tracks: "tracksByAlbumAndNumber"
    }),
    ...mapGetters("auth", ["isModerator"]),
    ...mapState("albums", ["albums"]),
    ...mapState("artists", ["artists"]),
    ...mapState("genres", ["genres"])
  },
  methods: {
    ...mapActions("tracks", ["destroy"]),
    deleteTrack: function(id) {
      if (confirm("Are you sure?")) {
        this.destroy(id);
      }
    }
  }
};
</script>
