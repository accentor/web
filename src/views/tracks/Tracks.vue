<template>
  <VContainer fill-height fluid>
    <VLayout row>
      <VFlex>
        <TracksTable :tracks="tracks" :show-search="true" />
      </VFlex>
    </VLayout>
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
