<template>
  <div class="mb-4">
    <label for="image" class="text-subtitle-1">
      {{ $tc("common.images", 1) }}
    </label>
    <input
      ref="picker"
      class="d-none"
      type="file"
      accept="image/*"
      name="image"
      @change="handleSelect"
    />
    <VRow>
      <VCol
        class="flex-column flex-grow-0"
        @dragover.prevent="() => {}"
        @drop.prevent="handleDrop"
      >
        <VImg
          v-if="modelValue && modelValue.data"
          :src="previewSrc"
          height="200"
          width="200"
          cover
        />
        <VImg
          v-else-if="modelValue === null && currentImg"
          :src="currentImg"
          height="200"
          width="200"
          cover
        />
        <VImg
          v-else
          :src="placeholder"
          :aspect-ratio="1"
          class="bg-grey-lighten-3"
          height="200"
          width="200"
          cover
        />
      </VCol>
      <VCol class="flex-column d-flex flex-grow-0 justify-center">
        <VBtn
          color="primary"
          class="ma-2"
          @click="passthrough"
          @dragover.prevent="() => {}"
          @drop.prevent="handleDrop"
        >
          <VIcon start>mdi-upload</VIcon>
          {{ hasImage ? $t("common.replace") : $t("common.choose-image") }}
        </VBtn>
        <VBtn v-if="hasImage" class="ma-2" elevation="0" @click.stop="clear">
          <VIcon start>mdi-close</VIcon>
          clear
        </VBtn>
      </VCol>
    </VRow>
  </div>
</template>

<script>
// @ts-nocheck
export default {
  name: "ImagePicker",
  props: {
    modelValue: {
      type: Object,
      required: true,
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
  emits: ["update:modelValue"],
  computed: {
    previewSrc() {
      return (
        this.modelValue &&
        `data:${this.modelValue.mimetype};base64, ${this.modelValue.data}`
      );
    },
    hasImage() {
      return (
        (this.modelValue === null && this.currentImg) ||
        (this.modelValue && this.modelValue.data !== null)
      );
    },
  },
  methods: {
    handleDrop(event) {
      if (
        event.dataTransfer.files.length === 1 &&
        /^image.*/.test(event.dataTransfer.files[0].type)
      ) {
        this.interpret(event.dataTransfer.files[0]);
      }
    },
    handleSelect(event) {
      const file = event.target.files[0];
      if (file) {
        this.interpret(file);
      }
    },
    interpret(file) {
      const fileReader = new FileReader();
      fileReader.onload = (ev) => {
        this.$emit("update:modelValue", {
          filename: file.name,
          mimetype: file.type,
          data: ev.target.result.replace(
            /^data:[a-zA-Z0-9!#$%^&\\*_\-+{}|'.`~]+\/[a-zA-Z0-9!#$%^&\\*_\-+{}|'.`~]+;base64,/,
            "",
          ),
        });
      };
      fileReader.readAsDataURL(file);
    },
    clear() {
      this.$emit("update:modelValue", {
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
