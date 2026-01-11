<template>
  <VRow no-gutters align="center" justify="center">
    <VCol lg="6" sm="8" cols="12" @change.once="isDirty = true">
      <VAlert
        v-if="album"
        :model-value="album.review_comment !== null"
        type="warning"
        icon="mdi-flag"
        class="mb-4"
      >
        {{ album.review_comment }}
      </VAlert>
      <VForm v-model="isValid" @submit.prevent="submit">
        <VTextField
          v-model="newAlbum.title"
          :label="I18n.t('music.title')"
          :rules="[(v) => !!v || I18n.t('errors.albums.title-blank')]"
          required
        />
        <VDialog v-model="originalModal" persistent max-width="380">
          <template #activator="{ props: dialogProps }">
            <VTextField
              v-model="newAlbum.release"
              :label="I18n.t('music.album.release')"
              readonly
              v-bind="dialogProps"
            ></VTextField>
          </template>
          <VCard>
            <VCardText>
              <VDatePicker
                v-model="originalModalModel"
                scrollable
                :first-day-of-week="1"
              >
              </VDatePicker>
            </VCardText>
            <VCardActions>
              <VSpacer></VSpacer>
              <VBtn
                variant="text"
                color="primary"
                class="ma-2"
                @click="originalModal = false"
              >
                {{ I18n.t("common.cancel") }}
              </VBtn>
              <VBtn
                variant="text"
                color="primary"
                class="ma-2"
                @click="saveOriginalRelease"
              >
                {{ I18n.t("common.ok") }}
              </VBtn>
            </VCardActions>
          </VCard>
        </VDialog>
        <VCheckbox
          v-model="editionInformation"
          :label="I18n.t('music.album.edition-information')"
        />
        <VDialog
          v-if="editionInformation"
          v-model="editionModal"
          persistent
          max-width="380"
        >
          <template #activator="{ props: dialogProps }">
            <VTextField
              v-model="newAlbum.edition"
              :label="I18n.t('music.album.edition')"
              readonly
              clearable
              v-bind="dialogProps"
            ></VTextField>
          </template>
          <VCard>
            <VCardText>
              <VDatePicker
                v-model="editionModalModel"
                scrollable
                :first-day-of-week="1"
              >
              </VDatePicker>
            </VCardText>
            <VCardActions>
              <VSpacer></VSpacer>
              <VBtn
                variant="text"
                color="primary"
                class="ma-2"
                @click="editionModal = false"
              >
                {{ I18n.t("common.cancel") }}
              </VBtn>
              <VBtn
                variant="text"
                color="primary"
                class="ma-2"
                @click="saveEditionRelease"
              >
                {{ I18n.t("common.ok") }}
              </VBtn>
            </VCardActions>
          </VCard>
        </VDialog>
        <VTextField
          v-if="editionInformation"
          v-model="newAlbum.edition_description"
          :label="I18n.t('music.album.edition-description')"
          clearable
        />
        <ImagePicker
          v-model="newAlbum.image"
          :current-img="(album && album.image250) ?? undefined"
          :placeholder="albumSvgUrl"
        />
        <h4 class="text-subtitle-1">{{ I18n.t("music.artists", 2) }}</h4>
        <VRow
          v-for="(item, index) of newAlbum.album_artists"
          :key="`artist-${index}`"
          no-gutters
        >
          <VCol class="flex-column flex-grow-0">
            <VBtn
              icon
              size="small"
              variant="text"
              :disabled="index === 0"
              @click="moveArtist(index, -1)"
              @click.once="isDirty = true"
            >
              <VIcon size="x-large">mdi-menu-up</VIcon>
            </VBtn>
            <VBtn
              icon
              size="small"
              variant="text"
              :disabled="index === newAlbum.album_artists.length - 1"
              @click="moveArtist(index, 1)"
              @click.once="isDirty = true"
            >
              <VIcon size="x-large">mdi-menu-down</VIcon>
            </VBtn>
            <VBtn
              icon
              size="small"
              variant="text"
              @click="removeArtist(index)"
              @click.once="isDirty = true"
            >
              <VIcon size="x-large">mdi-close</VIcon>
            </VBtn>
          </VCol>
          <VCol class="flex-column">
            <VCombobox
              v-model="item.artist_id"
              :items="sortedArtists"
              :custom-filter="filterName"
              item-title="name"
              item-value="id"
              :label="I18n.t('music.artists', 1)"
              return-object
            />
            <VTextField v-model="item.name" :label="I18n.t('common.name')" />
            <VTextField
              v-if="index !== newAlbum.album_artists.length - 1"
              v-model="item.separator"
              :label="I18n.t('music.artist.separator')"
            />
          </VCol>
        </VRow>
        <h4 class="text-subtitle-1">{{ I18n.t("music.labels", 2) }}</h4>
        <VRow
          v-for="(item, index) of newAlbum.album_labels"
          :key="`label-${index}`"
          no-gutters
        >
          <VBtn
            icon
            size="small"
            variant="text"
            @click="removeLabel(index)"
            @click.once="isDirty = true"
          >
            <VIcon size="x-large">mdi-close</VIcon>
          </VBtn>
          <VCol class="flex-column">
            <VCombobox
              v-model="item.label_id"
              :items="sortedLabels"
              :custom-filter="filterName"
              item-title="name"
              item-value="id"
              :label="I18n.t('music.labels', 1)"
              return-object
            />
            <VTextField
              v-model="item.catalogue_number"
              :label="I18n.t('music.label.catnr')"
            />
            <VDivider v-if="index !== newAlbum.album_labels.length - 1" />
          </VCol>
        </VRow>
        <VCheckbox
          v-if="album && album.review_comment !== null"
          v-model="clearReviewComment"
          :label="I18n.t('music.flag.clear', 1)"
        />
        <VRow justify="center" class="my-0">
          <VBtn :disabled="!isValid" color="primary" class="ma-2" type="submit">
            {{
              album
                ? I18n.t("music.album.update")
                : I18n.t("music.album.create")
            }}
          </VBtn>
          <VSpacer />
          <VBtn
            color="success"
            class="ma-2"
            @click="addArtist"
            @click.once="isDirty = true"
          >
            {{ I18n.t("music.artist.add") }}
          </VBtn>
          <VBtn
            color="success"
            class="ma-2"
            @click="addLabel"
            @click.once="isDirty = true"
          >
            {{ I18n.t("music.label.add") }}
          </VBtn>
        </VRow>
      </VForm>
    </VCol>
  </VRow>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { useRoute, useRouter } from "vue-router";
import { useDate } from "vuetify";
import type {
  Album,
  AlbumArtistParams,
  AlbumLabel,
  AlbumParams,
  Artist,
  ImageParams,
  Label,
} from "@accentor/api-client-js";
import ImagePicker from "./ImagePicker.vue";
import { useLabelsStore } from "@/store/labels";
import { useArtistsStore } from "@/store/artists";
import { useAlbumsStore } from "@/store/albums";
import albumSvgUrl from "@mdi/svg/svg/album.svg" with { type: "url" };
import type { InternalItem } from "vuetify/framework";
import { useI18n } from "vue-i18n";

const I18n = useI18n();
const dateAdapter = useDate();
const route = useRoute();
const router = useRouter();
const albumsStore = useAlbumsStore();
const artistsStore = useArtistsStore();
const labelsStore = useLabelsStore();

const props = defineProps<{ album?: Album }>();

const isDirty = ref<boolean>(false);
const isValid = ref<boolean>(true);

const originalModal = ref<boolean>(false);
const originalModalModel = ref<Date>(new Date());

const editionModal = ref<boolean>(false);
const editionModalModel = ref<Date>(new Date());

const newAlbum = ref({
  title: "",
  release: dateAdapter.toISO(originalModalModel.value).substring(0, 10),
  edition: null as string | null,
  edition_description: null as string | null,
  image: null as ImageParams | null,
  review_comment: null as string | null,
  album_artists: [
    {
      artist_id: null as Artist | string | null,
      name: "",
      separator: "",
      order: 0,
    },
  ],
  album_labels: [
    { label_id: null as Label | string | null, catalogue_number: "" },
  ],
});

const clearReviewComment = ref<boolean>(true);
const editionInformation = ref<boolean>(false);

const { artists, artistsByName: sortedArtists } = storeToRefs(artistsStore);
const { labels, labelsByName: sortedLabels } = storeToRefs(labelsStore);

onMounted(async () => {
  if (props.album) {
    await albumsStore.read(props.album.id);
    fillValues();
  }
});

function filterName(
  _value: string,
  queryText: string,
  item?: InternalItem<Artist>,
): boolean {
  if (!item) {
    return false;
  }

  const search = queryText.toLowerCase();
  return (
    item.raw.name.toLowerCase().indexOf(search) > -1 ||
    item.raw.normalized_name.indexOf(search) > -1
  );
}

function fillValues(): void {
  if (!props.album) {
    return;
  }

  newAlbum.value.title = props.album.title;
  newAlbum.value.release = props.album.release;
  newAlbum.value.edition = props.album.edition;
  newAlbum.value.edition_description = props.album.edition_description;
  newAlbum.value.review_comment = props.album.review_comment;
  newAlbum.value.album_artists = props.album.album_artists
    .map((aa) => ({
      artist_id: artists.value[`${aa.artist_id}`] ?? null,
      name: aa.name,
      separator: aa.separator || "",
      order: aa.order,
    }))
    .sort((aa1, aa2) => aa1.order - aa2.order);
  newAlbum.value.album_labels = props.album.album_labels.map((al) => ({
    label_id: labels.value[`${al.label_id}`] ?? null,
    catalogue_number: al.catalogue_number || "",
  }));

  originalModalModel.value = dateAdapter.parseISO(props.album.release) as Date;
  editionModalModel.value = dateAdapter.parseISO(
    props.album.edition || dateAdapter.toISO(new Date()).substring(0, 10),
  ) as Date;
  editionInformation.value =
    props.album.edition !== null || props.album.edition_description !== null;
}

function addLabel(): void {
  newAlbum.value.album_labels.push({ label_id: null, catalogue_number: "" });
}

function removeLabel(index: number): void {
  newAlbum.value.album_labels.splice(index, 1);
}

function addArtist(): void {
  newAlbum.value.album_artists.push({
    artist_id: null,
    name: "",
    separator: "",
    order: 0,
  });
}

function removeArtist(index: number): void {
  newAlbum.value.album_artists.splice(index, 1);
}

function moveArtist(index: number, direction: number): void {
  newAlbum.value.album_artists.splice(
    index + direction,
    0,
    newAlbum.value.album_artists.splice(index, 1)[0]!,
  );
}

function saveEditionRelease(): void {
  newAlbum.value.edition = dateAdapter
    .toISO(editionModalModel.value)
    .substring(0, 10);
  editionModal.value = false;
}

function saveOriginalRelease(): void {
  newAlbum.value.release = dateAdapter
    .toISO(originalModalModel.value)
    .substring(0, 10);
  originalModal.value = false;
}

async function submit(): Promise<void> {
  const transformed: AlbumParams["album"] = {
    title: newAlbum.value.title,
    release: newAlbum.value.release,
    edition:
      (editionInformation.value ? newAlbum.value.edition : undefined) ??
      undefined,
    edition_description:
      (editionInformation.value
        ? newAlbum.value.edition_description
        : undefined) ?? undefined,
    image: newAlbum.value.image ?? undefined,
    review_comment: clearReviewComment.value
      ? undefined
      : (newAlbum.value.review_comment ?? undefined),
    album_artists: [] as AlbumArtistParams[],
    album_labels: [] as AlbumLabel[],
  };

  const mappedLabels = newAlbum.value.album_labels.map(async (al) => {
    if (typeof al.label_id === "string") {
      const id = await labelsStore.create({ name: al.label_id });
      if (id) {
        transformed.album_labels.push({
          label_id: id,
          catalogue_number: al.catalogue_number,
        });
      } else {
        throw new Error("Failed to create label");
      }
    } else {
      transformed.album_labels.push({
        label_id: al.label_id!.id,
        catalogue_number: al.catalogue_number,
      });
    }
  });

  const mappedArtists = newAlbum.value.album_artists.map(async (aa, index) => {
    if (typeof aa.artist_id === "string") {
      const id = await artistsStore.create({
        name: aa.artist_id,
        review_comment: "New artist",
      });
      if (id) {
        transformed.album_artists.push({
          artist_id: id,
          name: aa.name || aa.artist_id,
          separator:
            index !== newAlbum.value.album_artists.length - 1
              ? aa.separator
              : undefined,
          order: index + 1,
        });
      } else {
        throw new Error("Failed to create artist");
      }
    } else if (aa.artist_id) {
      transformed.album_artists.push({
        artist_id: aa.artist_id!.id,
        name: aa.name || aa.artist_id!.name,
        separator:
          index !== newAlbum.value.album_artists.length - 1
            ? aa.separator
            : undefined,
        order: index + 1,
      });
    }
  });

  await Promise.all([...mappedArtists, ...mappedLabels]);

  let pendingResult;
  if (props.album) {
    pendingResult = albumsStore.update(props.album.id, transformed);
  } else {
    pendingResult = albumsStore.create(transformed);
  }

  const succeeded = await pendingResult;
  if (succeeded) {
    await router.push(
      (route.query.redirect as string | undefined) || { name: "albums" },
    );
  }
}
</script>
