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
import { mapState } from "pinia";
import CoverFilenameForm from "./CoverFilenameForm.vue";
import { useAuthStore } from "../store/auth";
import { useCoverFilenamesStore } from "../store/cover_filenames";

export default {
  name: "EditCoverFilenames",
  components: { CoverFilenameForm },
  data() {
    return {};
  },
  computed: {
    ...mapState(useCoverFilenamesStore, {
      coverFilenames: "allCoverFilenames",
    }),
    ...mapState(useAuthStore, ["isModerator"]),
  },
};
</script>
