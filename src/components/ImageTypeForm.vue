<template>
  <VForm v-model="isValid" ref="form" lazy-validation>
    <VRow>
      <VCol cols="6">
        <VTextField
          v-model="newImageType.extension"
          :label="$t('library.extension')"
          :disabled="imageType !== null"
          required
          :rules="rules.ext"
        />
      </VCol>
      <VCol cols="5">
        <VTextField
          v-model="newImageType.mimetype"
          :label="$t('library.mime-type')"
          required
          :rules="[(v) => !!v || $t('errors.image.mime-blank')]"
        />
      </VCol>
      <VCol cols="2" sm="1">
        <VBtn
          :disabled="!isValid"
          icon
          outlined
          :color="(imageType && 'info') || 'success'"
          class="ma-2"
          @click="saveImageType"
        >
          <VIcon :color="(imageType && 'info') || 'success'">
            {{ imageType !== null ? "mdi-content-save" : "mdi-plus" }}
          </VIcon>
        </VBtn>
        <VBtn
          icon
          outlined
          v-if="imageType"
          color="danger"
          class="ma-2"
          @click="deleteImageType"
        >
          <VIcon color="danger">mdi-delete</VIcon>
        </VBtn>
      </VCol>
    </VRow>
  </VForm>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "ImageTypeForm",
  props: { imageType: { default: null, type: Object } },
  data() {
    return {
      newImageType: {
        mimetype: "",
        extension: "",
      },
      isValid: true,
    };
  },
  created() {
    this.$nextTick(() => {
      if (this.imageType) {
        this.fillValues();
      }
    });
  },
  watch: {
    album: function () {
      if (this.imageType) {
        this.fillValues();
      }
    },
  },
  computed: {
    ...mapGetters("imageTypes", ["imageTypes"]),
    rules() {
      const rules = {
        ext: [(v) => !!v || this.$t("errors.image.ext-blank")],
      };
      if (this.imageType === null) {
        const extTaken = (v) => {
          const double = this.imageTypes.some((it) => it.extension === v);
          return !double || this.$t("errors.image.ext-taken");
        };
        rules.ext.push(extTaken);
      }

      return rules;
    },
  },
  methods: {
    fillValues() {
      this.newImageType.extension = this.imageType.extension;
      this.newImageType.mimetype = this.imageType.mimetype;
    },
    ...mapActions("imageTypes", ["destroy", "update", "create"]),
    saveImageType() {
      if (this.$refs.form.validate()) {
        if (this.imageType === null) {
          this.create(this.newImageType).then((id) => {
            if (id) {
              this.newImageType.extension = "";
              this.newImageType.mimetype = "";
            }
          });
        } else {
          this.update({
            id: this.imageType.id,
            newImageType: this.newImageType,
          });
        }
      }
    },
    deleteImageType() {
      if (confirm(this.$t("common.are-you-sure"))) {
        this.destroy(this.imageType.id);
      }
    },
  },
};
</script>
