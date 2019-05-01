<template>
  <VBtn color="red" flat icon small @click.stop.prevent="show = true">
    <VIcon>mdi-flag</VIcon>
    <VDialog v-model="show" max-width="600px">
      <VCard>
        <VCardTitle class="headline">Flag for review</VCardTitle>
        <VCardText>
          <VTextField label="Comment" v-model="new_review_comment" />
        </VCardText>
        <VCardActions>
          <VLayout row justify-end>
            <VBtn color="primary" type="submit" @click="flag">
              Flag for review
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
