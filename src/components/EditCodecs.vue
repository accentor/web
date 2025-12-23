<template>
  <div v-if="isModerator">
    <CodecForm v-for="c of codecs" :key="c.id" :codec="c" />
    <CodecForm />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import CodecForm from "./CodecForm.vue";
import { useAuthStore } from "../store/auth";
import { mapState } from "pinia";

export default {
  name: "EditCodecs",
  components: { CodecForm },
  data() {
    return {};
  },
  computed: {
    ...mapGetters("codecs", ["codecs"]),
    ...mapState(useAuthStore, ["isModerator"]),
  },
};
</script>
