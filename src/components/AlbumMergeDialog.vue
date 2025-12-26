<template>
  <VDialog
    v-if="isModerator"
    ref="dialogMerge"
    v-model="mergeModal"
    width="600px"
  >
    <template #activator="{ props }">
      <VListItem :disabled="disabled" v-bind="props">
        <template #prepend>
          <VIcon color="edit">mdi-merge</VIcon>
        </template>

        <VListItemTitle>{{ $t("music.album.merge") }}</VListItemTitle>
      </VListItem>
    </template>
    <VCard>
      <VCardTitle>
        <span class="text-h5">{{
          $t("music.album.merge-into", { obj: album.name })
        }}</span>
      </VCardTitle>
      <VCardText>
        <VContainer>
          <VRow>
            <VCol cols="12">
              <VCombobox
                v-model="mergeAlbum"
                :items="sortedAlbums"
                :custom-filter="filterTitle"
                item-title="title"
                item-value="id"
                :label="$tc('music.albums', 1)"
                return-object
              >
                <template #item="{ item }">
                  {{ item.title }}
                  <span class="text-grey pl-2 ml-auto text-body-2">
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
        <VBtn color="primary" class="ma-2" type="submit" @click="mergeAlbums">
          {{ $t("music.album.merge") }}
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script>
import { mapState, mapActions } from "pinia";
import { useAuthStore } from "../store/auth";
import { useAlbumsStore } from "../store/albums";

export default {
  name: "AlbumMergeDialog",
  props: {
    disabled: {
      type: Boolean,
      required: true,
    },
    album: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      mergeAlbum: null,
      mergeModal: false,
    };
  },
  computed: {
    ...mapState(useAuthStore, ["isModerator"]),
    ...mapState(useAlbumsStore, ["albumsByTitle"]),
    sortedAlbums() {
      return this.albumsByTitle.filter((a) => a.id !== this.album.id);
    },
  },
  methods: {
    ...mapActions(useAlbumsStore, ["merge"]),
    filterTitle(item, queryText) {
      const search = queryText.toLowerCase();
      return (
        item.title.toLowerCase().indexOf(search) > -1 ||
        item.normalized_title.indexOf(search) > -1
      );
    },
    mergeAlbums() {
      this.merge(this.mergeAlbum.id, this.album.id).finally(
        () => (this.mergeModal = false),
      );
    },
  },
};
</script>
