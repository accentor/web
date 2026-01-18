<template>
  <VRow no-gutters align="center" justify="center">
    <VCol lg="6" sm="8" cols="12" @change.once="isDirty = true">
      <VAlert
        v-if="artist"
        :model-value="artist.review_comment !== null"
        type="warning"
        icon="mdi-flag"
        class="mb-4"
      >
        {{ artist.review_comment }}
      </VAlert>
      <VForm v-model="isValid" @submit.prevent="submit">
        <VTextField
          v-model="newArtist.name"
          :label="I18n.t('common.name')"
          :rules="[(v) => !!v || I18n.t('errors.artists.name-blank')]"
          required
        />
        <ImagePicker
          v-model="newArtist.image"
          :current-img="(artist && artist.image250) ?? undefined"
          :placeholder="artistSvgUrl"
        />
        <VCheckbox
          v-if="artist && artist.review_comment !== null"
          v-model="clearReviewComment"
          :label="I18n.t('music.flag.clear', 1)"
        />
        <VBtn :disabled="!isValid" color="primary" class="ma-2" type="submit">
          {{
            artist ? I18n.t("music.artist.update") : I18n.t("music.artist.add")
          }}
        </VBtn>
      </VForm>
    </VCol>
  </VRow>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import type {
  Artist,
  ArtistParams,
  ImageParams,
} from "@accentor/api-client-js";
import artistSvgUrl from "@mdi/svg/svg/account-music.svg" with { type: "url" };
import ImagePicker from "./ImagePicker.vue";
import { useArtistsStore } from "@/store/artists";
import { useI18n } from "vue-i18n";

const I18n = useI18n();
const route = useRoute();
const router = useRouter();
const artistsStore = useArtistsStore();
const props = defineProps<{ artist?: Artist }>();
const clearReviewComment = ref(true);
const isDirty = ref(false);
const isValid = ref(true);
const newArtist = ref({
  name: "",
  image: null as ImageParams | null,
  review_comment: undefined as string | undefined,
});

onMounted(async () => {
  if (props.artist) {
    await artistsStore.read(props.artist.id);
    fillValues();
  }
});

function fillValues(): void {
  if (props.artist) {
    newArtist.value.name = props.artist.name;
    newArtist.value.review_comment = props.artist.review_comment ?? undefined;
  }
}

async function submit(): Promise<void> {
  const transformed: ArtistParams["artist"] = {
    name: newArtist.value.name,
    image: newArtist.value.image ?? undefined,
    review_comment: clearReviewComment.value
      ? null
      : newArtist.value.review_comment,
  };
  let pendingResult;
  if (props.artist) {
    pendingResult = artistsStore.update(props.artist.id, transformed);
  } else {
    pendingResult = artistsStore.create(transformed);
  }
  const succeeded = await pendingResult;
  if (succeeded) {
    await router.push(
      (route.query.redirect as string | undefined) || { name: "artists" },
    );
  }
}
</script>
