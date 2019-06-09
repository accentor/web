<template>
  <div v-if="isModerator">
    <CoverFilenameForm
      v-for="c of coverFilenames"
      :key="c.id"
      :cover-filename="c"
    />
    <CoverFilenameForm />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import CoverFilenameForm from "./CoverFilenameForm";

export default {
  name: "EditCoverFilenames",
  components: { CoverFilenameForm },
  data() {
    return {};
  },
  computed: {
    ...mapGetters("coverFilenames", ["coverFilenames"]),
    ...mapGetters("auth", ["isModerator"])
  }
};
</script>
