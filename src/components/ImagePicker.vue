<template>
  <div class="mb-4">
    <label for="image" class="text-subtitle-1">
      {{ I18n.t("common.images", 1) }}
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
          {{
            hasImage ? I18n.t("common.replace") : I18n.t("common.choose-image")
          }}
        </VBtn>
        <VBtn v-if="hasImage" class="ma-2" elevation="0" @click.stop="clear">
          <VIcon start>mdi-close</VIcon>
          clear
        </VBtn>
      </VCol>
    </VRow>
  </div>
</template>

<script setup lang="ts">
import { computed, useTemplateRef } from "vue";
import { useVModel } from "@vueuse/core";
import type { ImageParams } from "@accentor/api-client-js";
import { useI18n } from "vue-i18n";

const I18n = useI18n();

interface Props {
  modelValue: ImageParams | null;
  currentImg?: string;
  placeholder: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{ "update:modelValue": [ImageParams | null] }>();

const modelValue = useVModel(props, "modelValue", emit);

const previewSrc = computed<string | undefined>(() => {
  if (modelValue.value) {
    return `data:${modelValue.value.mimetype};base64, ${modelValue.value.data}`;
  }
  return undefined;
});

const hasImage = computed<boolean>(() => {
  if (modelValue.value) {
    return Boolean(modelValue.value.data);
  } else {
    return Boolean(props.currentImg);
  }
});

function interpret(file: File): void {
  const fileReader = new FileReader();
  fileReader.onload = (): void => {
    modelValue.value = {
      filename: file.name,
      mimetype: file.type,
      data: (fileReader.result! as string).replace(
        /^data:[a-zA-Z0-9!#$%^&\\*_\-+{}|'.`~]+\/[a-zA-Z0-9!#$%^&\\*_\-+{}|'.`~]+;base64,/,
        "",
      ),
    };
  };
  fileReader.readAsDataURL(file);
}

function handleDrop(event: DragEvent): void {
  if (
    event.dataTransfer?.files?.length === 1 &&
    /^image.*/.test(event.dataTransfer.files[0]?.type || "")
  ) {
    interpret(event.dataTransfer.files[0]!);
  }
}

const picker = useTemplateRef<HTMLInputElement>("picker");
function handleSelect(): void {
  const file = picker.value!.files![0];
  if (file) {
    interpret(file);
  }
}

function clear(): void {
  modelValue.value = { data: null };
}

function passthrough(): void {
  picker.value!.click();
}
</script>
