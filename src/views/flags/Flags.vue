<template>
  <div>
    <VContainer fluid grid-list-xl>
      <VLayout row>
        <VFlex>
          <h2>Artists</h2>
        </VFlex>
      </VLayout>
      <VDataIterator
        :items="artists"
        :rows-per-page-items="[6]"
        content-class="layout row wrap"
      >
        <template v-slot:item="props">
          <VFlex lg3 md4 sm6 xl2 xs12>
            <ArtistCard :artist="props.item" />
          </VFlex>
        </template>
      </VDataIterator>
    </VContainer>
    <VContainer fluid grid-list-xl>
      <VLayout row>
        <VFlex>
          <h2>Albums</h2>
        </VFlex>
      </VLayout>
      <VDataIterator
        :items="albums"
        :rows-per-page-items="[6]"
        content-class="layout row wrap"
      >
        <template v-slot:item="props">
          <VFlex lg3 md4 sm6 xl2 xs12>
            <AlbumCard :album="props.item" />
          </VFlex>
        </template>
      </VDataIterator>
    </VContainer>
    <VContainer fill-height fluid>
      <VLayout column>
        <VLayout row>
          <VFlex>
            <h2>Tracks</h2>
          </VFlex>
        </VLayout>
        <VLayout row>
          <VFlex>
            <TracksTable :tracks="tracks" />
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
