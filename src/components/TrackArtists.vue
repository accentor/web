<template>
  <div v-if="trackArtists.length !== 0">
    <VMenu open-on-hover>
      <template #activator="{ props: menuProps }">
        <div v-bind="menuProps">
          {{
            trackArtists
              .filter((a) => !a.hidden)
              .map((a) => a.name)
              .join(" / ")
          }}
        </div>
      </template>
      <VList density="compact">
        <VListItem
          v-for="ta of trackArtists"
          :key="`${ta.artist_id} ${ta.name} ${ta.role}`"
        >
          <span>
            <RouterLink :to="{ name: 'artist', params: { id: ta.artist_id } }">
              {{ ta.artist_name }}
            </RouterLink>
            ({{ I18n.t(`music.artist.roles.${ta.role}`) }})
            <span v-if="ta.name !== ta.artist_name">
              {{ I18n.t("common.as") }} {{ ta.name }}
            </span>
          </span>
        </VListItem>
      </VList>
    </VMenu>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import type { TrackArtist } from "@accentor/api-client-js";
import { useArtistsStore } from "@/store/artists";
import { useI18n } from "vue-i18n";

const I18n = useI18n();

interface Props {
  track: {
    track_artists: TrackArtist[];
  };
}

const props = defineProps<Props>();
const { artists } = storeToRefs(useArtistsStore());

const trackArtists = computed(() => {
  return [...props.track.track_artists]
    .sort((a1, a2) => a1.order - a2.order)
    .map((ta) => ({
      ...ta,
      artist_name: artists.value[`${ta.artist_id}`]?.name ?? ta.name,
    }));
});
</script>
