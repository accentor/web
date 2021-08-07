<template>
  <div class="mb-4">
    <label for="image" class="text-subtitle-1">
      {{ $tc("common.images", 1) }}
    </label>
    <input
      @change="interpret"
      class="d-none"
      ref="picker"
      type="file"
      accept="image/*"
      name="image"
    />
    <VRow>
      <VCol class="flex-column flex-grow-0">
        <VImg
          :src="previewSrc"
          height="200"
          width="200"
          contain
          v-if="value && value.data"
        />
        <VImg
          :src="currentImg"
          height="200"
          width="200"
          contain
          v-else-if="value === null && currentImg"
        />
        <VImg
          :src="placeholder"
          :aspect-ratio="1"
          class="grey lighten-3"
          height="200"
          width="200"
          contain
          v-else
        />
      </VCol>
      <VCol class="flex-column d-flex flex-grow-0 justify-center">
        <VBtn @click="passthrough" color="primary" class="ma-2" dark>
          <VIcon left>mdi-upload</VIcon>
          {{ hasImage ? $t("common.replace") : $t("common.choose-image") }}
        </VBtn>
        <VBtn @click.stop="clear" class="ma-2" elevation="0" v-if="hasImage">
          <VIcon left>mdi-close</VIcon>
          clear
        </VBtn>
      </VCol>
    </VRow>
  </div>
</template>

<script>
export default {
  name: "ImagePicker",
  props: {
    value: {
      type: Object,
      required: false,
      default: () => {
        return { filename: null, mimetype: null, data: null };
      },
    },
    currentImg: {
      type: String,
      required: false,
      default: null,
    },
    placeholder: {
      type: String,
      required: true,
    },
  },
  computed: {
    previewSrc() {
      return `data:${this.value.mimetype};base64, ${this.value.data}`;
    },
    hasImage() {
      return (
        (this.value === null && this.currentImg) ||
        (this.value && this.value.data !== null)
      );
    },
  },
  methods: {
    interpret(event) {
      const file = event.target.files[0];
      if (file) {
        const fileReader = new FileReader();
        fileReader.onload = (ev) => {
          this.$emit("input", {
            filename: file.name,
            mimetype: file.type,
            data: ev.target.result.replace(
              /^data:[a-zA-Z0-9!#$%^&\\*_\-+{}|'.`~]+\/[a-zA-Z0-9!#$%^&\\*_\-+{}|'.`~]+;base64,/,
              ""
            ),
          });
        };
        fileReader.readAsDataURL(file);
      }
    },
    clear() {
      this.$emit("input", {
        filename: null,
        mimetype: null,
        data: null,
      });
    },
    passthrough() {
      this.$refs.picker.click();
    },
  },
};
</script>
