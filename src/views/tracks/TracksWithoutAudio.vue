<template>
  <VContainer v-if="isModerator" class="fill-height" fluid>
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
// @ts-nocheck
import { mapState } from "pinia";
import TracksTable from "../../components/TracksTable.vue";
import { useAuthStore } from "../../store/auth";
import { useTracksStore } from "../../store/tracks";

export default {
  name: "EmptyTracks",
  components: { TracksTable },
  head() {
    return { title: this.$t("music.tracks-without-audio") };
  },
  computed: {
    ...mapState(useAuthStore, ["isModerator"]),
    ...mapState(useTracksStore, { tracks: "tracksEmpty" }),
  },
};
</script>
