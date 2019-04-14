<template>
  <VContainer fill-height fluid>
    <VLayout align-center justify-center>
      <VFlex md4 sm8 xs12>
        <VForm @submit.prevent="submit">
          <VTextField label="Name" v-model="newArtist.name" />
          <FilePicker v-model="newArtist.image">Choose image</FilePicker>
          <VBtn color="primary" type="submit">Create artist</VBtn>
        </VForm>
      </VFlex>
    </VLayout>
  </VContainer>
</template>

<script>
import { mapActions } from "vuex";
import FilePicker from "../../components/FilePicker";

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
