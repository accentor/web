<template>
  <VForm ref="form" v-model="isValid">
    <VRow>
      <VCol cols="6">
        <VTextField
          v-model="newImageType.extension"
          :label="I18n.t('library.extension')"
          :disabled="imageType !== null"
          required
          :rules="rules.ext"
        />
      </VCol>
      <VCol cols="5">
        <VTextField
          v-model="newImageType.mimetype"
          :label="I18n.t('library.mime-type')"
          required
          :rules="[(v) => !!v || I18n.t('errors.image.mime-blank')]"
        />
      </VCol>
      <VCol cols="2" sm="1">
        <VBtn
          :disabled="!isValid"
          icon
          variant="outlined"
          :color="(imageType && 'info') || 'success'"
          class="ma-2"
          @click="saveImageType"
        >
          <VIcon :color="(imageType && 'info') || 'success'">
            {{ imageType !== null ? "mdi-content-save" : "mdi-plus" }}
          </VIcon>
        </VBtn>
        <VBtn
          v-if="imageType"
          icon
          variant="outlined"
          color="error"
          class="ma-2"
          @click="deleteImageType"
        >
          <VIcon color="error">mdi-delete</VIcon>
        </VBtn>
      </VCol>
    </VRow>
  </VForm>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, useTemplateRef } from "vue";
import type { ImageType } from "@accentor/api-client-js";
import { useImageTypesStore } from "@/store/image_types";
import { useI18n } from "vue-i18n";

const I18n = useI18n();
const imageTypesStore = useImageTypesStore();
const props = defineProps<{ imageType?: ImageType }>();
const newImageType = ref({
  mimetype: "",
  extension: "",
});
const isValid = ref(true);
const rules = computed(() => {
  const result = {
    ext: [
      (v: string): true | string => !!v || I18n.t("errors.image.ext-blank"),
    ],
  };
  if (!props.imageType) {
    result.ext.push((v: string): true | string => {
      const double = imageTypesStore.allImageTypes.some(
        (it) => it.extension === v,
      );
      return !double || I18n.t("errors.image.ext-taken");
    });
  }

  return result;
});

onMounted(fillValues);

function fillValues(): void {
  if (props.imageType) {
    newImageType.value.extension = props.imageType.extension;
    newImageType.value.mimetype = props.imageType.mimetype;
  }
}

async function deleteImageType(): Promise<void> {
  if (confirm(I18n.t("common.are-you-sure"))) {
    await imageTypesStore.destroy(props.imageType!.id);
  }
}

const form = useTemplateRef("form");
async function saveImageType(): Promise<void> {
  if ((await form.value!.validate()).valid) {
    if (!props.imageType) {
      const id = await imageTypesStore.create(newImageType.value);
      if (id) {
        newImageType.value.extension = "";
        newImageType.value.mimetype = "";
      }
    } else {
      await imageTypesStore.update(props.imageType.id, newImageType.value);
    }
  }
}
</script>
