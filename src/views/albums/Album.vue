<template>
  <VContainer fluid grid-list-xl v-if="album">
    <VLayout row wrap>
      <VFlex lg3 md4 sm6 v-if="album.image" xs12>
        <VImg :src="album.image" />
      </VFlex>
      <VFlex lg9 md8 sm6 xs12>
        <div>
          <div class="headline">{{ album.title }}</div>
          <div>
            {{ album.albumartist }}
          </div>
          <div class="grey--text">
            {{ album.release }}
          </div>
        </div>
      </VFlex>
    </VLayout>
  </VContainer>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Album",
  computed: {
    ...mapState("albums", ["albums"]),
    album: function() {
      return this.albums[this.$route.params.id];
    }
  }
};
</script>
