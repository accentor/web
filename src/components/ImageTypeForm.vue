<template>
  <VForm>
    <VLayout row>
      <VFlex xs6>
        <VTextField
          v-model="newImageType.extension"
          label="Extension"
          :disabled="imageType !== null"
        />
      </VFlex>
      <VFlex xs5>
        <VTextField v-model="newImageType.mimetype" label="MIME type" />
      </VFlex>
      <VFlex xs1>
        <VBtn
          icon
          outline
          :color="(imageType && 'blue') || 'green'"
          @click="saveImageType"
        >
          <VIcon :color="(imageType && 'blue') || 'green'">
            {{ imageType !== null ? "mdi-content-save" : "mdi-plus" }}
          </VIcon>
        </VBtn>
        <VBtn
          icon
          outline
          v-if="imageType"
          color="red"
          @click="deleteImageType"
        >
          <VIcon color="red">mdi-delete</VIcon>
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
      if (confirm("Are you sure?")) {
        this.destroy(this.imageType.id);
      }
    }
  }
};
</script>
