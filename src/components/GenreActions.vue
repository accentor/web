<template>
  <span>
    <VBtn
      :to="{
        name: 'edit-genre',
        params: { id: genre.id },
        query: { redirect: $route.fullPath },
      }"
      v-if="isModerator"
      color="edit"
      class="ma-2"
      text
      icon
      small
    >
      <VIcon>mdi-pencil</VIcon>
    </VBtn>
    <VDialog
      ref="dialogMerge"
      v-model="mergeModal"
      v-if="isModerator"
      width="600px"
    >
      <template v-slot:activator="{ on }">
        <VBtn
          v-on="on"
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
          <span class="headline">{{
            $t("music.genre.merge-into", { obj: genre.name })
          }}</span>
        </VCardTitle>
        <VCardText>
          <VContainer>
            <VRow>
              <VCol cols="12">
                <VCombobox
                  :items="sortedGenres"
                  cache-items
                  chips
                  deletable-chips
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
    <VBtn
      @click.stop.prevent="deleteGenre"
      v-if="isModerator"
      color="danger"
      class="ma-2"
      href="#"
      text
      icon
      small
    >
      <VIcon>mdi-delete</VIcon>
    </VBtn>
  </span>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "GenreActions",
  props: {
    genre: {},
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
    ...mapActions("genres", ["destroy", "merge"]),
    deleteGenre: function () {
      if (confirm(this.$t("common.are-you-sure"))) {
        this.destroy(this.genre.id);
      }
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
