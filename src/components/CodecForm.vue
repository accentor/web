<template>
  <VForm>
    <VLayout>
      <VFlex xs6>
        <VTextField
          v-model="newCodec.extension"
          :label="$t('library.extension')"
          :disabled="codec !== null"
        />
      </VFlex>
      <VFlex xs5>
        <VTextField
          v-model="newCodec.mimetype"
          :label="$t('library.mime-type')"
        />
      </VFlex>
      <VFlex xs1>
        <VBtn
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
      </VFlex>
    </VLayout>
  </VForm>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "CodecForm",
  props: { codec: { default: null, type: Object } },
  data() {
    return {
      newCodec: {
        mimetype: "",
        extension: ""
      }
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
    album: function() {
      if (this.codec) {
        this.fillValues();
      }
    }
  },
  methods: {
    fillValues() {
      this.newCodec.extension = this.codec.extension;
      this.newCodec.mimetype = this.codec.mimetype;
    },
    ...mapActions("codecs", ["destroy", "update", "create"]),
    saveCodec() {
      if (this.codec === null) {
        this.create(this.newCodec).then(id => {
          if (id) {
            this.newCodec.extension = "";
            this.newCodec.mimetype = "";
          }
        });
      } else {
        this.update({ id: this.codec.id, newCodec: this.newCodec });
      }
    },
    deleteCodec() {
      if (confirm(this.$t("common.are-you-sure"))) {
        this.destroy(this.codec.id);
      }
    }
  }
};
</script>
