<template>
  <div v-if="isModerator">
    <ImageTypeForm v-for="i of imageTypes" :key="i.id" :image-type="i" />
    <ImageTypeForm />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ImageTypeForm from "./ImageTypeForm.vue";

export default {
  name: "EditImageTypes",
  components: { ImageTypeForm },
  data() {
    return {};
  },
  computed: {
    ...mapGetters("imageTypes", ["imageTypes"]),
    ...mapGetters("auth", ["isModerator"]),
  },
};
</script>
