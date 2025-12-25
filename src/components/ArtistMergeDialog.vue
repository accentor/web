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
        class="actions__button"
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
          $t("music.artist.merge-into", { obj: artist.name })
        }}</span>
      </VCardTitle>
      <VCardText>
        <VContainer>
          <VRow>
            <VCol cols="12">
              <VCombobox
                :items="sortedArtists"
                :filter="filterName"
                cache-items
                item-text="name"
                item-value="id"
                :label="$tc('music.artists', 1)"
                return-object
                v-model="mergeArtist"
              >
                <template v-slot:item="{ item }">
                  {{ item.name }}
                  <span class="grey--text pl-2 ml-auto text-body-2">
                    {{ item.id }}
                  </span>
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

<script>
import { useAuthStore } from "../store/auth";
import { mapActions, mapState } from "pinia";
import { useArtistsStore } from "../store/artists";

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
    ...mapState(useAuthStore, ["isModerator"]),
    ...mapState(useArtistsStore, ["artistsByName"]),
    sortedArtists() {
      return this.artistsByName.filter((a) => a.id !== this.artist.id);
    },
  },
  methods: {
    ...mapActions(useArtistsStore, ["merge"]),
    filterName(item, queryText) {
      const search = queryText.toLowerCase();
      return (
        item.name.toLowerCase().indexOf(search) > -1 ||
        item.normalized_name.indexOf(search) > -1
      );
    },
    mergeArtists() {
      this.merge(this.mergeArtist.id, this.artist.id).finally(
        () => (this.mergeModal = false),
      );
    },
  },
};
</script>
