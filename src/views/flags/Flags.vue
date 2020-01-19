<template>
  <div>
    <VContainer fluid>
      <VRow>
        <VCol>
          <h2 class="display-1">{{ $tc("music.artists", 2) }}</h2>
        </VCol>
      </VRow>
      <VDataIterator
        :footer-props="{ disableItemsPerPage: true, itemsPerPageOptions: [6] }"
        :items="artists"
        :items-per-page="6"
      >
        <template v-slot:default="props">
          <VRow>
            <VCol
              v-for="item in props.items"
              :key="item.name"
              lg="3"
              md="4"
              sm="6"
              xl="2"
              cols="12"
            >
              <ArtistCard :artist="item" />
            </VCol>
          </VRow>
        </template>
      </VDataIterator>
    </VContainer>
    <VContainer fluid>
      <VRow>
        <VCol>
          <h2 class="display-1">{{ $tc("music.albums", 2) }}</h2>
        </VCol>
      </VRow>
      <VDataIterator
        :footer-props="{ disableItemsPerPage: true, itemsPerPageOptions: [6] }"
        :items="albums"
        :items-per-page="6"
      >
        <template v-slot:default="props">
          <VRow>
            <VCol
              v-for="item in props.items"
              :key="item.name"
              lg="3"
              md="4"
              sm="6"
              xl="2"
              cols="12"
            >
              <AlbumCard :album="item" />
            </VCol>
          </VRow>
        </template>
      </VDataIterator>
    </VContainer>
    <VContainer class="fill-height" fluid>
      <VRow class="flex-column">
        <VRow>
          <VCol>
            <h2 class="display-1">{{ $tc("music.tracks", 2) }}</h2>
          </VCol>
        </VRow>
        <VRow>
          <VCol>
            <TracksTable
              :tracks="tracks"
              :save-pagination="false"
              :save-search="false"
              :show-mass-edit="false"
            />
          </VCol>
        </VRow>
      </VRow>
    </VContainer>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import TracksTable from "../../components/TracksTable";
import ArtistCard from "../../components/ArtistCard";
import AlbumCard from "../../components/AlbumCard";

export default {
  name: "Flags",
  components: { AlbumCard, ArtistCard, TracksTable },
  computed: {
    ...mapGetters({
      albums: "albums/albumsFlagged",
      artists: "artists/artistsFlagged",
      tracks: "tracks/tracksFlagged"
    })
  }
};
</script>
