<template>
  <VContainer v-if="genre" class="fill-height" fluid>
    <VRow no-gutters align="center" justify="center">
      <VCol md="4" sm="8" cols="12" @change.once="isDirty = true">
        <VForm v-model="isValid" @submit.prevent="submit">
          <VTextField
            v-model="newGenre.name"
            :label="$t('common.name')"
            :rules="[(v) => !!v || $t('errors.genre.name-blank')]"
            required
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
import { mapActions, mapState } from "pinia";
import { useGenresStore } from "../../store/genres";

export default {
  name: "EditGenre",
  metaInfo() {
    return { title: this.$t("page-titles.edit", { obj: this.genre?.name }) };
  },
  data() {
    return {
      newGenre: {
        name: "",
      },
      isDirty: false,
      isValid: true,
    };
  },
  computed: {
    ...mapState(useGenresStore, ["genres"]),
    genre: function () {
      return this.genres[this.$route.params.id];
    },
  },
  watch: {
    genre: function () {
      if (this.genre && !this.isDirty) {
        this.fillValues();
      }
    },
  },
  async created() {
    if (this.genre) {
      await this.read(this.genre.id);
      this.fillValues();
    }
  },
  methods: {
    ...mapActions(useGenresStore, ["read", "update"]),
    fillValues() {
      this.newGenre.name = this.genre.name;
    },
    async submit() {
      const succeeded = await this.update(this.genre.id, this.newGenre);
      if (succeeded) {
        this.$router.push(this.$route.query.redirect || { name: "genres" });
      }
    },
  },
};
</script>
