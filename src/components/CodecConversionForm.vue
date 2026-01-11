<template>
  <VForm ref="form" v-model="isValid">
    <VRow>
      <VCol cols="3">
        <VTextField
          v-model="newCodecConversion.name"
          :label="I18n.t('common.name')"
          required
          :rules="rules.name"
        />
      </VCol>
      <VCol cols="5">
        <VTextField
          v-model="newCodecConversion.ffmpeg_params"
          :label="I18n.t('library.ffmpeg-para')"
          required
          :rules="[(v) => !!v || I18n.t('errors.codecconv.ffmepg-blank')]"
        />
      </VCol>
      <VCol cols="3">
        <VAutocomplete
          v-model="newCodecConversion.resulting_codec_id"
          :items="codecs"
          :label="I18n.t('library.resulting-codec')"
          item-value="id"
          item-title="extension"
          required
          :rules="[(v) => !!v || I18n.t('errors.codecconv.result-blank')]"
        />
      </VCol>
      <VCol cols="2" sm="1">
        <VBtn
          icon
          variant="outlined"
          :disabled="!isValid"
          :color="(codecConversion && 'info') || 'success'"
          class="ma-2"
          @click="saveCodecConversion"
        >
          <VIcon :color="(codecConversion && 'info') || 'success'">
            {{ codecConversion !== null ? "mdi-content-save" : "mdi-plus" }}
          </VIcon>
        </VBtn>
        <VBtn
          v-if="codecConversion"
          icon
          variant="outlined"
          color="error"
          class="ma-2"
          @click="deleteCodecConversion"
        >
          <VIcon color="error">mdi-delete</VIcon>
        </VBtn>
      </VCol>
    </VRow>
  </VForm>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import type { CodecConversion } from "@accentor/api-client-js";
import { useCodecConversionsStore } from "@/store/codec_conversions";
import { useCodecsStore } from "@/store/codecs";
import { computed, onMounted, ref, useTemplateRef } from "vue";
import { useI18n } from "vue-i18n";

const I18n = useI18n();
const codecConversionsStore = useCodecConversionsStore();
const props = defineProps<{ codecConversion?: CodecConversion }>();
const newCodecConversion = ref({
  name: "",
  ffmpeg_params: "",
  resulting_codec_id: null as number | null,
});
const isValid = ref(true);

const { allCodecs: codecs } = storeToRefs(useCodecsStore());
const rules = computed(() => ({
  name: [
    (v: string): true | string => !!v || I18n.t("errors.codecconv.name-blank"),
    (v: string): true | string => {
      const double = codecConversionsStore.allCodecConversions.some(
        (cc) => cc.name === v && cc.id !== props.codecConversion?.id,
      );
      return !double || I18n.t("errors.codecconv.name-taken");
    },
  ],
}));

onMounted(() => {
  if (props.codecConversion) {
    newCodecConversion.value.name = props.codecConversion.name;
    newCodecConversion.value.ffmpeg_params =
      props.codecConversion.ffmpeg_params;
    newCodecConversion.value.resulting_codec_id =
      props.codecConversion.resulting_codec_id;
  }
});

const form = useTemplateRef("form");
async function saveCodecConversion(): Promise<void> {
  if ((await form.value!.validate()).valid) {
    const transformed = {
      ...newCodecConversion.value,
      resulting_codec_id: newCodecConversion.value.resulting_codec_id!,
    };

    if (!props.codecConversion) {
      const id = await codecConversionsStore.create(transformed);
      if (id) {
        newCodecConversion.value.name = "";
        newCodecConversion.value.ffmpeg_params = "";
        newCodecConversion.value.resulting_codec_id = null;
      }
    } else {
      await codecConversionsStore.update(props.codecConversion.id, transformed);
    }
  }
}

async function deleteCodecConversion(): Promise<void> {
  if (confirm(I18n.t("common.are-you-sure"))) {
    await codecConversionsStore.destroy(props.codecConversion!.id);
  }
}
</script>
