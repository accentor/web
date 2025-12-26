<template>
  <VForm ref="form" v-model="isValid">
    <VRow>
      <VCol cols="3">
        <VTextField
          v-model="newCodecConversion.name"
          :label="$t('common.name')"
          required
          :rules="rules.name"
        />
      </VCol>
      <VCol cols="5">
        <VTextField
          v-model="newCodecConversion.ffmpeg_params"
          :label="$t('library.ffmpeg-para')"
          required
          :rules="[(v) => !!v || $t('errors.codecconv.ffmepg-blank')]"
        />
      </VCol>
      <VCol cols="3">
        <VAutocomplete
          v-model="newCodecConversion.resulting_codec_id"
          :items="codecs"
          :label="$t('library.resulting-codec')"
          item-value="id"
          item-title="extension"
          required
          :rules="[(v) => !!v || $t('errors.codecconv.result-blank')]"
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
          color="danger"
          class="ma-2"
          @click="deleteCodecConversion"
        >
          <VIcon color="danger">mdi-delete</VIcon>
        </VBtn>
      </VCol>
    </VRow>
  </VForm>
</template>

<script>
import { mapActions, mapState } from "pinia";
import { useCodecConversionsStore } from "@/store/codec_conversions";
import { useCodecsStore } from "../store/codecs";

export default {
  name: "CodecConversionForm",
  props: { codecConversion: { default: null, type: Object } },
  data() {
    return {
      newCodecConversion: {
        name: "",
        ffmpeg_params: "",
        resulting_codec_id: null,
      },
      isValid: true,
    };
  },
  computed: {
    ...mapState(useCodecsStore, { codecs: "allCodecs" }),
    ...mapState(useCodecConversionsStore, {
      codecConversions: "allCodecConversions",
    }),
    rules() {
      const rules = {
        name: [(v) => !!v || this.$t("errors.codecconv.name-blank")],
      };

      const nameTaken = (v) => {
        const double = this.codecConversions.some(
          (cc) => cc.name === v && cc.id !== this.codecConversion?.id,
        );
        return !double || this.$t("errors.codecconv.name-taken");
      };
      rules.name.push(nameTaken);
      return rules;
    },
  },
  watch: {
    album: function () {
      if (this.codecConversion) {
        this.fillValues();
      }
    },
  },
  created() {
    this.$nextTick(() => {
      if (this.codecConversion) {
        this.fillValues();
      }
    });
  },
  methods: {
    fillValues() {
      this.newCodecConversion.name = this.codecConversion.name;
      this.newCodecConversion.ffmpeg_params =
        this.codecConversion.ffmpeg_params;
      this.newCodecConversion.resulting_codec_id =
        this.codecConversion.resulting_codec_id;
    },
    ...mapActions(useCodecConversionsStore, ["destroy", "update", "create"]),
    async saveCodecConversion() {
      if (this.$refs.form.validate()) {
        if (this.codecConversion === null) {
          const id = await this.create(this.newCodecConversion);
          if (id) {
            this.newCodecConversion.name = "";
            this.newCodecConversion.ffmpeg_params = "";
            this.newCodecConversion.resulting_codec_id = null;
          }
        } else {
          await this.update(this.codecConversion.id, this.newCodecConversion);
        }
      }
    },
    deleteCodecConversion() {
      if (confirm(this.$t("common.are-you-sure"))) {
        this.destroy(this.codecConversion.id);
      }
    },
  },
};
</script>
