<template>
  <VContainer class="fill-height" fluid v-if="genre">
    <vue-headful
      :title="$t('page-titles.edit', { obj: genre.name }) + ' | Accentor'"
    />
    <VRow no-gutters align="center" justify="center">
      <VCol md="4" sm="8" cols="12">
        <VForm v-model="isValid" @submit.prevent="submit">
          <VTextField
            :label="$t('common.name')"
            v-model="newGenre.name"
            :rules="[(v) => !!v || $t('errors.genre.name-blank')]"
            required
            aria-required="true"
          />
          <VBtn :disabled="!isValid" color="primary" class="ma-2" type="submit">
            {{ $t("music.genre.update") }}
          </VBtn>
        </VForm>
      </VCol>
    </VRow>
  </VContainer>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "EditGenre",
  data() {
    return {
      newGenre: {
        name: "",
      },
      isValid: true,
    };
  },
  created() {
    this.$nextTick(() => {
      if (this.genre) {
        this.fillValues();
      }
    });
  },
  watch: {
    genre: function () {
      if (this.genre) {
        this.fillValues();
      }
    },
  },
  computed: {
    ...mapState("genres", ["genres"]),
    genre: function () {
      return this.genres[this.$route.params.id];
    },
  },
  methods: {
    ...mapActions("genres", ["update"]),
    fillValues() {
      this.newGenre.name = this.genre.name;
    },
    submit() {
      this.update({ id: this.genre.id, newGenre: this.newGenre }).then(
        (succeeded) => {
          if (succeeded) {
            this.$router.push(this.$route.query.redirect || { name: "genres" });
          }
        }
      );
    },
  },
};
</script>
