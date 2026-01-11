<template>
  <VContainer v-if="genre" class="fill-height" fluid>
    <VRow no-gutters align="center" justify="center">
      <VCol md="4" sm="8" cols="12" @change.once="isDirty = true">
        <VForm v-model="isValid" @submit.prevent="submit">
          <VTextField
            v-model="newGenre.name"
            :label="$t('common.name')"
            :rules="[(v) => !!v || $t('errors.genre.name-blank')]"
            required
          />
          <VBtn :disabled="!isValid" color="primary" class="ma-2" type="submit">
            {{ $t("music.genre.update") }}
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
import { useGenresStore } from "@/store/genres";
import i18n from "@/i18n";

const route = useRoute();
const router = useRouter();
const genresStore = useGenresStore();

const newGenre = ref({ name: "" });
const isDirty = ref(false);
const isValid = ref(true);

const props = defineProps<{ id: string }>();

const genre = computed(() => genresStore.genres[props.id]);
const title = computed(() =>
  i18n.global.t("page-titles.edit", { obj: genre.value?.name ?? "" }),
);
useHead({ title });

onMounted(async () => {
  await genresStore.read(parseInt(props.id));
  fillValues();
});

function fillValues(): void {
  if (genre.value) {
    newGenre.value.name = genre.value.name;
  }
}

async function submit(): Promise<void> {
  if (!genre.value) {
    return;
  }
  const succeeded = await genresStore.update(genre.value.id, newGenre.value);
  if (succeeded) {
    await router.push(
      (route.query.redirect as string | undefined) || { name: "genres" },
    );
  }
}
</script>
