<template>
  <VContainer>
    <VRow>
      <VCol>
        <h1 class="text-headline-large my-0">{{ pageTitle }}</h1>
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
    <div v-if="loadingProgress !== null" class="progress">
      <VProgressCircular
        color="primary"
        :model-value="loadingProgress"
        :size="150"
        :width="20"
        variant="split"
      >
        <template #default> {{ loadingProgress }}% </template>
      </VProgressCircular>
    </div>
    <RouterView v-else v-slot="{ Component }">
      <component
        :is="Component"
        :play-stats="playStats"
        :use-track-length="useTrackLength"
        :tracks="filteredTracks"
        :plays="filteredPlays"
        :artist-name="artistName"
      />
    </RouterView>
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
const loadingProgress = ref<number | null>(null);
const playStats = ref<PlayStat[]>([]);

const { artists } = storeToRefs(useArtistsStore());
const artistName = computed(() => {
  if (props.artistId) {
    return artists.value[props.artistId]?.name;
  }
  return null;
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
watch(useTrackLength, async () => {
  if (useTrackLength.value.toString() !== route.query.useTrackLength) {
    await router.replace({
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
    // We want to avoid short flashes of the progress element. If there are only a small amount of pageSubtitle
    // to fetch, we just don't show a progress indicator.
    if (gen.totalPages > 3) {
      loadingProgress.value = Math.round(gen.progress * 100);
    }
    results.push(...value);
  }
  playStats.value = results;
  loadingProgress.value = null;
}
</script>

<style>
.progress {
  display: flex;
  justify-content: center;
  margin-block: 24px;
}
</style>
