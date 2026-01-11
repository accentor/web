<template>
  <div>
    <VContainer v-if="track" class="fill-height" fluid>
      <VRow no-gutters align="center" justify="center">
        <VCol md="6" sm="8" cols="12" @change.once="isDirty = true">
          <VAlert
            :model-value="track.review_comment !== null"
            type="warning"
            icon="mdi-flag"
            class="mb-4"
          >
            {{ track.review_comment }}
          </VAlert>
          <VForm v-if="loaded" v-model="isValid" @submit.prevent="submit">
            <VTextField
              v-model="newTrack.number"
              type="number"
              :label="$t('music.track.number')"
              :rules="rules.number"
              min="0"
              step="1"
            />
            <VTextField
              v-model="newTrack.title"
              :label="$t('music.title')"
              :rules="[(v) => !!v || $t('errors.tracks.title-blank')]"
            />
            <VAutocomplete
              v-model="newTrack.album_id"
              :items="sortedAlbums"
              :custom-filter="filterTitle"
              item-title="title"
              item-value="id"
              :label="$tc('music.albums', 1)"
            >
              <template #item="{ item, props: listItemProps }">
                <VListItem v-bind="listItemProps">
                  <template #append>
                    <span class="text-grey pl-2 text-body-2">
                      {{ item.raw.id }}
                    </span>
                  </template>
                </VListItem>
              </template>
            </VAutocomplete>
            <VCombobox
              v-model="newTrack.genre_ids"
              :items="sortedGenres"
              :custom-filter="filterName"
              chips
              closable-chips
              item-title="name"
              item-value="id"
              :label="$t('music.genre-s')"
              multiple
              return-object
              :rules="rules.genre"
              validate-on="blur"
            />
            <h4 class="text-subtitle-1">{{ $tc("music.artists", 2) }}</h4>
            <TrackFormArtists
              v-model="newTrack.track_artists"
              @update:value.once="isDirty = true"
            />
            <VCheckbox
              v-if="track.review_comment !== null"
              v-model="clear_review_comment"
              :label="$tc('music.flag.clear', 1)"
            />
            <VRow>
              <VBtn
                :disabled="!isValid"
                color="primary"
                class="ma-2"
                type="submit"
              >
                {{ $t("music.track.update") }}
              </VBtn>
              <VSpacer />
              <VBtn
                color="success"
                class="ma-2"
                @click="addArtist"
                @click.once="isDirty = true"
              >
                {{ $t("music.artist.add") }}
              </VBtn>
            </VRow>
          </VForm>
        </VCol>
      </VRow>
    </VContainer>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import TrackFormArtists from "@/components/TrackFormArtists.vue";
import { useGenresStore } from "@/store/genres";
import { useArtistsStore } from "@/store/artists";
import { useAlbumsStore } from "@/store/albums";
import { useTracksStore } from "@/store/tracks";
import { computed, onMounted, ref, watch } from "vue";
import type {
  Artist,
  Genre,
  TrackArtistParams,
  TrackParams,
} from "@accentor/api-client-js";
import { useRoute } from "vue-router";
import i18n from "@/i18n";
import { useHead } from "@unhead/vue";
import router from "@/router";
import type { InternalItem } from "vuetify/framework";
import { TrackArtistRole } from "@accentor/api-client-js";

const albumsStore = useAlbumsStore();
const artistsStore = useArtistsStore();
const genresStore = useGenresStore();
const tracksStore = useTracksStore();
const route = useRoute();

const props = defineProps<{ id: string }>();

const newTrack = ref({
  number: 0,
  title: "",
  album_id: null as number | null,
  review_comment: null as string | null,
  track_artists: [] as (Omit<TrackArtistParams, "artist_id"> & {
    artist_id: Artist | string | null;
  })[],
  genre_ids: [] as (Genre | string)[],
});

const clear_review_comment = ref(true);
const isDirty = ref(false);
const isValid = ref(true);
const loaded = ref(false);

const track = computed(() => tracksStore.tracks[props.id]);
const title = computed(() => {
  return i18n.global.t("page-titles.edit", { obj: track.value?.title ?? "" });
});
useHead({ title });

const { artists } = storeToRefs(artistsStore);
const { genres, genresByName: sortedGenres } = storeToRefs(genresStore);
const { albumsByTitle: sortedAlbums } = storeToRefs(albumsStore);

const rules = computed(() => {
  const rules = {
    number: [
      (v: number | string): true | string =>
        !!v || i18n.global.t("errors.tracks.number-blank"),
      (v: number | string): true | string =>
        Number(v) % 1 === 0 || i18n.global.t("errors.tracks.number-whole"),
    ],
    genre: [] as ((v: (Genre | string)[]) => string | true)[],
  };

  const genreValidation = (v: (Genre | string)[]): true | string => {
    let valid: string | boolean = true;
    v.forEach((newGenre: Genre | string) => {
      if (typeof newGenre === "string") {
        const double = sortedGenres.value.some(
          (g) =>
            g.name === newGenre || g.normalized_name === newGenre.toLowerCase(),
        );
        if (double) {
          valid = i18n.global.t("errors.genre.name-taken-obj", {
            obj: newGenre,
          });
        } else if (!newGenre.trim().length) {
          valid = i18n.global.t("errors.genre.name-blank");
        }
      }
    });
    return valid; // We only return the last error, since we can only display one
  };
  rules.genre.push(genreValidation);

  return rules;
});

watch(track, () => {
  if (track.value && !isDirty.value) {
    loaded.value = true;
    fillValues();
  }
});

onMounted(async () => {
  if (track.value) {
    await tracksStore.read(track.value.id);
    loaded.value = true;
    fillValues();
  }
});

function filterName(
  _value: string,
  queryText: string,
  item?: InternalItem<{ name: string; normalized_name: string }>,
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

function filterTitle(
  _value: string,
  queryText: string,
  item?: InternalItem<{ title: string; normalized_title: string }>,
): boolean {
  if (!item) {
    return false;
  }

  const search = queryText.toLowerCase();
  return (
    item.raw.title.toLowerCase().indexOf(search) > -1 ||
    item.raw.normalized_title.indexOf(search) > -1
  );
}

function addArtist(): void {
  newTrack.value.track_artists.push({
    artist_id: null,
    name: "",
    role: "main" as TrackArtistRole,
    hidden: false,
    order: 0,
  });
}

function fillValues(): void {
  if (!track.value) {
    return;
  }

  newTrack.value.number = track.value.number;
  newTrack.value.title = track.value.title;
  newTrack.value.album_id = track.value.album_id;
  newTrack.value.review_comment = track.value.review_comment;
  newTrack.value.track_artists = track.value.track_artists
    .map((ta) => ({
      artist_id: artists.value[ta.artist_id]!,
      name: ta.name,
      role: ta.role,
      order: ta.order,
      hidden: ta.hidden,
    }))
    .sort((a1, a2) => a1.order - a2.order);
  newTrack.value.genre_ids = track.value.genre_ids.map(
    (id) => genres.value[`${id}`]!,
  );
}

async function submit(): Promise<void> {
  if (!track.value) {
    return;
  }

  const transformed: TrackParams["track"] = {
    number: newTrack.value.number!,
    title: newTrack.value.title!,
    album_id: newTrack.value.album_id!,
    review_comment:
      (clear_review_comment.value
        ? undefined
        : newTrack.value.review_comment) ?? undefined,
    genre_ids: [],
    track_artists: [],
  };

  const mappedGenres = newTrack.value.genre_ids.map(async (genre_id) => {
    if (typeof genre_id === "string") {
      const id = await genresStore.create({ name: genre_id });
      if (id) {
        transformed.genre_ids.push(id);
      } else {
        throw new Error("Could not create genre");
      }
    } else {
      transformed.genre_ids.push(genre_id.id);
    }
  });

  const mappedArtists = newTrack.value.track_artists.map(async (ta, index) => {
    if (typeof ta.artist_id === "string") {
      const id = await artistsStore.create({
        name: ta.artist_id,
        review_comment: "New artist",
      });
      if (id) {
        transformed.track_artists.push({
          artist_id: id,
          name: ta.name || ta.artist_id,
          role: ta.role,
          hidden: ta.hidden,
          order: index + 1,
        });
      } else {
        throw new Error("Could not create artist");
      }
    } else if (ta.artist_id) {
      transformed.track_artists.push({
        artist_id: ta.artist_id.id,
        name: ta.name || ta.artist_id.name,
        role: ta.role,
        hidden: ta.hidden,
        order: index + 1,
      });
    }
  });

  await Promise.all([...mappedGenres, ...mappedArtists]);
  const succeeded = await tracksStore.update(track.value.id, transformed);
  if (succeeded) {
    await router.push((route.query.redirect as string) || { name: "tracks" });
  }
}
</script>
