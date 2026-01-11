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
          {{ $t("music.artist.merge-into", { obj: artist.name }) }}
        </span>
      </VCardTitle>
      <VCardText>
        <VContainer>
          <VRow>
            <VCol cols="12">
              <VCombobox
                v-model="mergeArtist"
                :items="sortedArtists"
                :custom-filter="filterName"
                item-title="name"
                item-value="id"
                :label="$tc('music.artists', 1)"
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
        <VBtn color="primary" class="ma-2" type="submit" @click="mergeArtists">
          {{ $t("music.artist.merge") }}
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import type { InternalItem } from "vuetify/framework";
import { useAuthStore } from "@/store/auth";
import { useArtistsStore } from "@/store/artists";
import type { Artist } from "@accentor/api-client-js";
import { storeToRefs } from "pinia";

const authStore = useAuthStore();
const artistsStore = useArtistsStore();

const props = defineProps<{ disabled: boolean; artist: Artist }>();

const mergeArtist = ref<Artist | null>(null);
const mergeModal = ref<boolean>(false);

const { isModerator } = storeToRefs(authStore);

const sortedArtists = computed(() =>
  artistsStore.artistsByName.filter((a) => a.id !== props.artist.id),
);

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
    item.raw.name.toLowerCase().indexOf(search) > -1 ||
    item.raw.normalized_name.toLowerCase().indexOf(search) > -1
  );
}

async function mergeArtists(): Promise<void> {
  try {
    if (mergeArtist.value) {
      await artistsStore.merge(mergeArtist.value.id, props.artist.id);
    }
  } finally {
    mergeModal.value = false;
  }
}
</script>
