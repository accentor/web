<template>
  <div v-if="artist">
    <VContainer fluid fill-height>
      <VLayout align-center justify-center>
        <VFlex xs12 sm8 md4>
          <VForm @submit.prevent="submit">
            <VTextField v-model="newArtist.name" label="Name" />
            <FilePicker v-model="newArtist.image">Choose image</FilePicker>
            <VBtn type="submit" color="primary">Update artist</VBtn>
          </VForm>
        </VFlex>
      </VLayout>
    </VContainer>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import FilePicker from "../components/FilePicker";

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
