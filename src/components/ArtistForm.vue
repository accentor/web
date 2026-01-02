<template>
  <VRow no-gutters align="center" justify="center">
    <VCol lg="6" sm="8" cols="12" @change.once="isDirty = true">
      <VAlert
        v-if="artist"
        :model-value="artist.review_comment !== null"
        type="warning"
        icon="mdi-flag"
        class="mb-4"
      >
        {{ artist.review_comment }}
      </VAlert>
      <VForm v-model="isValid" @submit.prevent="submit">
        <VTextField
          v-model="newArtist.name"
          :label="$t('common.name')"
          :rules="[(v) => !!v || $t('errors.artists.name-blank')]"
          required
        />
        <ImagePicker
          v-model="newArtist.image"
          :current-img="artist && artist.image250"
          :placeholder="artistSvgUrl"
        />
        <VCheckbox
          v-if="artist && artist.review_comment !== null"
          v-model="clear_review_comment"
          :label="$tc('music.flag.clear', 1)"
        />
        <VBtn :disabled="!isValid" color="primary" class="ma-2" type="submit">
          {{ artist ? $t("music.artist.update") : $t("music.artist.add") }}
        </VBtn>
      </VForm>
    </VCol>
  </VRow>
</template>

<script>
// @ts-nocheck
import { mapActions } from "pinia";
import ImagePicker from "./ImagePicker.vue";
import { useArtistsStore } from "../store/artists";
import artistSvgUrl from "@mdi/svg/svg/account-music.svg";

export default {
  name: "ArtistForm",
  components: { ImagePicker },
  props: { artist: { type: Object, default: null } },
  data() {
    return {
      newArtist: {
        name: "",
        image: null,
        review_comment: null,
      },
      clear_review_comment: true,
      isDirty: false,
      isValid: true,
      artistSvgUrl,
    };
  },
  watch: {
    artist: function () {
      if (this.artist && !this.isDirty) {
        this.fillValues();
      }
    },
  },
  async created() {
    if (this.artist) {
      await this.read(this.artist.id);
      this.fillValues();
    }
  },
  methods: {
    ...mapActions(useArtistsStore, ["create", "read", "update"]),
    fillValues() {
      this.newArtist.name = this.artist.name;
      this.newArtist.review_comment = this.artist.review_comment;
    },
    async submit() {
      this.newArtist.review_comment = this.clear_review_comment
        ? null
        : this.newArtist.review_comment;
      let pendingResult = null;
      if (this.artist) {
        pendingResult = this.update(this.artist.id, this.newArtist);
      } else {
        pendingResult = this.create(this.newArtist);
      }
      const succeeded = await pendingResult;
      if (succeeded) {
        this.$router.push(this.$route.query.redirect || { name: "artists" });
      }
    },
  },
};
</script>
