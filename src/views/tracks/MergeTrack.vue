<template>
  <VContainer class="fill-height" v-if="track">
    <vue-headful
      :title="$t('page-titles.merge', { obj: track.title }) + ' | Accentor'"
    />
    <VRow>
      <VCol lg="9" md="8" sm="6" cols="12">
        <div class="text-h4">
          {{ $t("music.track.merge-into", { obj: track.title }) }}
        </div>
        <div class="grey--text">
          {{ $t("music.track.merge-explanation") }}
        </div>
      </VCol>
    </VRow>
    <VRow>
      <VCol>
        <TracksTable
          :tracks="tracks"
          :showSearch="true"
          :showActions="false"
          :showMassEdit="false"
        />
      </VCol>
    </VRow>
  </VContainer>
</template>

<script>
import { mapGetters } from "vuex";
import TracksTable from "@/components/TracksTable";

export default {
  name: "MergeTrack",
  components: { TracksTable },
  data() {
    return {
      newID: null,
    };
  },
  computed: {
    ...mapGetters({ tracks: "tracks/tracksByAlbumAndNumber" }),
    track: function () {
      return this.tracks[this.$route.params.id];
    },
  },
};
</script>
