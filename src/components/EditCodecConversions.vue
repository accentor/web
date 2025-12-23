<template>
  <div v-if="isModerator">
    <CodecConversionForm
      v-for="c of codecConversions"
      :key="c.id"
      :codec-conversion="c"
    />
    <CodecConversionForm />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import CodecConversionForm from "./CodecConversionForm.vue";
import { useAuthStore } from "../store/auth";
import { mapState } from "pinia";

export default {
  name: "EditCodecConversions",
  components: { CodecConversionForm },
  data() {
    return {};
  },
  computed: {
    ...mapGetters("codecConversions", ["codecConversions"]),
    ...mapState(useAuthStore, ["isModerator"]),
  },
};
</script>
