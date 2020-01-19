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
import { mapGetters } from "vuex";
import TracksTable from "../../components/TracksTable";

export default {
  name: "Tracks",
  components: { TracksTable },
  computed: {
    ...mapGetters("tracks", {
      tracks: "tracksByAlbumAndNumber"
    })
  }
};
</script>
