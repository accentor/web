<template>
  <VForm>
    <VRow>
      <VCol cols="3">
        <VTextField
          v-model="newCodecConversion.name"
          :label="$t('common.name')"
        />
      </VCol>
      <VCol cols="5">
        <VTextField
          v-model="newCodecConversion.ffmpeg_params"
          :label="$t('library.ffmpeg-para')"
        />
      </VCol>
      <VCol cols="3">
        <VAutocomplete
          :items="codecs"
          :label="$t('library.resulting-codec')"
          v-model="newCodecConversion.resulting_codec_id"
          item-value="id"
          item-text="extension"
        />
      </VCol>
      <VCol cols="2" sm="1">
        <VBtn
          icon
          outlined
          :color="(codecConversion && 'info') || 'success'"
          class="ma-2"
          @click="saveCodecConversion"
        >
          <VIcon :color="(codecConversion && 'info') || 'success'">
            {{ codecConversion !== null ? "mdi-content-save" : "mdi-plus" }}
          </VIcon>
        </VBtn>
        <VBtn
          icon
          outlined
          v-if="codecConversion"
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
import { mapActions, mapGetters } from "vuex";

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
    };
  },
  created() {
    this.$nextTick(() => {
      if (this.codecConversion) {
        this.fillValues();
      }
    });
  },
  watch: {
    album: function () {
      if (this.codecConversion) {
        this.fillValues();
      }
    },
  },
  computed: {
    ...mapGetters("codecs", ["codecs"]),
  },
  methods: {
    fillValues() {
      this.newCodecConversion.name = this.codecConversion.name;
      this.newCodecConversion.ffmpeg_params = this.codecConversion.ffmpeg_params;
      this.newCodecConversion.resulting_codec_id = this.codecConversion.resulting_codec_id;
    },
    ...mapActions("codecConversions", ["destroy", "update", "create"]),
    saveCodecConversion() {
      if (this.codecConversion === null) {
        this.create(this.newCodecConversion).then((id) => {
          if (id) {
            this.newCodecConversion.name = "";
            this.newCodecConversion.ffmpeg_params = "";
            this.newCodecConversion.resulting_codec_id = null;
          }
        });
      } else {
        this.update({
          id: this.codecConversion.id,
          newCodecConversion: this.newCodecConversion,
        });
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
