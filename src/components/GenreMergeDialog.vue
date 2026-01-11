<template>
  <VDialog
    v-if="isModerator"
    ref="dialogMerge"
    v-model="mergeModal"
    width="600px"
  >
    <template #activator="{ props: dialogProps }">
      <VBtn
        :disabled="disabled"
        color="warning"
        variant="text"
        icon
        size="small"
        v-bind="dialogProps"
        @click.stop.prevent
      >
        <VIcon size="x-large">mdi-merge</VIcon>
      </VBtn>
    </template>
    <VCard>
      <VCardTitle>
        <span class="text-h5">
          {{ $t("music.genre.merge-into", { obj: genre.name }) }}
        </span>
      </VCardTitle>
      <VCardText>
        <VContainer>
          <VRow>
            <VCol cols="12">
              <VCombobox
                v-model="mergeGenre"
                :items="sortedGenres"
                :custom-filter="filterName"
                item-title="name"
                item-value="id"
                :label="$tc('music.genres', 1)"
                return-object
              >
                <template #item="{ item, props: listItemProps }">
                  <VListItem v-bind="listItemProps">
                    <template #append>
                      <span class="text-grey pl-2 text-body-2">
                        {{ item.value }}
                      </span>
                    </template>
                  </VListItem>
                </template>
              </VCombobox>
            </VCol>
          </VRow>
        </VContainer>
      </VCardText>
      <VDivider></VDivider>
      <VCardActions>
        <VSpacer></VSpacer>
        <VBtn color="primary" class="ma-2" type="submit" @click="mergeGenres">
          {{ $t("music.genre.merge") }}
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import type { InternalItem } from "vuetify/framework";
import { storeToRefs } from "pinia";
import type { Genre } from "@accentor/api-client-js";
import { useAuthStore } from "@/store/auth";
import { useGenresStore } from "@/store/genres";

const genresStore = useGenresStore();
const props = defineProps<{ disabled: boolean; genre: Genre }>();
const mergeGenre = ref<Genre | null>(null);
const mergeModal = ref(false);
const { isModerator } = storeToRefs(useAuthStore());
const sortedGenres = computed(() =>
  genresStore.genresByName.filter((g) => g.id !== props.genre.id),
);

function filterName(
  _value: string,
  queryText: string,
  item?: InternalItem<Genre>,
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

async function mergeGenres(): Promise<void> {
  if (!mergeGenre.value) {
    return;
  }

  try {
    await genresStore.merge(mergeGenre.value.id, props.genre.id);
  } finally {
    mergeModal.value = false;
  }
}
</script>
