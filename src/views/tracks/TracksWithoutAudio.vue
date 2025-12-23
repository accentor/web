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
import { useAuthStore } from "../../store/auth";
import { mapState } from "pinia";

export default {
  name: "EmptyTracks",
  components: { TracksTable },
  metaInfo() {
    return { title: this.$t("music.tracks-without-audio") };
  },
  computed: {
    ...mapState(useAuthStore, ["isModerator"]),
    ...mapGetters("tracks", {
      tracks: "tracksEmpty",
    }),
  },
};
</script>
