<template>
  <VDataTable
    :headers="headers"
    :items="tracks"
    :rows-per-page-items="[30]"
    :pagination.sync="pagination"
    class="elevation-3"
  >
    <template v-slot:items="props">
      <td>{{ props.item.number }}</td>
      <td>{{ props.item.title }}</td>
      <td>
        {{ props.item.length | length }}
      </td>
      <td v-if="showAlbum">
        <RouterLink
          :to="{ name: 'album', params: { id: props.item.album_id } }"
        >
          {{ albums[props.item.album_id].title }}
        </RouterLink>
      </td>
      <td>
        {{
          props.item.track_artists
            .map(a => a)
            .sort((a1, a2) => a1.order - a2.order)
            .map(a => a.name)
            .join(" / ")
        }}
      </td>
      <td>
        {{ props.item.genre_ids.map(id => genres[id].name).join(" / ") }}
      </td>
      <td class="text-xs-right">
        <TrackActions :track="props.item" />
      </td>
    </template>
  </VDataTable>
</template>

<script>
import TrackActions from "./TrackActions";
import Paginated from "../mixins/Paginated";
import { mapState } from "vuex";

export default {
  name: "TracksTable",
  components: { TrackActions },
  mixins: [Paginated],
  props: {
    tracks: { default: () => [], type: Array },
    showAlbum: { default: true, type: Boolean },
    savePagination: { default: true, type: Boolean }
  },
  data() {
    const headers = [
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
    ];
    if (!this.showAlbum) {
      headers.splice(3, 1);
    }
    return { headers };
  },
  computed: {
    ...mapState("albums", ["albums"]),
    ...mapState("artists", ["artists"]),
    ...mapState("genres", ["genres"])
  }
};
</script>

<style scoped>
a {
  text-decoration: none;
}
</style>
