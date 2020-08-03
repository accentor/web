<template>
  <VContainer class="fill-height" fluid v-if="isModerator">
    <vue-headful :title="$t('music.tracks-empty') + ' | Accentor'" />
    <VRow no-gutters>
      <VCol>
        <TracksTable
          :tracks="tracks"
          :title="$t('music.tracks-empty')"
          :show-search="true"
          :show-mass-edit="true"
        />
      </VCol>
    </VRow>
  </VContainer>
</template>

<script>
import { mapGetters } from "vuex";
import TracksTable from "../../components/TracksTable";

export default {
  name: "EmptyTracks",
  components: { TracksTable },
  computed: {
    ...mapGetters("auth", ["isModerator"]),
    ...mapGetters("tracks", {
      tracks: "tracksEmpty",
    }),
  },
};
</script>
