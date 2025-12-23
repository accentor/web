<template>
  <VDialog
    v-if="isModerator"
    ref="dialogMerge"
    v-model="mergeModal"
    width="600px"
  >
    <template #activator="{ on }">
      <VBtn
        :disabled="disabled"
        class="actions__button"
        color="edit"
        variant="text"
        icon
        size="small"
        v-on="on"
        @click.stop.prevent
      >
        <VIcon>mdi-merge</VIcon>
      </VBtn>
    </template>
    <VCard>
      <VCardTitle>
        <span class="text-h5">{{
          $t("music.genre.merge-into", { obj: genre.name })
        }}</span>
      </VCardTitle>
      <VCardText>
        <VContainer>
          <VRow>
            <VCol cols="12">
              <VCombobox
                v-model="mergeGenre"
                :items="sortedGenres"
                :custom-filter="filterName"
                cache-items
                item-title="name"
                item-value="id"
                :label="$tc('music.genres', 1)"
                return-object
              >
                <template #item="{ item }">
                  {{ item.name }}
                  <span class="text-grey pl-2 ml-auto text-body-2">
                    {{ item.id }}
                  </span>
                </template>
              </VCombobox>
            </VCol>
          </VRow>
        </VContainer>
      </VCardText>
      <VDivider />
      <VCardActions>
        <VSpacer />
        <VBtn color="primary" class="ma-2" type="submit" @click="mergeGenres">
          {{ $t("music.genre.merge") }}
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

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
    ...mapGetters("auth", ["isModerator"]),
    sortedGenres() {
      const getter = this.$store.getters["genres/genresByName"];
      return getter.filter((g) => {
        return g.id !== this.genre.id;
      });
    },
  },
  methods: {
    ...mapActions("genres", ["merge"]),
    filterName(item, queryText) {
      const search = queryText.toLowerCase();
      return (
        item.name.toLowerCase().indexOf(search) > -1 ||
        item.normalized_name.indexOf(search) > -1
      );
    },
    mergeGenres() {
      this.merge({ newID: this.mergeGenre.id, oldID: this.genre.id }).finally(
        () => {
          this.mergeModal = false;
        },
      );
    },
  },
};
</script>
