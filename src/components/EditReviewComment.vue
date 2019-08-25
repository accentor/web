<template>
  <VBtn
    color="flag"
    class="ma-2"
    text
    icon
    small
    @click.stop.prevent="show = true"
  >
    <VIcon>mdi-flag</VIcon>
    <VDialog v-model="show" max-width="600px">
      <VCard>
        <VCardTitle class="headline">
          {{ $t("music.flag.for-review") }}
        </VCardTitle>
        <VCardText>
          <VTextField
            :label="$t('music.flag.comment')"
            v-model="new_review_comment"
          />
        </VCardText>
        <VCardActions>
          <VLayout justify-end>
            <VBtn color="primary" class="ma-2" type="submit" @click="flag">
              {{ $t("music.flag.for-review") }}
            </VBtn>
          </VLayout>
        </VCardActions>
      </VCard>
    </VDialog>
  </VBtn>
</template>
<script>
export default {
  name: "EditReviewComment",
  data() {
    return {
      show: false,
      new_review_comment: ""
    };
  },
  props: {
    update: {},
    item: {}
  },
  created() {
    this.new_review_comment = this.item.review_comment;
  },
  methods: {
    flag() {
      this.update(this.item.id, this.new_review_comment).then(succeeded => {
        if (succeeded) {
          this.show = false;
        }
      });
    }
  }
};
</script>
