<template>
  <VForm ref="form" v-model="isValid">
    <VRow>
      <VCol cols="6">
        <VTextField
          v-model="newCodec.extension"
          :label="$t('library.extension')"
          :disabled="codec !== null"
          required
          :rules="rules.ext"
        />
      </VCol>
      <VCol cols="5">
        <VTextField
          v-model="newCodec.mimetype"
          :label="$t('library.mime-type')"
          :rules="[(v) => !!v || $t('errors.codec.mime-blank')]"
        />
      </VCol>
      <VCol cols="2" sm="1">
        <VBtn
          :disabled="!isValid"
          icon
          variant="outlined"
          :color="(codec && 'info') || 'success'"
          class="ma-2"
          @click="saveCodec"
        >
          <VIcon :color="(codec && 'info') || 'success'">
            {{ codec !== null ? "mdi-content-save" : "mdi-plus" }}
          </VIcon>
        </VBtn>
        <VBtn
          v-if="codec"
          icon
          variant="outlined"
          color="error"
          class="ma-2"
          @click="deleteCodec"
        >
          <VIcon color="error">mdi-delete</VIcon>
        </VBtn>
      </VCol>
    </VRow>
  </VForm>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, useTemplateRef } from "vue";
import type { Codec } from "@accentor/api-client-js";
import { useCodecsStore } from "@/store/codecs";
import i18n from "@/i18n";

const codecsStore = useCodecsStore();

const props = defineProps<{ codec?: Codec }>();
const newCodec = ref({
  mimetype: "",
  extension: "",
});
const isValid = ref(true);
const rules = computed(() => {
  const result = {
    ext: [
      (v: string): true | string =>
        !!v || i18n.global.t("errors.codec.ext-blank"),
    ],
  };
  if (!props.codec) {
    result.ext.push((v) => {
      const double = codecsStore.allCodecs.some((c) => c.extension === v);
      return !double || i18n.global.t("errors.codec.ext-taken");
    });
  }
  return result;
});

onMounted(() => {
  if (props.codec) {
    newCodec.value.mimetype = props.codec.mimetype;
    newCodec.value.extension = props.codec.extension;
  }
});

const form = useTemplateRef("form");
async function saveCodec(): Promise<void> {
  if ((await form.value!.validate()).valid) {
    if (!props.codec) {
      const id = await codecsStore.create(newCodec.value);
      if (id) {
        newCodec.value.extension = "";
        newCodec.value.mimetype = "";
      }
    } else {
      await codecsStore.update(props.codec.id, newCodec.value);
    }
  }
}

async function deleteCodec(): Promise<void> {
  if (confirm(i18n.global.t("common.are-you-sure"))) {
    await codecsStore.destroy(props.codec!.id);
  }
}
</script>
