<template>
  <span v-if="isModerator">
    <VTooltip location="bottom" :disabled="!waitingForReload">
      <template #activator="{ props: tooltipProps }">
        <span v-bind="tooltipProps">
          <VBtn
            :to="{
              name: 'edit-genre',
              params: { id: genre.id },
              query: { redirect: route.fullPath },
            }"
            :disabled="waitingForReload"
            color="warning"
            variant="text"
            icon
            size="small"
          >
            <VIcon size="x-large">mdi-pencil</VIcon>
          </VBtn>
        </span>
      </template>
      <span>{{ I18n.t("common.disabled-while-loading") }}</span>
    </VTooltip>
    <VTooltip location="bottom" :disabled="!waitingForReload">
      <template #activator="{ props: tooltipProps }">
        <span v-bind="tooltipProps">
          <GenreMergeDialog :genre="genre" :disabled="waitingForReload" />
        </span>
      </template>
      <span>{{ I18n.t("common.disabled-while-loading") }}</span>
    </VTooltip>
    <VTooltip location="bottom" :disabled="!waitingForReload">
      <template #activator="{ props: tooltipProps }">
        <span v-bind="tooltipProps">
          <VBtn
            :disabled="waitingForReload"
            color="error"
            class="mr-0"
            href="#"
            variant="text"
            icon
            size="small"
            @click.stop.prevent="deleteGenre"
          >
            <VIcon size="x-large">mdi-delete</VIcon>
          </VBtn>
        </span>
      </template>
      <span>{{ I18n.t("common.disabled-while-loading") }}</span>
    </VTooltip>
  </span>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import GenreMergeDialog from "./GenreMergeDialog.vue";
import { useAuthStore } from "@/store/auth";
import { useGenresStore } from "@/store/genres";
import type { Genre } from "@accentor/api-client-js";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";

const I18n = useI18n();
const route = useRoute();
const genresStore = useGenresStore();
const props = defineProps<{ genre: Genre & { loaded: Date } }>();
const { isModerator } = storeToRefs(useAuthStore());
const waitingForReload = computed(
  () => genresStore.startLoading > props.genre.loaded,
);
async function deleteGenre(): Promise<void> {
  if (confirm(I18n.t("common.are-you-sure"))) {
    await genresStore.destroy(props.genre.id);
  }
}
</script>
