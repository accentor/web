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
          :label="$t('music.title')"
          :rules="[(v) => !!v || $t('errors.albums.title-blank')]"
          required
        />
        <VDialog v-model="originalModal" persistent max-width="380">
          <template #activator="{ props }">
            <VTextField
              v-model="newAlbum.release"
              :label="$t('music.album.release')"
              readonly
              v-bind="props"
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
                {{ $t("common.cancel") }}
              </VBtn>
              <VBtn
                variant="text"
                color="primary"
                class="ma-2"
                @click="saveOriginalRelease"
              >
                {{ $t("common.ok") }}
              </VBtn>
            </VCardActions>
          </VCard>
        </VDialog>
        <VCheckbox
          v-model="editionInformation"
          :label="$t('music.album.edition-information')"
        />
        <VDialog
          v-if="editionInformation"
          v-model="editionModal"
          persistent
          max-width="380"
        >
          <template #activator="{ props }">
            <VTextField
              v-model="newAlbum.edition"
              :label="$t('music.album.edition')"
              readonly
              clearable
              v-bind="props"
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
                {{ $t("common.cancel") }}
              </VBtn>
              <VBtn
                variant="text"
                color="primary"
                class="ma-2"
                @click="saveEditionRelease"
              >
                {{ $t("common.ok") }}
              </VBtn>
            </VCardActions>
          </VCard>
        </VDialog>
        <VTextField
          v-if="editionInformation"
          v-model="newAlbum.edition_description"
          :label="$t('music.album.edition-description')"
          clearable
        />
        <ImagePicker
          v-model="newAlbum.image"
          :current-img="album && album.image250"
          :placeholder="albumSvgUrl"
        />
        <h4 class="text-subtitle-1">{{ $tc("music.artists", 2) }}</h4>
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
              :label="$tc('music.artists', 1)"
              return-object
            />
            <VTextField v-model="item.name" :label="$t('common.name')" />
            <VTextField
              v-if="index !== newAlbum.album_artists.length - 1"
              v-model="item.separator"
              :label="$t('music.artist.separator')"
            />
          </VCol>
        </VRow>
        <h4 class="text-subtitle-1">{{ $tc("music.labels", 2) }}</h4>
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
              :label="$tc('music.labels', 1)"
              return-object
            />
            <VTextField
              v-model="item.catalogue_number"
              :label="$t('music.label.catnr')"
            />
            <VDivider v-if="index !== newAlbum.album_labels.length - 1" />
          </VCol>
        </VRow>
        <VCheckbox
          v-if="album && album.review_comment !== null"
          v-model="clear_review_comment"
          :label="$tc('music.flag.clear', 1)"
        />
        <VRow justify="center" class="my-0">
          <VBtn :disabled="!isValid" color="primary" class="ma-2" type="submit">
            {{ album ? $t("music.album.update") : $t("music.album.create") }}
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
          <VBtn
            color="success"
            class="ma-2"
            @click="addLabel"
            @click.once="isDirty = true"
          >
            {{ $t("music.label.add") }}
          </VBtn>
        </VRow>
      </VForm>
    </VCol>
  </VRow>
</template>

<script>
// @ts-nocheck
import { mapState, mapActions } from "pinia";
import ImagePicker from "./ImagePicker.vue";
import { useUserSettingsStore } from "../store/user_settings";
import { useLabelsStore } from "../store/labels";
import { useArtistsStore } from "../store/artists";
import { useAlbumsStore } from "../store/albums";
import albumSvgUrl from "@mdi/svg/svg/album.svg";
import { useDate } from "vuetify";

export default {
  name: "AlbumForm",
  components: { ImagePicker },
  props: { album: { type: Object, default: null } },
  data() {
    return {
      dateAdapter: useDate(),
      isDirty: false,
      isValid: true,
      originalModal: false,
      originalModalModel: new Date().toISOString().substr(0, 10),
      editionModal: false,
      editionModalModel: new Date().toISOString().substr(0, 10),
      newAlbum: {
        title: "",
        release: new Date().toISOString().substr(0, 10),
        edition: null,
        edition_description: null,
        image: null,
        review_comment: null,
        album_artists: [
          {
            artist_id: null,
            separator: "",
            order: 0,
          },
        ],
        album_labels: [
          {
            label_id: null,
            catalogue_number: "",
          },
        ],
      },
      clear_review_comment: true,
      editionInformation: false,
      albumSvgUrl,
    };
  },
  computed: {
    ...mapState(useArtistsStore, {
      artists: "artists",
      sortedArtists: "artistsByName",
    }),
    ...mapState(useLabelsStore, {
      labels: "labels",
      sortedLabels: "labelsByName",
    }),
    ...mapState(useUserSettingsStore, ["locale"]),
  },
  watch: {
    album: function () {
      if (this.album && !this.isDirty) {
        this.fillValues();
      }
    },
  },
  async created() {
    if (this.album) {
      await this.read(this.album.id);
      this.fillValues();
    }
  },
  methods: {
    ...mapActions(useAlbumsStore, ["create", "read", "update"]),
    ...mapActions(useArtistsStore, { createArtist: "create" }),
    ...mapActions(useLabelsStore, { createLabel: "create" }),
    filterName(item, queryText) {
      const search = queryText.toLowerCase();
      return (
        item.name.toLowerCase().indexOf(search) > -1 ||
        item.normalized_name.indexOf(search) > -1
      );
    },
    fillValues() {
      this.newAlbum.title = this.album.title;
      this.newAlbum.release = this.album.release;
      this.originalModalModel = this.album.release;
      this.newAlbum.edition = this.album.edition;
      this.editionModalModel = this.album.edition;
      this.newAlbum.edition_description = this.album.edition_description;
      this.newAlbum.review_comment = this.album.review_comment;
      this.newAlbum.album_labels = this.album.album_labels.map((l) => {
        return {
          label_id: this.labels[l.label_id],
          catalogue_number: l.catalogue_number,
        };
      });
      this.newAlbum.album_artists = this.album.album_artists
        .map((a) => {
          return {
            artist_id: this.artists[a.artist_id],
            name: a.name,
            separator: a.separator || "",
            order: a.order,
          };
        })
        .sort((a1, a2) => a1.order - a2.order);
      this.editionInformation =
        this.album.edition !== null || this.album.edition_description !== null;
    },
    addLabel() {
      this.newAlbum.album_labels.push({
        label_id: null,
        catalogue_number: "",
      });
    },
    removeLabel(index) {
      this.newAlbum.album_labels.splice(index, 1);
    },
    addArtist() {
      this.newAlbum.album_artists.push({
        artist_id: null,
        name: "",
        separator: "",
        order: 0,
      });
    },
    removeArtist(index) {
      this.newAlbum.album_artists.splice(index, 1);
    },
    moveArtist(index, direction) {
      this.newAlbum.album_artists.splice(
        index + direction,
        0,
        this.newAlbum.album_artists.splice(index, 1)[0],
      );
    },
    saveEditionRelease() {
      this.newAlbum.edition = this.dateAdapter.toISO(this.editionModalModel);
      this.editionModal = false;
    },
    saveOriginalRelease() {
      this.newAlbum.release = this.dateAdapter.toISO(this.originalModalModel);
      this.originalModal = false;
    },
    async submit() {
      const transformed = {
        title: this.newAlbum.title,
        release: this.newAlbum.release,
        edition: this.editionInformation ? this.newAlbum.edition : null,
        edition_description: this.editionInformation
          ? this.newAlbum.edition_description
          : null,
        image: this.newAlbum.image,
        review_comment: this.clear_review_comment
          ? null
          : this.newAlbum.review_comment,
        album_labels: [],
        album_artists: [],
      };

      const mappedLabels = this.newAlbum.album_labels.map(async (label) => {
        if (typeof label.label_id === "string") {
          const id = await this.createLabel({ name: label.label_id });
          if (id) {
            transformed.album_labels.push({
              label_id: id,
              catalogue_number: label.catalogue_number,
            });
          } else {
            throw false;
          }
        } else {
          transformed.album_labels.push({
            label_id: label.label_id.id,
            catalogue_number: label.catalogue_number,
          });
        }
      });

      const mappedArtists = this.newAlbum.album_artists.map(
        async (aa, index) => {
          if (typeof aa.artist_id === "string") {
            const id = await this.createArtist({
              name: aa.artist_id,
              review_comment: "New artist",
            });
            if (id) {
              transformed.album_artists.push({
                artist_id: id,
                name: aa.name || aa.artist_id,
                separator:
                  index !== this.newAlbum.album_artists.length - 1
                    ? aa.separator
                    : null,
                order: index + 1,
              });
            } else {
              throw false;
            }
          } else {
            transformed.album_artists.push({
              artist_id: aa.artist_id.id,
              name: aa.name || aa.artist_id.name,
              separator:
                index !== this.newAlbum.album_artists.length - 1
                  ? aa.separator
                  : null,
              order: index + 1,
            });
          }
        },
      );

      await Promise.all([...mappedArtists, ...mappedLabels]);
      let pendingResult = null;
      if (this.album) {
        pendingResult = this.update(this.album.id, transformed);
      } else {
        pendingResult = this.create(transformed);
      }
      const succeeded = await pendingResult;
      if (succeeded) {
        this.$router.push(this.$route.query.redirect || { name: "albums" });
      }
    },
  },
};
</script>
