<template>
  <VDialog
    v-if="isModerator"
    ref="dialogMerge"
    v-model="mergeModal"
    width="600px"
  >
    <template #activator="{ on }">
      <VListItem :disabled="disabled" v-on="on">
        <VListItemIcon>
          <VIcon color="edit"> mdi-merge </VIcon>
        </VListItemIcon>

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
                cache-items
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
      <VDivider />
      <VCardActions>
        <VSpacer />
        <VBtn color="primary" class="ma-2" type="submit" @click="mergeAlbums">
          {{ $t("music.album.merge") }}
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

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
    ...mapGetters("auth", ["isModerator"]),
    sortedAlbums() {
      const getter = this.$store.getters["albums/albumsByTitle"];
      return getter.filter((a) => {
        return a.id !== this.album.id;
      });
    },
  },
  methods: {
    ...mapActions("albums", ["merge"]),
    filterTitle(item, queryText) {
      const search = queryText.toLowerCase();
      return (
        item.title.toLowerCase().indexOf(search) > -1 ||
        item.normalized_title.indexOf(search) > -1
      );
    },
    mergeAlbums() {
      this.merge({ newID: this.mergeAlbum.id, oldID: this.album.id }).finally(
        () => {
          this.mergeModal = false;
        },
      );
    },
  },
};
</script>
