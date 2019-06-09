<template>
  <VForm>
    <VLayout row>
      <VFlex xs6>
        <VTextField
          v-model="newCodec.extension"
          label="Extension"
          :disabled="codec !== null"
        />
      </VFlex>
      <VFlex xs5>
        <VTextField v-model="newCodec.mimetype" label="MIME type" />
      </VFlex>
      <VFlex xs1>
        <VBtn
          icon
          outline
          :color="(codec && 'blue') || 'green'"
          @click="saveCodec"
        >
          <VIcon :color="(codec && 'blue') || 'green'">
            {{ codec !== null ? "mdi-content-save" : "mdi-plus" }}
          </VIcon>
        </VBtn>
        <VBtn icon outline v-if="codec" color="red" @click="deleteCodec">
          <VIcon color="red">mdi-delete</VIcon>
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
      if (confirm("Are you sure?")) {
        this.destroy(this.codec.id);
      }
    }
  }
};
</script>
