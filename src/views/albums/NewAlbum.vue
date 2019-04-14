<template>
  <VContainer fill-height fluid>
    <VLayout align-center justify-center>
      <VFlex md4 sm8 xs12>
        <VForm @submit.prevent="submit">
          <VTextField label="Title" v-model="newAlbum.title" />
          <VTextField label="Albumartist" v-model="newAlbum.albumartist" />
          <VDialog
            ref="dialog"
            v-model="releaseModal"
            :return-value.sync="newAlbum.release"
            persistent
            lazy
            full-width
            width="290px"
          >
            <template v-slot:activator="{ on }">
              <VTextField
                v-model="newAlbum.release"
                label="Release"
                readonly
                v-on="on"
              ></VTextField>
            </template>
            <VDatePicker v-model="newAlbum.release" scrollable>
              <VSpacer></VSpacer>
              <VBtn flat color="primary" @click="releaseModal = false">
                Cancel
              </VBtn>
              <VBtn
                flat
                color="primary"
                @click="$refs.dialog.save(newAlbum.release)"
              >
                OK
              </VBtn>
            </VDatePicker>
          </VDialog>
          <FilePicker v-model="newAlbum.image">Choose image</FilePicker>
          <VBtn color="primary" type="submit">Create album</VBtn>
        </VForm>
      </VFlex>
    </VLayout>
  </VContainer>
</template>

<script>
import { mapActions } from "vuex";
import FilePicker from "../../components/FilePicker";

export default {
  name: "EditAlbum",
  components: { FilePicker },
  data() {
    return {
      releaseModal: false,
      newAlbum: {
        title: "",
        albumartist: "",
        release: new Date().toISOString().substr(0, 10),
        image: null
      }
    };
  },
  created() {
    setTimeout(() => {
      if (this.album) {
        this.fillValues();
      }
    });
  },
  methods: {
    ...mapActions("albums", ["create"]),
    submit() {
      this.create(this.newAlbum).then(succeeded => {
        if (succeeded) {
          this.$router.push({ name: "albums" });
        }
      });
    }
  }
};
</script>
