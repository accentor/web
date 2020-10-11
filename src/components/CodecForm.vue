<template>
  <VForm v-model="isValid" ref="form" lazy-validation>
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
          outlined
          :color="(codec && 'info') || 'success'"
          class="ma-2"
          @click="saveCodec"
        >
          <VIcon :color="(codec && 'info') || 'success'">
            {{ codec !== null ? "mdi-content-save" : "mdi-plus" }}
          </VIcon>
        </VBtn>
        <VBtn
          icon
          outlined
          v-if="codec"
          color="danger"
          class="ma-2"
          @click="deleteCodec"
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
  name: "CodecForm",
  props: { codec: { default: null, type: Object } },
  data() {
    return {
      newCodec: {
        mimetype: "",
        extension: "",
      },
      isValid: true,
    };
  },
  created() {
    this.$nextTick(() => {
      if (this.codec) {
        this.fillValues();
      }
    });
  },
  watch: {
    album: function () {
      if (this.codec) {
        this.fillValues();
      }
    },
  },
  computed: {
    ...mapGetters("codecs", ["codecs"]),
    rules() {
      const rules = {
        ext: [(v) => !!v || this.$t("errors.codec.ext-blank")],
      };
      if (this.codec === null) {
        const extTaken = (v) => {
          const double = this.codecs.some((cc) => cc.extension === v);
          return !double || this.$t("errors.codec.ext-taken");
        };
        rules.ext.push(extTaken);
      }

      return rules;
    },
  },
  methods: {
    fillValues() {
      this.newCodec.extension = this.codec.extension;
      this.newCodec.mimetype = this.codec.mimetype;
    },
    ...mapActions("codecs", ["destroy", "update", "create"]),
    async saveCodec() {
      if (this.$refs.form.validate()) {
        if (this.codec === null) {
          const id = await this.create(this.newCodec);
          if (id) {
            this.newCodec.extension = "";
            this.newCodec.mimetype = "";
          }
        } else {
          this.update({ id: this.codec.id, newCodec: this.newCodec });
        }
      }
    },
    deleteCodec() {
      if (confirm(this.$t("common.are-you-sure"))) {
        this.destroy(this.codec.id);
      }
    },
  },
};
</script>
