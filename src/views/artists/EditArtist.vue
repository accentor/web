<template>
  <VContainer fill-height fluid v-if="artist">
    <VLayout align-center justify-center>
      <VFlex md4 sm8 xs12>
        <VAlert
          :value="artist.review_comment !== null"
          type="warning"
          icon="mdi-flag"
        >
          {{ artist.review_comment }}
        </VAlert>
        <VForm @submit.prevent="submit">
          <VTextField :label="$t('common.name')" v-model="newArtist.name" />
          <FilePicker v-model="newArtist.image">
            {{ $t("common.choose-image") }}
          </FilePicker>
          <VCheckbox
            v-if="artist.review_comment !== null"
            v-model="clear_review_comment"
            :label="$tc('music.flag.clear', 1)"
          />
          <VBtn color="primary" type="submit">
            {{ $t("music.artist.update") }}
          </VBtn>
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
        image: null,
        review_comment: null
      },
      clear_review_comment: true
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
      this.newArtist.review_comment = this.artist.review_comment;
    },
    submit() {
      this.newArtist.review_comment = this.clear_review_comment
        ? null
        : this.newArtist.review_comment;
      this.update({ id: this.artist.id, newArtist: this.newArtist }).then(
        succeeded => {
          if (succeeded) {
            this.$router.push(
              this.$route.query.redirect || { name: "artists" }
            );
          }
        }
      );
    }
  }
};
</script>
