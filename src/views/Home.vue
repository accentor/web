<template>
  <div>
    <VContainer fluid grid-list-xl>
      <VDataIterator
        :items="albums"
        :custom-sort="releaseSort"
        :rows-per-page-items="[numberOfItems]"
        content-class="layout row wrap"
      >
        <template v-slot:header>
          <h2>Recently released</h2>
        </template>
        <template v-slot:item="props">
          <VFlex lg3 md4 sm6 xl2 xs12>
            <AlbumCard :album="props.item" />
          </VFlex>
        </template>
      </VDataIterator>
    </VContainer>
    <VContainer fluid grid-list-xl>
      <VDataIterator
        :items="albums"
        :custom-sort="createdSort"
        :rows-per-page-items="[numberOfItems]"
        content-class="layout row wrap"
      >
        <template v-slot:header>
          <h2>Recently added albums</h2>
        </template>
        <template v-slot:item="props">
          <VFlex lg3 md4 sm6 xl2 xs12>
            <AlbumCard :album="props.item" />
          </VFlex>
        </template>
      </VDataIterator>
    </VContainer>
    <VContainer fluid grid-list-xl>
      <VDataIterator
        :items="artists"
        :custom-sort="createdSort"
        :rows-per-page-items="[numberOfItems]"
        content-class="layout row wrap"
      >
        <template v-slot:header>
          <h2>Recently added artists</h2>
        </template>
        <template v-slot:item="props">
          <VFlex lg3 md4 sm6 xl2 xs12>
            <ArtistCard :artist="props.item" />
          </VFlex>
        </template>
      </VDataIterator>
    </VContainer>
    <VContainer fluid grid-list-xl>
      <VDataIterator
        :items="albums"
        :custom-sort="randomSort"
        :rows-per-page-items="[numberOfItems]"
        content-class="layout row wrap"
      >
        <template v-slot:header>
          <h2>Random albums</h2>
        </template>
        <template v-slot:item="props">
          <VFlex lg3 md4 sm6 xl2 xs12>
            <AlbumCard :album="props.item" />
          </VFlex>
        </template>
      </VDataIterator>
    </VContainer>
    <VContainer fluid grid-list-xl>
      <VDataIterator
        :items="artists"
        :custom-sort="randomSort"
        :rows-per-page-items="[numberOfItems]"
        content-class="layout row wrap"
      >
        <template v-slot:header>
          <h2>Random artists</h2>
        </template>
        <template v-slot:item="props">
          <VFlex lg3 md4 sm6 xl2 xs12>
            <ArtistCard :artist="props.item" />
          </VFlex>
        </template>
      </VDataIterator>
    </VContainer>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import AlbumCard from "../components/AlbumCard";
import ArtistCard from "../components/ArtistCard";
import Paginated from "../mixins/Paginated";
import { compareStrings } from "../comparators";

export default {
  name: "home",
  components: { AlbumCard, ArtistCard },
  mixins: [Paginated],
  methods: {
    releaseSort(items) {
      items.sort((a1, a2) => {
        return compareStrings(a2.release, a1.release);
      });
      return items;
    },
    createdSort(items) {
      items.sort((a1, a2) => {
        return compareStrings(a2.created_at, a1.created_at);
      });
      return items;
    },
    randomSort(items) {
      for (let i = items.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [items[i], items[j]] = [items[j], items[i]];
      }
      return items;
    }
  },
  computed: {
    ...mapGetters({
      albums: "albums/albums",
      artists: "artists/artists"
    }),
    numberOfItems() {
      switch (this.$vuetify.breakpoint.name) {
        case "xl":
          return "6";
        case "md":
          return "3";
        default:
          return "4";
      }
    }
  }
};
</script>
