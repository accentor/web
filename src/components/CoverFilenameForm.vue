<template>
  <VForm v-model="isValid" ref="form" lazy-validation>
    <VRow>
      <VCol cols="5">
        <VTextField
          v-model="newCoverFilename.filename"
          :label="$t('library.filename')"
          :disabled="coverFilename !== null"
          required
          :rules="[(v) => !!v || $t('errors.cover_filename.filename-blank')]"
        />
      </VCol>
      <VCol cols="2" sm="1">
        <VBtn
          :disabled="!isValid"
          icon
          outlined
          color="success"
          class="ma-2"
          @click="saveCoverFilename"
          v-if="!coverFilename"
        >
          <VIcon color="success">mdi-plus</VIcon>
        </VBtn>
        <VBtn
          icon
          outlined
          v-if="coverFilename"
          color="danger"
          class="ma-2"
          @click="deleteCoverFilename"
        >
          <VIcon color="danger">mdi-delete</VIcon>
        </VBtn>
      </VCol>
    </VRow>
  </VForm>
</template>

<script>
import {useCoverFilenamesStore} from "../store/cover_filenames";
import {mapActions} from "pinia";

export default {
  name: "CoverFilenameForm",
  props: { coverFilename: { default: null, type: Object } },
  data() {
    return {
      newCoverFilename: {
        filename: "",
      },
      isValid: true,
    };
  },
  created() {
    this.$nextTick(() => {
      if (this.coverFilename) {
        this.fillValues();
      }
    });
  },
  watch: {
    album: function () {
      if (this.coverFilename) {
        this.fillValues();
      }
    },
  },
  methods: {
    fillValues() {
      this.newCoverFilename.filename = this.coverFilename.filename;
    },
    ...mapActions(useCoverFilenamesStore, ["destroy",  "create"]),
    async saveCoverFilename() {
      if (this.$refs.form.validate()) {
        const id = await this.create(this.newCoverFilename);
        if (id) {
          this.newCoverFilename.filename = "";
        }
      }
    },
    deleteCoverFilename() {
      if (confirm(this.$t("common.are-you-sure"))) {
        this.destroy(this.coverFilename.id);
      }
    },
  },
};
</script>
