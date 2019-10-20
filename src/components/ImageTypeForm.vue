<template>
  <VForm>
    <VLayout>
      <VFlex xs6>
        <VTextField
          v-model="newImageType.extension"
          :label="$t('library.extension')"
          :disabled="imageType !== null"
        />
      </VFlex>
      <VFlex xs5>
        <VTextField
          v-model="newImageType.mimetype"
          :label="$t('library.mime-type')"
        />
      </VFlex>
      <VFlex xs2 sm1>
        <VBtn
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
      </VFlex>
    </VLayout>
  </VForm>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "ImageTypeForm",
  props: { imageType: { default: null, type: Object } },
  data() {
    return {
      newImageType: {
        mimetype: "",
        extension: ""
      }
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
    album: function() {
      if (this.imageType) {
        this.fillValues();
      }
    }
  },
  methods: {
    fillValues() {
      this.newImageType.extension = this.imageType.extension;
      this.newImageType.mimetype = this.imageType.mimetype;
    },
    ...mapActions("imageTypes", ["destroy", "update", "create"]),
    saveImageType() {
      if (this.imageType === null) {
        this.create(this.newImageType).then(id => {
          if (id) {
            this.newImageType.extension = "";
            this.newImageType.mimetype = "";
          }
        });
      } else {
        this.update({ id: this.imageType.id, newImageType: this.newImageType });
      }
    },
    deleteImageType() {
      if (confirm(this.$t("common.are-you-sure"))) {
        this.destroy(this.imageType.id);
      }
    }
  }
};
</script>
