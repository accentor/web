<template>
  <VContainer class="fill-height" fluid>
    <VRow no-gutters>
      <VCol>
        <TracksTable
          :tracks="tracks"
          :show-search="true"
          :show-mass-edit="false"
        />
      </VCol>
    </VRow>
  </VContainer>
</template>

<script>
import { mapState } from "pinia";
import TracksTable from "../../components/TracksTable.vue";
import { useTracksStore } from "../../store/tracks";

export default {
  name: "Tracks",
  components: { TracksTable },
  metaInfo() {
    return { title: this.$tc("music.tracks", 2) };
  },
  computed: {
    ...mapState(useTracksStore, { tracks: "tracksByAlbumAndNumber" }),
  },
};
</script>
