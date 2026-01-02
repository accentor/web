<template>
  <Draggable
    v-model="trackArtists"
    :item-key="getItemKey"
    handle=".drag-handle"
  >
    <template #item="{ element: item, index }">
      <VRow no-gutters>
        <VCol class="flex-column flex-grow-0">
          <div
            :ref="index"
            tabindex="0"
            :data-index="index"
            class="d-flex justify-space-between fill-height flex-column py-2"
            @keyup.delete="removeArtist(index)"
            @keyup="handleKeyUp($event.key, index)"
          >
            <VBtn
              icon
              size="small"
              variant="text"
              class="ma-2"
              :disabled="index === 0"
              tabindex="-1"
              @click="moveArtist(index, -1)"
            >
              <VIcon size="x-large">mdi-menu-up</VIcon>
            </VBtn>
            <VBtn
              size="small"
              icon
              variant="text"
              class="ma-2 drag-handle"
              tabindex="-1"
              :disabled="trackArtists.length === 1"
            >
              <VIcon size="x-large">mdi-drag-horizontal-variant</VIcon>
            </VBtn>
            <VBtn
              icon
              size="small"
              variant="text"
              class="ma-2"
              :disabled="index === trackArtists.length - 1"
              tabindex="-1"
              @click="moveArtist(index, 1)"
            >
              <VIcon size="x-large">mdi-menu-down</VIcon>
            </VBtn>
            <VBtn
              icon
              size="small"
              variant="text"
              class="ma-2"
              tabindex="-1"
              @click="removeArtist(index)"
            >
              <VIcon size="x-large">mdi-close</VIcon>
            </VBtn>
          </div>
        </VCol>
        <VCol>
          <VCombobox
            v-model="item.artist_id"
            :items="sortedArtists"
            :custom-filter="filterName"
            item-title="name"
            item-value="id"
            :label="$tc('music.artists', 2)"
            :rules="rules"
            return-object
          />
          <VTextField v-model="item.name" :label="$t('common.name')" />
          <VRow>
            <VCol>
              <VAutocomplete
                v-model="item.role"
                :items="roles"
                :label="$t('music.artist.role')"
              />
            </VCol>
            <VCol class="flex-shrink-1">
              <VCheckbox v-model="item.hidden" color="red">
                <template #label>
                  <span class="no-break-word white-space-nowrap">
                    {{ $t("music.artist.hide.label") }}
                  </span>
                  <VTooltip location="bottom">
                    <template #activator="{ props }">
                      <VIcon
                        class="ml-2"
                        :size="true ? 'small' : undefined"
                        v-bind="props"
                      >
                        mdi-information
                      </VIcon>
                    </template>
                    <span>{{ $t("music.artist.hide.explanation") }}</span>
                  </VTooltip>
                </template>
              </VCheckbox>
            </VCol>
          </VRow>
          <VDivider v-if="index !== trackArtists.length - 1" light />
        </VCol>
      </VRow>
    </template>
  </Draggable>
</template>

<script>
// @ts-nocheck
import { mapState } from "pinia";
import Draggable from "vuedraggable";
import { useArtistsStore } from "../store/artists";

export default {
  name: "TrackFormArtists",
  components: {
    Draggable,
  },
  props: {
    modelValue: {
      type: Array,
      required: true,
    },
  },
  emits: ["update:modelValue"],
  data() {
    return {
      roles: [
        {
          value: "main",
          title: this.$t("music.artist.roles.main"),
        },
        {
          value: "performer",
          title: this.$t("music.artist.roles.performer"),
        },
        {
          value: "composer",
          title: this.$t("music.artist.roles.composer"),
        },
        {
          value: "conductor",
          title: this.$t("music.artist.roles.conductor"),
        },
        {
          value: "remixer",
          title: this.$t("music.artist.roles.remixer"),
        },
        {
          value: "producer",
          title: this.$t("music.artist.roles.producer"),
        },
        {
          value: "arranger",
          title: this.$t("music.artist.roles.arranger"),
        },
      ],
      trackArtists: [],
    };
  },
  computed: {
    ...mapState(useArtistsStore, { sortedArtists: "artistsByName" }),
    rules() {
      const artistValidation = (v) =>
        !!v || this.$t("errors.artists.artist-blank");
      return [artistValidation];
    },
  },
  watch: {
    trackArtists(newValue) {
      this.$emit("update:modelValue", newValue);
    },
    modelValue: {
      handler() {
        this.trackArtists = this.modelValue;
      },
      immediate: true,
    },
  },
  methods: {
    filterName(item, queryText) {
      const search = queryText.toLowerCase();
      return (
        item.name.toLowerCase().indexOf(search) > -1 ||
        item.normalized_name.indexOf(search) > -1
      );
    },
    getItemKey(item) {
      return this.trackArtists.indexOf(item);
    },
    removeArtist(index) {
      this.trackArtists.splice(index, 1);
    },
    moveArtist(index, direction) {
      this.trackArtists.splice(
        index + direction,
        0,
        this.trackArtists.splice(index, 1)[0],
      );
    },
    handleKeyUp(key, index) {
      let direction;
      if (key === "ArrowDown" || key === "d") {
        direction = 1;
      } else if (key === "ArrowUp" || key === "u") {
        direction = -1;
      }
      if (
        typeof direction !== "undefined" &&
        index + direction >= 0 &&
        index + direction < this.trackArtists.length
      ) {
        this.moveArtist(index, direction);
        // Due to the way Vue updates the DOM, we have to manually focus on the current trackArtist in its new place
        this.$refs[index + direction][0].focus();
      }
    },
  },
};
</script>
