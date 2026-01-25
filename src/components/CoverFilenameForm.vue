<template>
  <VForm ref="form" v-model="isValid">
    <VRow>
      <VCol cols="5">
        <VTextField
          v-model="newCoverFilename.filename"
          :label="I18n.t('library.filename')"
          :disabled="coverFilename !== null"
          required
          :rules="[
            (v) => !!v || I18n.t('errors.cover_filename.filename-blank'),
          ]"
        />
      </VCol>
      <VCol cols="2" sm="1">
        <VBtn
          v-if="!coverFilename"
          :disabled="!isValid"
          icon
          variant="outlined"
          color="success"
          class="ma-2"
          @click="saveCoverFilename"
        >
          <VIcon color="success">mdi-plus</VIcon>
        </VBtn>
        <VBtn
          v-if="coverFilename"
          icon
          variant="outlined"
          color="error"
          class="ma-2"
          @click="deleteCoverFilename"
        >
          <VIcon color="error">mdi-delete</VIcon>
        </VBtn>
      </VCol>
    </VRow>
  </VForm>
</template>

<script setup lang="ts">
import { useCoverFilenamesStore } from "@/store/cover_filenames";
import type { CoverFilename } from "@accentor/api-client-js";
import { onMounted, ref, useTemplateRef } from "vue";
import { useI18n } from "vue-i18n";

const I18n = useI18n();
const coverFilenamesStore = useCoverFilenamesStore();
const props = defineProps<{ coverFilename?: CoverFilename }>();
const newCoverFilename = ref({ filename: "" });
const isValid = ref(true);

onMounted(() => {
  if (props.coverFilename) {
    newCoverFilename.value.filename = props.coverFilename.filename;
  }
});

const form = useTemplateRef("form");
async function saveCoverFilename(): Promise<void> {
  if ((await form.value!.validate()).valid) {
    const id = await coverFilenamesStore.create(newCoverFilename.value);
    if (id) {
      newCoverFilename.value.filename = "";
    }
  }
}

async function deleteCoverFilename(): Promise<void> {
  if (confirm(I18n.t("common.are-you-sure"))) {
    await coverFilenamesStore.destroy(props.coverFilename!.id);
  }
}
</script>
