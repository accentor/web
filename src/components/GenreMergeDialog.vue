<template>
  <VDialog
    ref="dialogMerge"
    v-model="mergeModal"
    v-if="isModerator"
    width="600px"
  >
    <template v-slot:activator="{ on }">
      <VBtn
        v-on="on"
        :disabled="disabled"
        @click.stop.prevent
        class="ma-2"
        color="edit"
        text
        icon
        small
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
                :items="sortedGenres"
                :filter="filterName"
                cache-items
                item-text="name"
                item-value="id"
                :label="$tc('music.genres', 1)"
                return-object
                v-model="mergeGenre"
              />
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
    filterName(item, queryText, itemText) {
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
        }
      );
    },
  },
};
</script>
