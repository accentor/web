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

export default {
  name: "EditCodecConversions",
  components: { CodecConversionForm },
  data() {
    return {};
  },
  computed: {
    ...mapGetters("codecConversions", ["codecConversions"]),
    ...mapGetters("auth", ["isModerator"]),
  },
};
</script>
