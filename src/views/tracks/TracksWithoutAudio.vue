<template>
  <VContainer class="fill-height" fluid v-if="isModerator">
    <VRow no-gutters>
      <VCol>
        <TracksTable
          :tracks="tracks"
          :title="$t('music.tracks-without-audio')"
          :show-search="true"
          :show-mass-edit="true"
        />
      </VCol>
    </VRow>
  </VContainer>
</template>

<script>
import { mapGetters } from "vuex";
import TracksTable from "../../components/TracksTable.vue";

export default {
  name: "EmptyTracks",
  components: { TracksTable },
  metaInfo() {
    return { title: this.$t("music.tracks-without-audio") };
  },
  computed: {
    ...mapGetters("auth", ["isModerator"]),
    ...mapGetters("tracks", {
      tracks: "tracksEmpty",
    }),
  },
};
</script>
