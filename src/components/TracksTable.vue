<template>
  <div>
    <VLayout justify-end align-baseline row wrap mb-2>
      <VFlex v-if="showSearch" xs12 sm8 md6 lg4 xl2>
        <VTextField
          v-if="tracks.length > 30"
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></VTextField>
      </VFlex>
    </VLayout>
    <VDataTable
      :headers="headers"
      :search="search"
      :custom-filter="customFilter"
      :filter="filter"
      :items="tracks"
      :rows-per-page-items="[30]"
      :pagination.sync="pagination"
      class="elevation-3"
      ref="table"
    >
      <template v-slot:actions-prepend>
        <MassEditDialog :tracks="filteredItems" />
      </template>
      <template v-slot:items="props">
        <td>{{ props.item.number }}</td>
        <td>{{ props.item.title }}</td>
        <td class="text-xs-right">
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
          <TrackArtists :track="props.item" />
        </td>
        <td>
          <TrackGenres :track="props.item" />
        </td>
        <td class="text-xs-right">
          <TrackActions :track="props.item" />
        </td>
      </template>
    </VDataTable>
  </div>
</template>

<script>
import TrackActions from "./TrackActions";
import Paginated from "../mixins/Paginated";
import { mapState } from "vuex";
import Searchable from "../mixins/Searchable";
import TrackArtists from "./TrackArtists";
import TrackGenres from "./TrackGenres";
import MassEditDialog from "./MassEditDialog";

export default {
  name: "TracksTable",
  components: { TrackGenres, TrackActions, TrackArtists, MassEditDialog },
  mixins: [Paginated, Searchable],
  props: {
    tracks: { default: () => [], type: Array },
    showAlbum: { default: true, type: Boolean },
    showSearch: { default: false, type: Boolean },
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
        sortable: false,
        align: "right"
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
    return {
      headers,
      customFilter(items, search, filter) {
        search = search ? search.toString().toLowerCase() : "";
        if (search.trim() === "") return items;

        return items.filter(val => filter(val.title, search));
      },
      filter(title, search) {
        return title.toLowerCase().indexOf(search) !== -1;
      }
    };
  },
  computed: {
    ...mapState("albums", ["albums"]),
    filteredItems() {
      return this.customFilter(this.tracks, this.search, this.filter);
    }
  }
};
</script>
