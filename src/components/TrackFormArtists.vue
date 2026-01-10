<template>
  <Draggable
    v-model="trackArtists"
    :item-key="getItemKey"
    handle=".drag-handle"
  >
    <template #item="{ element: item, index }">
      <VRow no-gutters>
        <VCol class="flex-column flex-grow-0">
          <div
            :ref="index"
            tabindex="0"
            :data-index="index"
            class="d-flex justify-space-between fill-height flex-column py-2"
            @keyup.delete="removeArtist(index)"
            @keyup="handleKeyUp($event.key, index)"
          >
            <VBtn
              icon
              size="small"
              variant="text"
              class="ma-2"
              :disabled="index === 0"
              tabindex="-1"
              @click="moveArtist(index, -1)"
            >
              <VIcon size="x-large">mdi-menu-up</VIcon>
            </VBtn>
            <VBtn
              size="small"
              icon
              variant="text"
              class="ma-2 drag-handle"
              tabindex="-1"
              :disabled="trackArtists.length === 1"
            >
              <VIcon size="x-large">mdi-drag-horizontal-variant</VIcon>
            </VBtn>
            <VBtn
              icon
              size="small"
              variant="text"
              class="ma-2"
              :disabled="index === trackArtists.length - 1"
              tabindex="-1"
              @click="moveArtist(index, 1)"
            >
              <VIcon size="x-large">mdi-menu-down</VIcon>
            </VBtn>
            <VBtn
              icon
              size="small"
              variant="text"
              class="ma-2"
              tabindex="-1"
              @click="removeArtist(index)"
            >
              <VIcon size="x-large">mdi-close</VIcon>
            </VBtn>
          </div>
        </VCol>
        <VCol>
          <VCombobox
            v-model="item.artist_id"
            :items="sortedArtists"
            :custom-filter="filterName"
            item-title="name"
            item-value="id"
            :label="$tc('music.artists', 2)"
            :rules="rules"
            return-object
          />
          <VTextField v-model="item.name" :label="$t('common.name')" />
          <VRow>
            <VCol>
              <VAutocomplete
                v-model="item.role"
                :items="roles"
                :label="$t('music.artist.role')"
              />
            </VCol>
            <VCol class="flex-shrink-1">
              <VCheckbox v-model="item.hidden" color="red">
                <template #label>
                  <span class="no-break-word white-space-nowrap">
                    {{ $t("music.artist.hide.label") }}
                  </span>
                  <VTooltip location="bottom">
                    <template #activator="{ props: tooltipProps }">
                      <VIcon class="ml-2" size="small" v-bind="tooltipProps">
                        mdi-information
                      </VIcon>
                    </template>
                    <span>{{ $t("music.artist.hide.explanation") }}</span>
                  </VTooltip>
                </template>
              </VCheckbox>
            </VCol>
          </VRow>
          <VDivider v-if="index !== trackArtists.length - 1" light />
        </VCol>
      </VRow>
    </template>
  </Draggable>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import Draggable from "vuedraggable";
import { useArtistsStore } from "../store/artists";
import { useVModel } from "@vueuse/core";
import i18n from "@/i18n";
import { computed } from "vue";
import type { Artist, TrackArtistRole } from "@accentor/api-client-js";
import type { InternalItem } from "vuetify/framework";

interface ModelType {
  artist_id: Artist | string | null;
  name: string;
  role: TrackArtistRole;
}

interface Props {
  modelValue: ModelType[];
}

const props = defineProps<Props>();
const emit = defineEmits<{ "update:modelValue": [ModelType[]] }>();
const trackArtists = useVModel(props, "modelValue", emit);
const { artistsByName: sortedArtists } = storeToRefs(useArtistsStore());

const roles = [
  {
    value: "main",
    title: i18n.global.t("music.artist.roles.main"),
  },
  {
    value: "performer",
    title: i18n.global.t("music.artist.roles.performer"),
  },
  {
    value: "composer",
    title: i18n.global.t("music.artist.roles.composer"),
  },
  {
    value: "conductor",
    title: i18n.global.t("music.artist.roles.conductor"),
  },
  {
    value: "remixer",
    title: i18n.global.t("music.artist.roles.remixer"),
  },
  {
    value: "producer",
    title: i18n.global.t("music.artist.roles.producer"),
  },
  {
    value: "arranger",
    title: i18n.global.t("music.artist.roles.arranger"),
  },
];

const rules = computed(() => {
  const artistValidation = (v: string): true | string =>
    !!v || i18n.global.t("errors.artists.artist-blank");
  return [artistValidation];
});

function filterName(
  _value: string,
  queryText: string,
  item?: InternalItem<Artist>,
): boolean {
  if (!item) {
    return false;
  }

  const search = queryText.toLowerCase();
  return (
    item.raw.name.toLowerCase().indexOf(search) >= 0 ||
    item.raw.normalized_name.indexOf(search) >= 0
  );
}

function getItemKey(item: ModelType): number {
  return trackArtists.value.indexOf(item);
}

function removeArtist(index: number): void {
  trackArtists.value.splice(index, 1);
}

function moveArtist(index: number, direction: 1 | -1): void {
  trackArtists.value.splice(
    index + direction,
    0,
    trackArtists.value.splice(index, 1)[0]!,
  );
}

function handleKeyUp(key: string, index: number): void {
  let direction: 1 | -1 | undefined;
  if (key === "ArrowDown" || key === "d") {
    direction = 1;
  } else if (key === "ArrowUp" || key === "u") {
    direction = -1;
  }
  if (
    direction &&
    index + direction >= 0 &&
    index + direction < trackArtists.value.length
  ) {
    moveArtist(index, direction);
  }
}
</script>
