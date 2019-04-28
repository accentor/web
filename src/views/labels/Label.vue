<template>
  <VContainer fluid grid-list-xl v-if="label">
    <VLayout row wrap>
      <VFlex xs12>
        <h3>{{ label.name }}</h3>
      </VFlex>
    </VLayout>
    <VLayout row wrap>
      <VFlex :key="item.id" lg3 md4 sm6 v-for="item of albums" xl2 xs12>
        <AlbumCard :album="item" />
      </VFlex>
    </VLayout>
  </VContainer>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import AlbumCard from "../../components/AlbumCard";

export default {
  name: "Label",
  components: { AlbumCard },
  computed: {
    ...mapGetters("auth", ["isModerator"]),
    ...mapState("labels", ["labels"]),
    albums: function() {
      return this.$store.getters["albums/albumsFilterByLabel"](
        this.$route.params.id
      );
    },
    label: function() {
      return this.labels[this.$route.params.id];
    }
  }
};
</script>
