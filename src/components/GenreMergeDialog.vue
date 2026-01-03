<template>
  <VDialog
    v-if="isModerator"
    ref="dialogMerge"
    v-model="mergeModal"
    width="600px"
  >
    <template #activator="{ props }">
      <VBtn
        :disabled="disabled"
        color="warning"
        variant="text"
        icon
        size="small"
        v-bind="props"
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
                <template #item="{ item, props }">
                  <VListItem v-bind="props">
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

<script>
// @ts-nocheck
import { mapActions, mapState } from "pinia";
import { useAuthStore } from "../store/auth";
import { useGenresStore } from "../store/genres";

export default {
  name: "GenreMergeDialog",
  props: {
    disabled: {
      type: Boolean,
      required: true,
    },
    genre: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      mergeGenre: null,
      mergeModal: false,
    };
  },
  computed: {
    ...mapState(useAuthStore, ["isModerator"]),
    ...mapState(useGenresStore, ["genresByName"]),
    sortedGenres() {
      return this.genresByName.filter((g) => g.id !== this.genre.id);
    },
  },
  methods: {
    ...mapActions(useGenresStore, ["merge"]),
    filterName(item, queryText) {
      const search = queryText.toLowerCase();
      return (
        item.name.toLowerCase().indexOf(search) > -1 ||
        item.normalized_name.indexOf(search) > -1
      );
    },
    mergeGenres() {
      this.merge(this.mergeGenre.id, this.genre.id).finally(
        () => (this.mergeModal = false),
      );
    },
  },
};
</script>
