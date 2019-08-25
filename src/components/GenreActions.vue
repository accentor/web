<template>
  <span>
    <VBtn
      :to="{
        name: 'edit-genre',
        params: { id: genre.id },
        query: { redirect: $route.fullPath }
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
    genre: {}
  },
  computed: {
    ...mapGetters("auth", ["isModerator"])
  },
  methods: {
    ...mapActions("genres", ["destroy"]),
    deleteLabel: function() {
      if (confirm(this.$t("common.are-you-sure"))) {
        this.destroy(this.genre.id);
      }
    }
  }
};
</script>
