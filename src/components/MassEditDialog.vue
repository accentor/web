<template>
  <VDialog v-model="dialog" fullscreen scrollable>
    <template #activator="{ props: dialogProps }">
      <VBtn
        color="warning"
        class="ma-2"
        :disabled="tracks.length === 0"
        v-bind="dialogProps"
      >
        {{
          I18n.t(
            "music.mass.edit-tracks",
            { count: tracks.length },
            tracks.length,
          )
        }}
      </VBtn>
    </template>
    <VCard>
      <VToolbar color="primary" class="flex-grow-0">
        <VBtn icon @click="dialog = false">
          <VIcon>mdi-close</VIcon>
        </VBtn>
        <VToolbarTitle>
          {{
            I18n.t(
              "music.mass.edit-tracks",
              { count: tracks.length },
              tracks.length,
            )
          }}
        </VToolbarTitle>
        <VSpacer></VSpacer>
        <VToolbarItems>
          <VBtn icon :disabled="saving" @click="saveTracks">
            <VIcon>
              {{ saving ? "mdi-refresh mdi-spin" : "mdi-content-save" }}
            </VIcon>
          </VBtn>
        </VToolbarItems>
      </VToolbar>
      <div style="overflow-y: auto; backface-visibility: hidden">
        <VForm ref="form" v-model="isValid" @submit.prevent="saveTracks">
          <VContainer>
            <Errors />
            <VContainer
              v-if="tracksWithReviewComments.length > 0"
              key="showReviewComments"
              fluid
            >
              <VRow dense>
                <VCol cols="12">
                  <VCheckbox v-model="showReviewComments">
                    <template #label>
                      <span>
                        {{
                          I18n.t(
                            "music.flag.show",
                            { count: tracksWithReviewComments.length },
                            tracksWithReviewComments.length,
                          )
                        }}
                      </span>
                    </template>
                  </VCheckbox>
                </VCol>
              </VRow>
              <VRow v-if="showReviewComments">
                <VCol cols="12">
                  <VAlert :model-value="true" type="warning" icon="mdi-flag">
                    <table class="review-comments">
                      <tr v-for="t of tracksWithReviewComments" :key="t.id">
                        <td class="review-comments__cell text-right">
                          <strong>{{ t.number }}</strong>
                        </td>
                        <td class="review-comments__cell">
                          <strong>{{ t.title }}</strong>
                        </td>
                        <td class="review-comments__cell">
                          {{ t.review_comment }}
                        </td>
                      </tr>
                    </table>
                  </VAlert>
                </VCol>
              </VRow>
            </VContainer>
            <VDivider v-if="tracksWithReviewComments.length > 0" />
            <VContainer key="increaseTrackNumbers" fluid>
              <VRow dense>
                <VCol cols="12" sm="6">
                  <VCheckbox v-model="number.enabled">
                    <template #label>
                      <span>
                        {{ I18n.t("music.mass.increase-track") }}
                      </span>
                    </template>
                  </VCheckbox>
                </VCol>
                <VCol cols="12" sm="6">
                  <VNumberInput
                    v-if="number.enabled"
                    v-model="number.amount"
                    control-variant="stacked"
                    :label="I18n.t('common.amount')"
                    inset
                    :step="1"
                    :hide-details="true"
                  />
                </VCol>
              </VRow>
            </VContainer>
            <VDivider />
            <VContainer key="searchAndReplaceTitle" fluid>
              <VRow dense>
                <VCol cols="12" sm="6">
                  <VCheckbox v-model="titleReplacement.enabled">
                    <template #label>
                      <span>
                        {{ I18n.t("music.mass.title-search") }}
                      </span>
                    </template>
                  </VCheckbox>
                </VCol>
                <VCol cols="12" sm="6">
                  <VCheckbox
                    v-if="titleReplacement.enabled"
                    v-model="titleReplacement.regex"
                    :label="I18n.t('music.mass.regex')"
                  />
                </VCol>
              </VRow>
              <VRow v-if="titleReplacement.enabled">
                <VCol cols="12" sm="6">
                  <VTextField
                    v-model="titleReplacement.search"
                    :label="I18n.t('common.search')"
                  />
                </VCol>
                <VCol cols="12" sm="6">
                  <VTextField
                    v-model="titleReplacement.replace"
                    :label="I18n.t('common.replace')"
                  />
                </VCol>
              </VRow>
            </VContainer>
            <VDivider />
            <VContainer key="setAlbum" fluid>
              <VRow dense>
                <VCol cols="12" sm="6">
                  <VCheckbox v-model="album.enabled">
                    <template #label>
                      <span>
                        {{ I18n.t("music.mass.set-album") }}
                      </span>
                    </template>
                  </VCheckbox>
                </VCol>
                <VCol cols="12" sm="6">
                  <VAutocomplete
                    v-if="album.enabled"
                    v-model="album.album"
                    :items="sortedAlbums"
                    :custom-filter="filterTitle"
                    item-value="id"
                    item-title="title"
                    label="Album"
                    :hide-details="true"
                    :rules="rules.album"
                    return-object
                  >
                    <template #item="{ item, props: listItemProps }">
                      <VListItem v-bind="listItemProps">
                        <template #append>
                          <span class="text-grey pl-2 text-body-2">
                            {{ item.value }}
                          </span>
                        </template>
                      </VListItem>
                    </template>
                  </VAutocomplete>
                </VCol>
              </VRow>
            </VContainer>
            <VDivider />
            <VContainer key="changeGenres" fluid>
              <VRow dense>
                <VCol cols="12" sm="6">
                  <VCheckbox v-model="changeGenres.enabled">
                    <template #label>
                      <span>
                        {{ I18n.t("music.mass.change-genres") }}
                      </span>
                    </template>
                  </VCheckbox>
                </VCol>
                <VCol cols="12" sm="6">
                  <VCheckbox
                    v-if="changeGenres.enabled"
                    v-model="changeGenres.replace"
                    :label="I18n.t('music.mass.replace-instead-genres')"
                  />
                </VCol>
              </VRow>
              <VRow v-if="changeGenres.enabled">
                <VCol cols="12" sm="6">
                  <VCombobox
                    v-model="changeGenres.genres"
                    :items="sortedGenres"
                    :custom-filter="filterName"
                    chips
                    closable-chips
                    item-title="name"
                    item-value="id"
                    :label="I18n.t('music.genre-s')"
                    multiple
                    return-object
                    :rules="rules.genre"
                    validate-on="blur"
                  />
                </VCol>
              </VRow>
            </VContainer>
            <VDivider />
            <VContainer key="changeArtists" fluid>
              <VRow dense>
                <VCol cols="12" sm="6">
                  <VCheckbox v-model="changeArtists.enabled">
                    <template #label>
                      <span>
                        {{ I18n.t("music.mass.change-artists") }}
                      </span>
                    </template>
                  </VCheckbox>
                </VCol>
                <VCol cols="12" sm="6">
                  <VCheckbox
                    v-if="changeArtists.enabled"
                    v-model="changeArtists.replace"
                    :label="I18n.t('music.mass.replace-instead-artists')"
                  />
                </VCol>
              </VRow>
              <TrackFormArtists
                v-if="changeArtists.enabled"
                v-model="changeArtists.trackArtists"
              />
              <VBtn
                v-if="changeArtists.enabled"
                color="success"
                class="ma-2"
                @click="addArtist"
              >
                {{ I18n.t("music.artist.add") }}
              </VBtn>
            </VContainer>
            <VDivider v-if="tracksWithReviewComments.length > 0" />
            <VContainer
              v-if="tracksWithReviewComments.length > 0"
              key="clearReviewComments"
              fluid
            >
              <VRow dense>
                <VCol cols="12" sm="6">
                  <VCheckbox v-model="clearReviewComments">
                    <template #label>
                      <span>
                        {{
                          I18n.t(
                            "music.flag.clear",
                            tracksWithReviewComments.length,
                          )
                        }}
                      </span>
                    </template>
                  </VCheckbox>
                </VCol>
              </VRow>
            </VContainer>
          </VContainer>
        </VForm>
      </div>
    </VCard>
  </VDialog>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import Errors from "./Errors.vue";
import TrackFormArtists from "./TrackFormArtists.vue";
import { useGenresStore } from "@/store/genres";
import { useArtistsStore } from "@/store/artists";
import { useAlbumsStore } from "@/store/albums";
import { useTracksStore } from "@/store/tracks";
import type {
  Album,
  Artist,
  Genre,
  Track,
  TrackArtistParams,
  TrackArtistRole,
} from "@accentor/api-client-js";
import { computed, ref, useTemplateRef } from "vue";
import type { InternalItem } from "vuetify/framework";
import { compareTracks } from "@/util";
import { useI18n } from "vue-i18n";

const I18n = useI18n();
const albumsStore = useAlbumsStore();
const artistsStore = useArtistsStore();
const genresStore = useGenresStore();
const tracksStore = useTracksStore();

const props = withDefaults(defineProps<{ tracks?: Track[] }>(), {
  tracks: () => [],
});
const emit = defineEmits<{ close: [] }>();

const dialog = ref(false);
const titleReplacement = ref({
  enabled: false,
  search: "",
  replace: "",
  regex: false,
});
const changeArtists = ref({
  enabled: false,
  replace: false,
  trackArtists: [
    {
      artist_id: null as Artist | string | null,
      name: "",
      role: "main" as TrackArtistRole,
      hidden: false,
    },
  ],
});
const changeGenres = ref({
  enabled: false,
  replace: false,
  genres: [] as (Genre | string)[],
});
const album = ref({ enabled: false, album: null as Album | null });
const number = ref({ enabled: false, amount: 0 });
const clearReviewComments = ref(false);
const showReviewComments = ref(false);
const saving = ref(false);
const isValid = ref(true);

const { albums, albumsByTitle: sortedAlbums } = storeToRefs(albumsStore);
const { genresByName: sortedGenres } = storeToRefs(genresStore);

const sortedTracks = computed(() =>
  [...props.tracks].sort(compareTracks(albums.value)),
);
const tracksWithReviewComments = computed(() =>
  sortedTracks.value.filter((t) => t.review_comment !== null),
);

const rules = computed(() => {
  const result = {
    genre: [] as ((v: (Genre | string)[]) => true | string)[],
    album: [] as ((v: Album | undefined) => true | string)[],
  };

  const genreValidation = (v: (string | Genre)[]): true | string => {
    let valid: true | string = true;
    v.forEach((newGenre) => {
      if (typeof newGenre === "string") {
        const double = genresStore.genresByName.some(
          (g) =>
            g.name === newGenre || g.normalized_name === newGenre.toLowerCase(),
        );
        if (double) {
          valid = I18n.t("errors.genre.name-taken-obj", {
            obj: newGenre,
          });
        } else if (!newGenre.trim().length) {
          valid = I18n.t("errors.genre.name-blank");
        }
      }
    });
    // We only return the last error, since we can only display one
    return valid;
  };
  if (changeGenres.value.enabled) {
    result.genre.push(genreValidation);
  }
  if (album.value.enabled) {
    result.album.push(
      (v: Album | undefined): true | string =>
        !!v || I18n.t("errors.albums.album-blank"),
    );
  }

  return result;
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
    item.raw.name.toLowerCase().indexOf(search) >= 0 ||
    item.raw.normalized_name.indexOf(search) >= 0
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
    item.raw.title.toLowerCase().indexOf(search) >= 0 ||
    item.raw.normalized_title.indexOf(search) >= 0
  );
}

const form = useTemplateRef("form");

async function saveTracks(): Promise<void> {
  await form.value!.validate();
  if (!isValid.value) {
    return;
  }

  saving.value = true;
  const transformedArtists = [] as TrackArtistParams[];
  const transformedGenres = [] as number[];
  const pendingResults = [];

  if (changeArtists.value.enabled) {
    pendingResults.push(
      ...changeArtists.value.trackArtists.map(async (ta, index) => {
        if (typeof ta.artist_id === "string") {
          const id = await artistsStore.create({
            name: ta.artist_id,
            review_comment: "New artist",
          });
          if (id) {
            transformedArtists.push({
              artist_id: id,
              name: ta.name || ta.artist_id,
              role: ta.role,
              hidden: ta.hidden,
              order: index + 1,
            });
          } else {
            throw new Error("Failed to create new artist");
          }
        } else if (ta.artist_id) {
          transformedArtists.push({
            artist_id: ta.artist_id.id,
            name: ta.name || ta.artist_id.name,
            role: ta.role,
            hidden: ta.hidden,
            order: index + 1,
          });
        }
      }),
    );
  }

  if (changeGenres.value.enabled) {
    pendingResults.push(
      ...changeGenres.value.genres.map(async (genreId) => {
        if (typeof genreId === "string") {
          const id = await genresStore.create({ name: genreId });
          if (id) {
            transformedGenres.push(id);
          } else {
            throw new Error("Failed to create new genre");
          }
        } else {
          transformedGenres.push(genreId.id);
        }
      }),
    );
  }

  await Promise.all(pendingResults);

  const mappedTracks = props.tracks.map(async (t) => {
    const transformed = {
      number: t.number,
      title: t.title,
      album_id: t.album_id,
      review_comment: clearReviewComments.value ? null : t.review_comment,
      genre_ids: [...t.genre_ids],
      track_artists: [...t.track_artists] as TrackArtistParams[],
    };

    if (number.value.enabled) {
      transformed.number += number.value.amount;
    }

    if (titleReplacement.value.enabled) {
      if (titleReplacement.value.regex) {
        transformed.title = transformed.title.replace(
          new RegExp(titleReplacement.value.search),
          titleReplacement.value.replace,
        );
      } else {
        transformed.title = transformed.title.replace(
          titleReplacement.value.search,
          titleReplacement.value.replace,
        );
      }
    }

    if (changeArtists.value.enabled) {
      if (changeArtists.value.replace) {
        transformed.track_artists = transformedArtists;
      } else {
        transformedArtists.forEach((a) => {
          const index = transformed.track_artists.findIndex(
            (ta) =>
              ta.name === a.name &&
              ta.role === a.role &&
              ta.artist_id === a.artist_id,
          );
          if (index === -1) {
            a.order += t.track_artists.length;
            transformed.track_artists.push(a);
          } else {
            transformed.track_artists[index]!.hidden = a.hidden;
          }
        });
      }
    }

    if (changeGenres.value.enabled) {
      if (changeGenres.value.replace) {
        transformed.genre_ids = transformedGenres;
      } else {
        transformedGenres.forEach((g) => {
          if (!transformed.genre_ids.includes(g)) {
            transformed.genre_ids.push(g);
          }
        });
      }
    }

    if (album.value.enabled) {
      transformed.album_id = album.value.album!.id;
    }

    await tracksStore.update(t.id, transformed);
  });

  await Promise.all(mappedTracks);
  dialog.value = false;
  resetState();
  saving.value = false;
  emit("close");
}

function addArtist(): void {
  changeArtists.value.trackArtists.push({
    artist_id: null,
    name: "",
    role: "main" as TrackArtistRole,
    hidden: false,
  });
}

function resetState(): void {
  titleReplacement.value = {
    enabled: false,
    search: "",
    replace: "",
    regex: false,
  };
  changeArtists.value = { enabled: false, replace: false, trackArtists: [] };
  changeGenres.value = { enabled: false, replace: false, genres: [] };
  album.value = { enabled: false, album: null };
  number.value = { enabled: false, amount: 0 };
  clearReviewComments.value = false;
  showReviewComments.value = false;
}
</script>

<style lang="scss" scoped>
.review-comments {
  &__cell {
    padding: 0 0.5rem;
  }
}
</style>
