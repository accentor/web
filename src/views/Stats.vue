<template>
  <VContainer>
    <VRow>
      <VCol>
        <h1 class="text-h4">{{ pageTitle }}</h1>
        <p class="text-subtitle-1">{{ pageSubtitle }}</p>
      </VCol>
      <VCol class="d-flex justify-end">
        <VSwitch
          v-model="useTrackLength"
          :label="I18n.t('stats.useTrackLength')"
          class="mr-4"
        />
        <DateRangeSelect @input="(e) => (period = e)" />
      </VCol>
    </VRow>
    <div class="stats">
      <PlayCountCard
        :play-stats="playStats"
        title=""
        class="stats__play-count"
      />
      <TopTracksList
        class="stats__top-tracks"
        :play-stats="playStats"
        :use-track-length="useTrackLength"
        :title="I18n.t('stats.topTracks')"
      />
      <PercentagePlayedCard
        class="stats__percentage-played"
        :play-stats="playStats"
        :use-track-length="useTrackLength"
        :tracks="filteredTracks"
        :title="
          artistId
            ? I18n.t('stats.percentageArtistPlayed', { artist: artistName })
            : I18n.t('stats.percentageLibraryPlayed')
        "
      />
      <TopAlbumsList
        class="stats__top-albums"
        :play-stats="playStats"
        :use-track-length="useTrackLength"
        :title="I18n.t('stats.topAlbums')"
      />
      <TopArtistsList
        class="stats__top-artists"
        :play-stats="playStats"
        :use-track-length="useTrackLength"
        :title="I18n.t('stats.topArtists')"
      />
      <PlaysPunchcard
        class="stats__punchcard"
        :plays="filteredPlays"
        :use-track-length="useTrackLength"
        :title="I18n.t('stats.punchcard')"
      />
    </div>
  </VContainer>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useRoute, useRouter } from "vue-router";
import { useHead } from "@unhead/vue";
import {
  type Play,
  PlaysScope,
  type PlayStat,
  type Track,
} from "@accentor/api-client-js";
import DateRangeSelect from "@/components/DateRangeSelect.vue";
import PercentagePlayedCard from "@/components/PercentagePlayedCard.vue";
import PlayCountCard from "@/components/PlayCountCard.vue";
import PlaysPunchcard from "@/components/PlaysPunchcard.vue";
import TopArtistsList from "@/components/TopArtistsList.vue";
import TopTracksList from "@/components/TopTracksList.vue";
import TopAlbumsList from "@/components/TopAlbumsList.vue";
import { useArtistsStore } from "@/store/artists";
import { useTracksStore } from "@/store/tracks";
import { usePlaysStore } from "@/store/plays";
import { useAuthStore } from "@/store/auth";
import api from "@/api";
import { useI18n } from "vue-i18n";

const I18n = useI18n();
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const playsStore = usePlaysStore();
const tracksStore = useTracksStore();

const props = defineProps<{ artistId?: string }>();

const period = ref({
  start: null as Date | null,
  end: null as Date | null,
});
const useTrackLength = ref(false);
const playStats = ref<PlayStat[]>([]);

const { artists } = storeToRefs(useArtistsStore());
const artistName = computed(() => {
  if (props.artistId) {
    return artists.value[props.artistId]?.name;
  }
  return undefined;
});
const pageTitle = computed(() => {
  if (artistName.value) {
    return I18n.t("common.stats-for-artist", {
      artist: artistName.value,
    });
  } else {
    return I18n.t("common.stats");
  }
});
useHead({ title: pageTitle });

const pageSubtitle = computed(() => {
  if (period.value.start && period.value.end) {
    return `${period.value.start.toLocaleDateString()} - ${period.value.end.toLocaleDateString()}`;
  }
  return "";
});

const filteredTracks = computed(() => {
  if (props.artistId) {
    return tracksStore.tracksFilterByArtist(parseInt(props.artistId));
  }
  return tracksStore.allTracks;
});

function filterPlaysByTracks(tracks: Track[]): (play: Play) => boolean {
  return function (play: Play): boolean {
    return tracks.some((t) => t.id === play.track_id);
  };
}

function filterPlaysByPeriod(
  startDate: Date,
  endDate: Date,
): (play: Play) => boolean {
  return function (play: Play): boolean {
    const playedAt = new Date(play.played_at);
    return playedAt > startDate && playedAt < endDate;
  };
}

const filteredPlays = computed(() => {
  let plays = playsStore.allPlays.filter(
    filterPlaysByPeriod(
      period.value.start || new Date(0),
      period.value.end || new Date(),
    ),
  );
  if (props.artistId) {
    plays = plays.filter(filterPlaysByTracks(filteredTracks.value));
  }
  return plays;
});

const playStatsScope = computed(() => {
  const scope = new PlaysScope();
  if (period.value.start && period.value.end) {
    scope.playedAfter(period.value.start);
    scope.playedBefore(period.value.end);
  }
  if (props.artistId) {
    scope.artist(props.artistId);
  }
  return scope;
});

watch(playStatsScope, loadPlayStats);
watch(useTrackLength, () => {
  if (useTrackLength.value.toString() !== route.query.useTrackLength) {
    router.replace({
      query: {
        ...route.query,
        useTrackLength: useTrackLength.value.toString(),
      },
    });
  }
});
watch(
  () => route.query.useTrackLength,
  () => (useTrackLength.value = route.query.useTrackLength === "true"),
  { immediate: true },
);

async function loadPlayStats(): Promise<void> {
  const gen = api.plays.stats(authStore.apiToken!, playStatsScope.value);
  let done: boolean | undefined = false;
  const results = [];
  while (!done) {
    let value = [];
    ({ value, done } = await gen.next());
    results.push(...value);
  }
  playStats.value = results;
}
</script>

<style lang="scss" scoped>
@use "sass:map";
@use "vuetify/settings";

.stats {
  display: grid;
  grid-auto-columns: 1fr;
  gap: 1rem;
  grid-template-areas:
    "playCount"
    "topTracks"
    "percentagePlayed"
    "topAlbums"
    "topArtists"
    "punchcard";

  @media #{map.get(settings.$display-breakpoints, "sm-and-up")} {
    grid-template-areas:
      "topTracks topTracks"
      "playCount percentagePlayed"
      "topAlbums topAlbums"
      "topArtists topArtists"
      "punchcard punchcard";
  }

  @media #{map.get(settings.$display-breakpoints, "md-and-up")} {
    grid-template-areas:
      "topTracks topTracks topTracks topTracks playCount playCount"
      "topTracks topTracks topTracks topTracks percentagePlayed percentagePlayed"
      "topAlbums topAlbums topAlbums topArtists topArtists topArtists"
      "punchcard punchcard punchcard punchcard punchcard punchcard";
  }

  &__percentage-played {
    grid-area: percentagePlayed;
  }

  &__play-count {
    grid-area: playCount;
  }

  &__top-tracks {
    grid-area: topTracks;
  }

  &__top-albums {
    grid-area: topAlbums;
  }

  &__top-artists {
    grid-area: topArtists;
  }

  &__punchcard {
    grid-area: punchcard;
  }
}
</style>
