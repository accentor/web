<template>
  <div>
    <VContainer fluid>
      <VDataIterator
        :items="releaseAlbums"
        :items-per-page="numberOfItems"
        :page="releasePage"
      >
        <template #header>
          <h2 class="text-h4">{{ $t("home.recently-released") }}</h2>
        </template>
        <template #default="props">
          <VRow class="my-0">
            <VCol
              v-for="item in props.items"
              :key="item.raw.id"
              lg="3"
              md="4"
              sm="6"
              xl="2"
              cols="6"
            >
              <AlbumCard :album="item.raw" />
            </VCol>
          </VRow>
        </template>
        <template #footer="{ pageCount }">
          <VPagination v-model="releasePage" :length="pageCount" total-visible="5" />
        </template>
      </VDataIterator>
    </VContainer>
    <VContainer fluid>
      <VDataIterator
        :items="addedAlbums"
        :page="addedAlbumsPage"
        :items-per-page="numberOfItems"
      >
        <template #header>
          <h2 class="text-h4">
            {{ $t("home.recently-added-albums") }}
          </h2>
        </template>
        <template #default="props">
          <VRow class="my-0">
            <VCol
              v-for="item in props.items"
              :key="item.raw.id"
              lg="3"
              md="4"
              sm="6"
              xl="2"
              cols="6"
            >
              <AlbumCard :album="item.raw" />
            </VCol>
          </VRow>
        </template>
        <template #footer="{ pageCount }">
          <VPagination v-model="addedAlbumsPage" :length="pageCount" total-visible="5" />
        </template>
      </VDataIterator>
    </VContainer>
    <VContainer fluid>
      <VDataIterator
        :items="addedArtists"
        :items-per-page="numberOfItems"
        :page="addedArtistsPage"
      >
        <template #header>
          <h2 class="text-h4">
            {{ $t("home.recently-added-artists") }}
          </h2>
        </template>
        <template #default="props">
          <VRow class="my-0">
            <VCol
              v-for="item in props.items"
              :key="item.raw.id"
              lg="3"
              md="4"
              sm="6"
              xl="2"
              cols="6"
            >
              <ArtistCard :artist="item.raw" />
            </VCol>
          </VRow>
        </template>
        <template #footer="{ pageCount }">
          <VPagination v-model="addedArtistsPage" :length="pageCount" total-visible="5" />
        </template>
      </VDataIterator>
    </VContainer>
    <VContainer fluid>
      <VDataIterator
        :items="albumsOnThisDay"
        :items-per-page="numberOfItems"
        :page="onThisDayPage"
      >
        <template #header>
          <h2 class="text-h4">{{ $t("home.on-this-day") }}</h2>
        </template>
        <template #no-data>
          <VAlert :value="true" color="info" icon="mdi-information">
            {{ $t("home.on-this-day-empty") }}
          </VAlert>
        </template>
        <template #default="props">
          <VRow class="my-0">
            <VCol
              v-for="item in props.items"
              :key="item.raw.id"
              lg="3"
              md="4"
              sm="6"
              xl="2"
              cols="6"
            >
              <AlbumCard :album="item.raw" />
            </VCol>
          </VRow>
        </template>
        <template #footer="{ pageCount }">
          <VPagination v-model="onThisDayPage" :length="pageCount" total-visible="5" />
        </template>
      </VDataIterator>
    </VContainer>

    <VContainer fluid>
      <VDataIterator
        :items="randomAlbums"
        :items-per-page="numberOfItems"
        :page="randomAlbumsPage"
      >
        <template #header>
          <h2 class="text-h4">
            {{ $t("home.random-albums") }}
          </h2>
        </template>
        <template #default="props">
          <VRow class="my-0">
            <VCol
              v-for="item in props.items"
              :key="item.raw.id"
              lg="3"
              md="4"
              sm="6"
              xl="2"
              cols="6"
            >
              <AlbumCard :album="item.raw" />
            </VCol>
          </VRow>
        </template>
        <template #footer="{ pageCount }">
          <VPagination v-model="randomAlbumsPage" :length="pageCount"  total-visible="5"/>
        </template>
      </VDataIterator>
    </VContainer>
    <VContainer fluid>
      <VDataIterator
        :items="randomArtists"
        :items-per-page="numberOfItems"
        :page="randomArtistsPage"
      >
        <template #header>
          <h2 class="text-h4">
            {{ $t("home.random-artists") }}
          </h2>
        </template>
        <template #default="props">
          <VRow class="my-0">
            <VCol
              v-for="item in props.items"
              :key="item.raw.id"
              lg="3"
              md="4"
              sm="6"
              xl="2"
              cols="6"
            >
              <ArtistCard :artist="item.raw" />
            </VCol>
          </VRow>
        </template>
        <template #footer="{ pageCount }">
          <VPagination v-model="randomArtistsPage" :length="pageCount" total-visible="5" />
        </template>
      </VDataIterator>
    </VContainer>
    <VContainer fluid>
      <VDataIterator
        :items="recentAlbums"
        :items-per-page="numberOfItems"
        :page="recentAlbumsPage"
      >
        <template #header>
          <h2 class="text-h4">
            {{ $t("home.recently-played-albums") }}
          </h2>
        </template>
        <template #default="props">
          <VRow class="my-0">
            <VCol
              v-for="item in props.items"
              :key="item.raw.id"
              lg="3"
              md="4"
              sm="6"
              xl="2"
              cols="6"
            >
              <AlbumCard :album="item.raw" />
            </VCol>
          </VRow>
        </template>
        <template #footer="{ pageCount }">
          <VPagination v-model="recentAlbumsPage" :length="pageCount" total-visible="5" />
        </template>
      </VDataIterator>
    </VContainer>
    <VContainer fluid>
      <VDataIterator
        :items="recentArtists"
        :items-per-page="numberOfItems"
        :page="recentArtistsPage"
      >
        <template #header>
          <h2 class="text-h4">
            {{ $t("home.recently-played-artists") }}
          </h2>
        </template>
        <template #default="props">
          <VRow class="my-0">
            <VCol
              v-for="item in props.items"
              :key="item.raw.id"
              lg="3"
              md="4"
              sm="6"
              xl="2"
              cols="6"
            >
              <ArtistCard :artist="item.raw" />
            </VCol>
          </VRow>
        </template>
        <template #footer="{ pageCount }">
          <VPagination v-model="recentArtistsPage" :length="pageCount" total-visible="5" />
        </template>
      </VDataIterator>
    </VContainer>
  </div>
</template>

<script>
import AlbumCard from "../components/AlbumCard.vue";
import ArtistCard from "../components/ArtistCard.vue";
import {
  compareAlbumsByReleaseFirst,
  compareByRecentlyPlayed,
  compareStrings,
} from "../comparators";
import { mapState } from "pinia";
import { useArtistsStore } from "../store/artists";
import { useAlbumsStore } from "../store/albums";
import { usePlaysStore } from "../store/plays";

const RANDOM_SEED_MAX = 10000;

export default {
  name: "Home",
  components: { AlbumCard, ArtistCard },
  data() {
    return {
      addedAlbumsPage: 1,
      addedArtistsPage: 1,
      onThisDayPage: 1,
      randomAlbumsPage: 1,
      randomArtistsPage: 1,
      recentAlbumsPage: 1,
      recentArtistsPage: 1,
      releasePage: 1,
    };
  },
  head() {
    return { title: this.$t("common.home") };
  },
  computed: {
    ...mapState(useAlbumsStore, {
      albums: "allAlbums",
      albumsOnThisDay: "albumsOnThisDay",
    }),
    ...mapState(useArtistsStore, { artists: "allArtists" }),
    ...mapState(usePlaysStore, ["playStatsByAlbum", "playStatsByArtist"]),
    addedAlbums() {
      return [...this.albums].sort((a1, a2) => {
        return compareStrings(a2.created_at, a1.created_at);
      });
    },
    addedArtists() {
      return [...this.artists].sort((a1, a2) => {
        return compareStrings(a2.created_at, a1.created_at);
      });
    },
    randomSeed() {
      return Math.round(Math.random() * RANDOM_SEED_MAX);
    },
    randomAlbums() {
      return this.randomSort(this.albums);
    },
    recentAlbums() {
      return [...this.albums].sort(
        compareByRecentlyPlayed(this.playStatsByAlbum),
      );
    },
    recentArtists() {
      return [...this.artists].sort(
        compareByRecentlyPlayed(this.playStatsByArtist),
      );
    },
    releaseAlbums() {
      return [...this.albums].sort(compareAlbumsByReleaseFirst(true));
    },
    randomArtists() {
      return this.randomSort(this.artists);
    },
    numberOfItems() {
      if (this.$vuetify.display.xl) {
        return 6;
      } else if (this.$vuetify.display.md) {
        return 3;
      } else {
        return 4;
      }
    },
  },
  methods: {
    randomSort(items) {
      return [...items].sort(
        (i1, i2) =>
          Math.sin(i2.id + this.randomSeed) - Math.sin(i1.id + this.randomSeed),
      );
    },
  },
};
</script>
