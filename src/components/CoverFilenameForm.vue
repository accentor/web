<template>
  <VForm>
    <VLayout row>
      <VFlex xs5>
        <VTextField
          v-model="newCoverFilename.filename"
          label="Filename"
          :disabled="coverFilename !== null"
        />
      </VFlex>
      <VFlex xs1>
        <VBtn
          icon
          outline
          color="green"
          @click="saveCoverFilename"
          v-if="!coverFilename"
        >
          <VIcon color="green">mdi-plus</VIcon>
        </VBtn>
        <VBtn
          icon
          outline
          v-if="coverFilename"
          color="red"
          @click="deleteCoverFilename"
        >
          <VIcon color="red">mdi-delete</VIcon>
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
      if (confirm("Are you sure?")) {
        this.destroy(this.coverFilename.id);
      }
    }
  }
};
</script>
