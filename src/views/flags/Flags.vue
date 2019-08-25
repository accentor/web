<template>
  <div>
    <VContainer fluid grid-list-xl>
      <VLayout>
        <VFlex>
          <h2 class="display-1">{{ $tc("music.artists", 2) }}</h2>
        </VFlex>
      </VLayout>
      <VDataIterator
        :footer-props="{ disableItemsPerPage: true, itemsPerPageOptions: [6] }"
        :items="artists"
        :items-per-page="6"
      >
        <template v-slot:default="props">
          <VLayout wrap>
            <VFlex
              v-for="item in props.items"
              :key="item.name"
              lg3
              md4
              sm6
              xl2
              xs12
            >
              <ArtistCard :artist="item" />
            </VFlex>
          </VLayout>
        </template>
      </VDataIterator>
    </VContainer>
    <VContainer fluid grid-list-xl>
      <VLayout>
        <VFlex>
          <h2 class="display-1">{{ $tc("music.albums", 2) }}</h2>
        </VFlex>
      </VLayout>
      <VDataIterator
        :footer-props="{ disableItemsPerPage: true, itemsPerPageOptions: [6] }"
        :items="albums"
        :items-per-page="6"
      >
        <template v-slot:default="props">
          <VLayout wrap>
            <VFlex
              v-for="item in props.items"
              :key="item.name"
              lg3
              md4
              sm6
              xl2
              xs12
            >
              <AlbumCard :album="item" />
            </VFlex>
          </VLayout>
        </template>
      </VDataIterator>
    </VContainer>
    <VContainer fill-height fluid>
      <VLayout column>
        <VLayout>
          <VFlex>
            <h2 class="display-1">{{ $tc("music.tracks", 2) }}</h2>
          </VFlex>
        </VLayout>
        <VLayout>
          <VFlex>
            <TracksTable
              :tracks="tracks"
              :save-pagination="false"
              :save-search="false"
              :show-mass-edit="false"
            />
          </VFlex>
        </VLayout>
      </VLayout>
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
