<template>
  <span>
    <VBtn
      :to="{
        name: 'edit-label',
        params: { id: label.id },
        query: { redirect: $route.fullPath },
      }"
      v-if="isModerator"
      color="edit"
      class="ma-2"
      text
      icon
      small
    >
      <VIcon>mdi-pencil</VIcon>
    </VBtn>
    <VBtn
      @click.stop.prevent="deleteLabel"
      v-if="isModerator"
      color="danger"
      class="ma-2"
      href="#"
      text
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
    label: {},
  },
  computed: {
    ...mapGetters("auth", ["isModerator"]),
  },
  methods: {
    ...mapActions("labels", ["destroy"]),
    deleteLabel: function () {
      if (confirm(this.$t("common.are-you-sure"))) {
        this.destroy(this.label.id);
      }
    },
  },
};
</script>
