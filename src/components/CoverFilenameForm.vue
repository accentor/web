<template>
  <VForm>
    <VLayout>
      <VFlex xs5>
        <VTextField
          v-model="newCoverFilename.filename"
          :label="$t('library.filename')"
          :disabled="coverFilename !== null"
        />
      </VFlex>
      <VFlex xs2 sm1>
        <VBtn
          icon
          outlined
          color="success"
          class="ma-2"
          @click="saveCoverFilename"
          v-if="!coverFilename"
        >
          <VIcon color="success">mdi-plus</VIcon>
        </VBtn>
        <VBtn
          icon
          outlined
          v-if="coverFilename"
          color="danger"
          class="ma-2"
          @click="deleteCoverFilename"
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
  name: "CoverFilenameForm",
  props: { coverFilename: { default: null, type: Object } },
  data() {
    return {
      newCoverFilename: {
        filename: ""
      }
    };
  },
  created() {
    this.$nextTick(() => {
      if (this.coverFilename) {
        this.fillValues();
      }
    });
  },
  watch: {
    album: function() {
      if (this.coverFilename) {
        this.fillValues();
      }
    }
  },
  methods: {
    fillValues() {
      this.newCoverFilename.filename = this.coverFilename.filename;
    },
    ...mapActions("coverFilenames", ["destroy", "update", "create"]),
    saveCoverFilename() {
      this.create(this.newCoverFilename).then(id => {
        if (id) {
          this.newCoverFilename.filename = "";
        }
      });
    },
    deleteCoverFilename() {
      if (confirm(this.$t("common.are-you-sure"))) {
        this.destroy(this.coverFilename.id);
      }
    }
  }
};
</script>
