<template>
  <div>
    <VContainer fluid>
      <VDataIterator
        :footer-props="{
          disableItemsPerPage: true,
          itemsPerPageOptions: [numberOfItems],
        }"
        :items="albums"
        :custom-sort="releaseSort"
        :items-per-page="numberOfItems"
      >
        <template v-slot:header>
          <h2 class="text-h4">{{ $t("home.recently-released") }}</h2>
        </template>
        <template v-slot:default="props">
          <VRow class="my-0">
            <VCol
              v-for="item in props.items"
              :key="item.id"
              lg="3"
              md="4"
              sm="6"
              xl="2"
              cols="6"
            >
              <AlbumCard :album="item" />
            </VCol>
          </VRow>
        </template>
      </VDataIterator>
    </VContainer>
    <VContainer fluid>
      <VDataIterator
        :footer-props="{
          disableItemsPerPage: true,
          itemsPerPageOptions: [numberOfItems],
        }"
        :items="albums"
        :custom-sort="createdSort"
        :items-per-page="numberOfItems"
      >
        <template v-slot:header>
          <h2 class="text-h4">
            {{ $t("home.recently-added-albums") }}
          </h2>
        </template>
        <template v-slot:default="props">
          <VRow class="my-0">
            <VCol
              v-for="item in props.items"
              :key="item.id"
              lg="3"
              md="4"
              sm="6"
              xl="2"
              cols="6"
            >
              <AlbumCard :album="item" />
            </VCol>
          </VRow>
        </template>
      </VDataIterator>
    </VContainer>
    <VContainer fluid>
      <VDataIterator
        :footer-props="{
          disableItemsPerPage: true,
          itemsPerPageOptions: [numberOfItems],
        }"
        :items="artists"
        :custom-sort="createdSort"
        :items-per-page="numberOfItems"
      >
        <template v-slot:header>
          <h2 class="text-h4">
            {{ $t("home.recently-added-artists") }}
          </h2>
        </template>
        <template v-slot:default="props">
          <VRow class="my-0">
            <VCol
              v-for="item in props.items"
              :key="item.id"
              lg="3"
              md="4"
              sm="6"
              xl="2"
              cols="6"
            >
              <ArtistCard :artist="item" />
            </VCol>
          </VRow>
        </template>
      </VDataIterator>
    </VContainer>
    <VContainer fluid>
      <VDataIterator
        :footer-props="{
          disableItemsPerPage: true,
          itemsPerPageOptions: [numberOfItems],
        }"
        :items="albumsOnThisDay"
        :custom-sort="releaseSort"
        :items-per-page="numberOfItems"
      >
        <template v-slot:header>
          <h2 class="text-h4">{{ $t("home.on-this-day") }}</h2>
        </template>
        <template v-slot:no-data>
          <v-alert :value="true" color="info" icon="mdi-information" dark>
            {{ $t("home.on-this-day-empty") }}
          </v-alert>
        </template>
        <template v-slot:default="props">
          <VRow class="my-0">
            <VCol
              v-for="item in props.items"
              :key="item.id"
              lg="3"
              md="4"
              sm="6"
              xl="2"
              cols="6"
            >
              <AlbumCard :album="item" />
            </VCol>
          </VRow>
        </template>
      </VDataIterator>
    </VContainer>

    <VContainer fluid>
      <VDataIterator
        :footer-props="{
          disableItemsPerPage: true,
          itemsPerPageOptions: [numberOfItems],
        }"
        :items="randomAlbums"
        :items-per-page="numberOfItems"
      >
        <template v-slot:header>
          <h2 class="text-h4">
            {{ $t("home.random-albums") }}
          </h2>
        </template>
        <template v-slot:default="props">
          <VRow class="my-0">
            <VCol
              v-for="item in props.items"
              :key="item.id"
              lg="3"
              md="4"
              sm="6"
              xl="2"
              cols="6"
            >
              <AlbumCard :album="item" />
            </VCol>
          </VRow>
        </template>
      </VDataIterator>
    </VContainer>
    <VContainer fluid>
      <VDataIterator
        :footer-props="{
          disableItemsPerPage: true,
          itemsPerPageOptions: [numberOfItems],
        }"
        :items="randomArtists"
        :items-per-page="numberOfItems"
      >
        <template v-slot:header>
          <h2 class="text-h4">
            {{ $t("home.random-artists") }}
          </h2>
        </template>
        <template v-slot:default="props">
          <VRow class="my-0">
            <VCol
              v-for="item in props.items"
              :key="item.id"
              lg="3"
              md="4"
              sm="6"
              xl="2"
              cols="6"
            >
              <ArtistCard :artist="item" />
            </VCol>
          </VRow>
        </template>
      </VDataIterator>
    </VContainer>
    <VContainer fluid>
      <VDataIterator
        :footer-props="{
          disableItemsPerPage: true,
          itemsPerPageOptions: [numberOfItems],
        }"
        :items="albums"
        :custom-sort="recentlyPlayedAlbumsSort"
        :items-per-page="numberOfItems"
      >
        <template v-slot:header>
          <h2 class="text-h4">
            {{ $t("home.recently-played-albums") }}
          </h2>
        </template>
        <template v-slot:default="props">
          <VRow class="my-0">
            <VCol
              v-for="item in props.items"
              :key="item.id"
              lg="3"
              md="4"
              sm="6"
              xl="2"
              cols="6"
            >
              <AlbumCard :album="item" />
            </VCol>
          </VRow>
        </template>
      </VDataIterator>
    </VContainer>
    <VContainer fluid>
      <VDataIterator
        :footer-props="{
          disableItemsPerPage: true,
          itemsPerPageOptions: [numberOfItems],
        }"
        :items="artists"
        :custom-sort="recentlyPlayedArtistsSort"
        :items-per-page="numberOfItems"
      >
        <template v-slot:header>
          <h2 class="text-h4">
            {{ $t("home.recently-played-artists") }}
          </h2>
        </template>
        <template v-slot:default="props">
          <VRow class="my-0">
            <VCol
              v-for="item in props.items"
              :key="item.id"
              lg="3"
              md="4"
              sm="6"
              xl="2"
              cols="6"
            >
              <ArtistCard :artist="item" />
            </VCol>
          </VRow>
        </template>
      </VDataIterator>
    </VContainer>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import AlbumCard from "../components/AlbumCard";
import ArtistCard from "../components/ArtistCard";
import {
  compareAlbumsByReleaseFirst,
  compareByRecentlyPlayed,
  compareStrings,
} from "../comparators";

const RANDOM_SEED_MAX = 10_000;

export default {
  name: "Home",
  components: { AlbumCard, ArtistCard },
  metaInfo() {
    return { title: this.$t("common.home") };
  },
  methods: {
    releaseSort(items) {
      return items.sort(compareAlbumsByReleaseFirst(true));
    },
    createdSort(items) {
      items.sort((a1, a2) => {
        return compareStrings(a2.created_at, a1.created_at);
      });
      return items;
    },
    recentlyPlayedAlbumsSort(albums) {
      return albums.sort(compareByRecentlyPlayed(this.playStatsByAlbum));
    },
    recentlyPlayedArtistsSort(artists) {
      return artists.sort(compareByRecentlyPlayed(this.playStatsByArtist));
    },
    randomSort(items) {
      return [...items].sort(
        (i1, i2) =>
          Math.sin(i2.id + this.randomSeed) - Math.sin(i1.id + this.randomSeed),
      );
    },
  },
  computed: {
    ...mapGetters({
      albums: "albums/albums",
      albumsOnThisDay: "albums/albumsOnThisDay",
      artists: "artists/artists",
      playStatsByAlbum: "plays/playStatsByAlbum",
      playStatsByArtist: "plays/playStatsByArtist",
    }),
    randomSeed() {
      return Math.round(Math.random() * RANDOM_SEED_MAX);
    },
    randomAlbums() {
      return this.randomSort(this.albums);
    },
    randomArtists() {
      return this.randomSort(this.artists);
    },
    numberOfItems() {
      if (this.$vuetify.breakpoint.name === "xl") {
        return 6;
      } else if (this.$vuetify.breakpoint.name === "md") {
        return 3;
      } else {
        return 4;
      }
    },
  },
};
</script>
