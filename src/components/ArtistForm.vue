<template>
  <VRow no-gutters align="center" justify="center">
    <VCol md="4" sm="8" cols="12">
      <VAlert
        v-if="artist"
        :value="artist.review_comment !== null"
        type="warning"
        icon="mdi-flag"
      >
        {{ artist.review_comment }}
      </VAlert>
      <VForm v-model="isValid" @submit.prevent="submit">
        <VTextField
          :label="$t('common.name')"
          v-model="newArtist.name"
          :rules="[(v) => !!v || $t('errors.artists.name-blank')]"
          required
        />
        <FilePicker v-model="newArtist.image" />
        <VCheckbox
          v-if="artist && artist.review_comment !== null"
          v-model="clear_review_comment"
          :label="$tc('music.flag.clear', 1)"
        />
        <VBtn :disabled="!isValid" color="primary" class="ma-2" type="submit">
          {{ this.artist ? $t("music.artist.update") : $t("music.artist.add") }}
        </VBtn>
      </VForm>
    </VCol>
  </VRow>
</template>

<script>
import { mapActions } from "vuex";
import FilePicker from "./FilePicker";

export default {
  name: "ArtistForm",
  components: { FilePicker },
  props: { artist: { type: Object, default: null } },
  data() {
    return {
      newArtist: {
        name: "",
        image: null,
        review_comment: null,
      },
      clear_review_comment: true,
      isValid: true,
    };
  },
  created() {
    this.$nextTick(() => {
      if (this.artist) {
        this.fillValues();
      }
    });
  },
  watch: {
    artist: function () {
      if (this.artist) {
        this.fillValues();
      }
    },
  },
  methods: {
    ...mapActions("artists", ["create", "update"]),
    fillValues() {
      this.newArtist.name = this.artist.name;
      this.newArtist.review_comment = this.artist.review_comment;
    },
    submit() {
      this.newArtist.review_comment = this.clear_review_comment
        ? null
        : this.newArtist.review_comment;
      let promise = null;
      if (this.artist) {
        promise = this.update({
          id: this.artist.id,
          newArtist: this.newArtist,
        });
      } else {
        promise = this.create(this.newArtist);
      }
      promise.then((succeeded) => {
        if (succeeded) {
          this.$router.push(this.$route.query.redirect || { name: "artists" });
        }
      });
    },
  },
};
</script>
