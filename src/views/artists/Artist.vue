<template>
  <VContainer fluid grid-list-xl v-if="artist">
    <VLayout row wrap>
      <VFlex lg3 md4 sm6 v-if="artist.image" xs12>
        <VImg :src="artist.image" />
      </VFlex>
      <VFlex lg9 md8 sm6 xs12>
        <h3>{{ artist.name }}</h3>
      </VFlex>
    </VLayout>
  </VContainer>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Artist",
  computed: {
    ...mapState("artists", ["artists"]),
    artist: function() {
      return this.artists[this.$route.params.id];
    }
  }
};
</script>
