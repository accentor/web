<template>
  <div v-if="isModerator">
    <CodecForm v-for="c of codecs" :key="c.id" :codec="c" />
    <CodecForm />
  </div>
</template>

<script>
// @ts-nocheck
import { mapState } from "pinia";
import CodecForm from "./CodecForm.vue";
import { useAuthStore } from "../store/auth";
import { useCodecsStore } from "../store/codecs";

export default {
  name: "EditCodecs",
  components: { CodecForm },
  data() {
    return {};
  },
  computed: {
    ...mapState(useAuthStore, ["isModerator"]),
    ...mapState(useCodecsStore, { codecs: "allCodecs" }),
  },
};
</script>
