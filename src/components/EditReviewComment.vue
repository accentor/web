<template>
  <VBtn
    color="error"
    variant="text"
    icon
    size="small"
    @click.stop.prevent="show = true"
  >
    <VIcon size="x-large">mdi-flag</VIcon>
    <VDialog v-model="show" max-width="600px">
      <VCard>
        <VCardTitle class="text-h5">
          {{ $t("music.flag.for-review") }}
        </VCardTitle>
        <VCardText>
          <VTextField
            v-model="newReviewComment"
            :label="$t('music.flag.comment')"
          />
        </VCardText>
        <VCardActions>
          <VRow justify="end" class="my-0">
            <VBtn color="primary" class="ma-2" type="submit" @click="flag">
              {{ $t("music.flag.for-review") }}
            </VBtn>
          </VRow>
        </VCardActions>
      </VCard>
    </VDialog>
  </VBtn>
</template>
<script>
export default {
  name: "EditReviewComment",
  props: {
    update: {
      type: Function,
      required: true,
    },
    item: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      show: false,
      newReviewComment: "",
    };
  },
  created() {
    this.newReviewComment = this.item.review_comment;
  },
  methods: {
    async flag() {
      const succeeded = await this.update(this.item.id, this.newReviewComment);
      if (succeeded) {
        this.show = false;
      }
    },
  },
};
</script>
