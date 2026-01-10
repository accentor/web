<template>
  <VContainer v-if="label" class="fill-height" fluid>
    <VRow no-gutters align="center" justify="center">
      <VCol md="4" sm="8" cols="12" @change.once="isDirty = true">
        <VForm v-model="isValid" @submit.prevent="submit">
          <VTextField
            v-model="newLabel.name"
            :label="$t('common.name')"
            :rules="[(v) => !!v || $t('errors.label.name-blank')]"
            required
          />
          <VBtn :disabled="!isValid" color="primary" class="ma-2" type="submit">
            {{ $t("music.label.update") }}
          </VBtn>
        </VForm>
      </VCol>
    </VRow>
  </VContainer>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useHead } from "@unhead/vue";
import { useLabelsStore } from "@/store/labels";
import i18n from "@/i18n";

const route = useRoute();
const router = useRouter();
const labelsStore = useLabelsStore();

const newLabel = ref({ name: "" });
const isDirty = ref(false);
const isValid = ref(true);

const props = defineProps<{ id: string }>();

const label = computed(() => labelsStore.labels[props.id]);
const title = computed(() =>
  i18n.global.t("page-titles.edit", { obj: label.value?.name ?? "" }),
);
useHead({ title });

function fillValues(): void {
  newLabel.value.name = label.value?.name ?? "";
}

onMounted(async () => {
  await labelsStore.read(parseInt(props.id));
  fillValues();
});

async function submit(): Promise<void> {
  if (!label.value) {
    return;
  }
  const succeeded = await labelsStore.update(label.value.id, newLabel.value);
  if (succeeded) {
    await router.push(
      (route.query.redirect as string | undefined) ?? { name: "labels" },
    );
  }
}
</script>
