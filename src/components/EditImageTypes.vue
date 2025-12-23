<template>
  <div v-if="isModerator">
    <ImageTypeForm v-for="i of imageTypes" :key="i.id" :image-type="i" />
    <ImageTypeForm />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ImageTypeForm from "./ImageTypeForm.vue";
import { useAuthStore } from "../store/auth";
import { mapState } from "pinia";

export default {
  name: "EditImageTypes",
  components: { ImageTypeForm },
  data() {
    return {};
  },
  computed: {
    ...mapGetters("imageTypes", ["imageTypes"]),
    ...mapState(useAuthStore, ["isModerator"]),
  },
};
</script>
