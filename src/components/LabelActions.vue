<template>
  <span>
    <VBtn
      :to="{
        name: 'edit-label',
        params: { id: label.id },
        query: { redirect: $route.fullPath }
      }"
      v-if="isModerator"
      color="orange"
      flat
      icon
      small
    >
      <VIcon>mdi-pencil</VIcon>
    </VBtn>
    <VBtn
      @click.stop.prevent="deleteLabel"
      v-if="isModerator"
      color="red"
      href="#"
      flat
      icon
      small
    >
      <VIcon>mdi-delete</VIcon>
    </VBtn>
  </span>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "LabelActions",
  props: {
    label: {}
  },
  computed: {
    ...mapGetters("auth", ["isModerator"])
  },
  methods: {
    ...mapActions("labels", ["destroy"]),
    deleteLabel: function() {
      if (confirm(this.$t("common.are-you-sure"))) {
        this.destroy(this.label.id);
      }
    }
  }
};
</script>
