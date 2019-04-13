<template>
  <VContainer fluid fill-height>
    <VLayout align-center justify-center>
      <VFlex xs12 sm8 md4>
        <VForm @submit.prevent="submit">
          <VTextField v-model="newArtist.name" label="Name" />
          <FilePicker v-model="newArtist.image">Choose image</FilePicker>
          <VBtn type="submit" color="primary">Create artist</VBtn>
        </VForm>
      </VFlex>
    </VLayout>
  </VContainer>
</template>

<script>
import FilePicker from "../components/FilePicker";
import { mapActions } from "vuex";

export default {
  name: "NewArtist",
  components: { FilePicker },
  data() {
    return {
      newArtist: {
        name: "",
        image: null
      }
    };
  },
  methods: {
    ...mapActions("artists", ["create"]),
    fillValues() {
      this.newArtist.name = this.artist.name;
    },
    submit() {
      this.create(this.newArtist).then(id => {
        if (id) {
          this.$router.push({ name: "artist", params: { id } });
        }
      });
    }
  }
};
</script>

<style scoped></style>
