<template>
  <div v-if="artist">
    <VContainer fluid grid-list-xl>
      <VLayout row wrap>
        <VFlex xs12 sm6 md4 lg3 v-if="artist.image">
          <VImg :src="artist.image" />
        </VFlex>
        <VFlex xs12 sm6 md8 lg9>
          <h3>{{ artist.name }}</h3>
        </VFlex>
      </VLayout>
    </VContainer>
  </div>
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
