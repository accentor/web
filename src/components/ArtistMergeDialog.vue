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
          $t("music.artist.merge-into", { obj: artist.name })
        }}</span>
      </VCardTitle>
      <VCardText>
        <VContainer>
          <VRow>
            <VCol cols="12">
              <VCombobox
                v-model="mergeArtist"
                :items="sortedArtists"
                :custom-filter="filterName"
                cache-items
                item-title="name"
                item-value="id"
                :label="$tc('music.artists', 1)"
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
        <VBtn color="primary" class="ma-2" type="submit" @click="mergeArtists">
          {{ $t("music.artist.merge") }}
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "ArtistMergeDialog",
  props: {
    disabled: {
      type: Boolean,
      required: true,
    },
    artist: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      mergeArtist: null,
      mergeModal: false,
    };
  },
  computed: {
    ...mapGetters("auth", ["isModerator"]),
    sortedArtists() {
      const getter = this.$store.getters["artists/artistsByName"];
      return getter.filter((a) => {
        return a.id !== this.artist.id;
      });
    },
  },
  methods: {
    ...mapActions("artists", ["merge"]),
    filterName(item, queryText) {
      const search = queryText.toLowerCase();
      return (
        item.name.toLowerCase().indexOf(search) > -1 ||
        item.normalized_name.indexOf(search) > -1
      );
    },
    mergeArtists() {
      this.merge({ newID: this.mergeArtist.id, oldID: this.artist.id }).finally(
        () => {
          this.mergeModal = false;
        },
      );
    },
  },
};
</script>
