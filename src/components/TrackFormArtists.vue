<template>
  <Draggable :list="this.trackArtists" handle=".drag-handle">
    <VRow :key="index" v-for="(item, index) of trackArtists" no-gutters>
      <VCol class="flex-column flex-grow-0">
        <div
          tabindex="0"
          :data-index="index"
          @keyup.delete="removeArtist(index)"
          @keyup="handleKeyUp($event.key, index)"
          :ref="index"
          class="d-flex justify-space-between fill-height flex-column py-2"
        >
          <VBtn
            @click="moveArtist(index, -1)"
            icon
            small
            class="ma-2"
            :disabled="index === 0"
            tabindex="-1"
          >
            <VIcon>mdi-menu-up</VIcon>
          </VBtn>
          <VBtn
            small
            icon
            text
            class="ma-2 drag-handle"
            tabindex="-1"
            :disabled="trackArtists.length === 1"
          >
            <VIcon>mdi-drag-horizontal-variant</VIcon>
          </VBtn>
          <VBtn
            @click="moveArtist(index, 1)"
            icon
            small
            class="ma-2"
            :disabled="index === trackArtists.length - 1"
            tabindex="-1"
          >
            <VIcon>mdi-menu-down</VIcon>
          </VBtn>
          <VBtn
            @click="removeArtist(index)"
            icon
            small
            class="ma-2"
            tabindex="-1"
          >
            <VIcon>mdi-close</VIcon>
          </VBtn>
        </div>
      </VCol>
      <VCol>
        <VCombobox
          :items="sortedArtists"
          :filter="filterName"
          item-text="name"
          item-value="id"
          :label="$tc('music.artists', 2)"
          :rules="rules"
          return-object
          v-model="item.artist_id"
        />
        <VTextField :label="$t('common.name')" v-model="item.name" />
        <VAutocomplete
          :items="roles"
          :label="$t('music.artist.role')"
          v-model="item.role"
        />
        <VDivider light v-if="index !== trackArtists.length - 1" />
      </VCol>
    </VRow>
  </Draggable>
</template>

<script>
import { mapGetters } from "vuex";
import Draggable from "vuedraggable";

export default {
  name: "TrackFormArtists",
  components: {
    Draggable,
  },
  data() {
    return {
      roles: [
        {
          value: "main",
          text: this.$t("music.artist.roles.main"),
        },
        {
          value: "performer",
          text: this.$t("music.artist.roles.performer"),
        },
        {
          value: "composer",
          text: this.$t("music.artist.roles.composer"),
        },
        {
          value: "conductor",
          text: this.$t("music.artist.roles.conductor"),
        },
        {
          value: "remixer",
          text: this.$t("music.artist.roles.remixer"),
        },
        {
          value: "producer",
          text: this.$t("music.artist.roles.producer"),
        },
        {
          value: "arranger",
          text: this.$t("music.artist.roles.arranger"),
        },
      ],
      trackArtists: [],
    };
  },
  props: {
    value: {
      type: Array,
      required: true,
    },
  },
  watch: {
    trackArtists(newValue) {
      this.$emit("update:value", newValue);
    },
    value: {
      handler() {
        this.trackArtists = this.value;
      },
      immediate: true,
    },
  },
  computed: {
    ...mapGetters("artists", {
      sortedArtists: "artistsByName",
    }),
    rules() {
      const artistValidation = (v) =>
        !!v || this.$t("errors.artists.artist-blank");
      return [artistValidation];
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
    removeArtist(index) {
      this.trackArtists.splice(index, 1);
    },
    moveArtist(index, direction) {
      this.trackArtists.splice(
        index + direction,
        0,
        this.trackArtists.splice(index, 1)[0]
      );
    },
    handleKeyUp(key, index) {
      let direction;
      if (key === "ArrowDown" || key === "d") {
        direction = 1;
      } else if (key === "ArrowUp" || key === "u") {
        direction = -1;
      }
      if (typeof direction !== "undefined") {
        this.moveArtist(index, direction);
        // Due to the way Vue updates the DOM, we have to manually focus on the current trackArtist in its new place
        this.$refs[index + direction][0].focus();
      }
    },
  },
};
</script>
