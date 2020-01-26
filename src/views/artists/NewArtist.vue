<template>
  <VContainer class="fill-height" fluid>
    <vue-headful :title="$t('music.artist.new') + ' | Accentor'" />
    <VRow no-gutters align="center" justify="center">
      <VCol md="4" sm="8" cols="12">
        <VForm @submit.prevent="submit">
          <VTextField :label="$t('common.name')" v-model="newArtist.name" />
          <FilePicker v-model="newArtist.image" />
          <VBtn color="primary" class="ma-2" type="submit">
            {{ $t("music.artist.add") }}
          </VBtn>
        </VForm>
      </VCol>
    </VRow>
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
