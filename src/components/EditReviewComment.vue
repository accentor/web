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

<script setup lang="ts">
import { ref } from "vue";

interface Props {
  item: { id: number; review_comment: string | null };
  update: (id: number, newReviewComment: string) => Promise<boolean>;
}
const props = defineProps<Props>();

const show = ref<boolean>(false);
const newReviewComment = ref<string>(props.item.review_comment || "");

async function flag(): Promise<void> {
  const succeeded = await props.update(props.item.id, newReviewComment.value);
  if (succeeded) {
    show.value = false;
  }
}
</script>
