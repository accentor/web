<template>
  <VContainer fill-height fluid v-if="artist">
    <VLayout align-center justify-center>
      <VFlex md4 sm8 xs12>
        <VForm @submit.prevent="submit">
          <VTextField label="Name" v-model="newArtist.name" />
          <FilePicker v-model="newArtist.image">Choose image</FilePicker>
          <VBtn color="primary" type="submit">Update artist</VBtn>
        </VForm>
      </VFlex>
    </VLayout>
  </VContainer>
</template>

<script>
import { mapActions, mapState } from "vuex";
import FilePicker from "../../components/FilePicker";

export default {
  name: "EditArtist",
  components: { FilePicker },
  data() {
    return {
      newArtist: {
        name: "",
        image: null
      }
    };
  },
  created() {
    setTimeout(() => {
      if (this.artist) {
        this.fillValues();
      }
    });
  },
  watch: {
    artist: function() {
      if (this.artist) {
        this.fillValues();
      }
    }
  },
  computed: {
    ...mapState("artists", ["artists"]),
    artist: function() {
      return this.artists[this.$route.params.id];
    }
  },
  methods: {
    ...mapActions("artists", ["update"]),
    fillValues() {
      this.newArtist.name = this.artist.name;
    },
    submit() {
      this.update({ id: this.artist.id, newArtist: this.newArtist }).then(
        succeeded => {
          if (succeeded) {
            this.$router.push({ name: "artists" });
          }
        }
      );
    }
  }
};
</script>
