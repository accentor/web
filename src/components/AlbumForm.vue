<template>
  <VRow no-gutters align="center" justify="center">
    <VCol lg="6" sm="8" cols="12" @change.once="isDirty = true">
      <VAlert
        v-if="album"
        :value="album.review_comment !== null"
        type="warning"
        icon="mdi-flag"
      >
        {{ album.review_comment }}
      </VAlert>
      <VForm v-model="isValid" @submit.prevent="submit">
        <VTextField
          :label="$t('music.title')"
          v-model="newAlbum.title"
          :rules="[(v) => !!v || $t('errors.albums.title-blank')]"
          required
        />
        <VDialog
          ref="dialogOriginal"
          v-model="originalModal"
          :return-value.sync="newAlbum.release"
          persistent
          width="290px"
        >
          <template v-slot:activator="{ on }">
            <VTextField
              v-model="newAlbum.release"
              :label="$t('music.album.release')"
              readonly
              v-on="on"
            ></VTextField>
          </template>
          <VDatePicker
            v-model="newAlbum.release"
            scrollable
            :first-day-of-week="1"
            :locale="locale"
          >
            <VSpacer></VSpacer>
            <VBtn
              text
              color="primary"
              class="ma-2"
              @click="originalModal = false"
            >
              {{ $t("common.cancel") }}
            </VBtn>
            <VBtn
              text
              color="primary"
              class="ma-2"
              @click="$refs.dialogOriginal.save(newAlbum.release)"
            >
              {{ $t("common.ok") }}
            </VBtn>
          </VDatePicker>
        </VDialog>
        <VCheckbox
          v-model="editionInformation"
          :label="$t('music.album.edition-information')"
        />
        <VDialog
          ref="dialogEdition"
          v-model="editionModal"
          v-if="editionInformation"
          :return-value.sync="newAlbum.edition"
          persistent
          width="290px"
        >
          <template v-slot:activator="{ on }">
            <VTextField
              v-model="newAlbum.edition"
              :label="$t('music.album.edition')"
              readonly
              v-on="on"
              clearable
            ></VTextField>
          </template>
          <VDatePicker
            v-model="newAlbum.edition"
            scrollable
            :first-day-of-week="1"
            :locale="locale"
          >
            <VSpacer></VSpacer>
            <VBtn
              text
              color="primary"
              class="ma-2"
              @click="editionModal = false"
            >
              {{ $t("common.cancel") }}
            </VBtn>
            <VBtn
              text
              color="primary"
              class="ma-2"
              @click="$refs.dialogEdition.save(newAlbum.edition)"
            >
              {{ $t("common.ok") }}
            </VBtn>
          </VDatePicker>
        </VDialog>
        <VTextField
          :label="$t('music.album.edition-description')"
          v-model="newAlbum.edition_description"
          v-if="editionInformation"
          clearable
        />
        <FilePicker v-model="newAlbum.image" />
        <h4 class="text-subtitle-1">{{ $tc("music.artists", 2) }}</h4>
        <VRow
          :key="`artist-${index}`"
          v-for="(item, index) of newAlbum.album_artists"
          no-gutters
        >
          <VCol class="flex-column flex-grow-0">
            <VBtn
              @click="moveArtist(index, -1)"
              @click.once="isDirty = true"
              icon
              small
              class="ma-2"
              :disabled="index === 0"
            >
              <VIcon>mdi-menu-up</VIcon>
            </VBtn>
            <VBtn
              @click="moveArtist(index, 1)"
              @click.once="isDirty = true"
              icon
              small
              class="ma-2"
              :disabled="index === newAlbum.album_artists.length - 1"
            >
              <VIcon>mdi-menu-down</VIcon>
            </VBtn>
            <VBtn
              @click="removeArtist(index)"
              @click.once="isDirty = true"
              icon
              small
              class="ma-2"
            >
              <VIcon>mdi-close</VIcon>
            </VBtn>
          </VCol>
          <VCol class="flex-column">
            <VCombobox
              :items="sortedArtists"
              :filter="filterName"
              item-text="name"
              item-value="id"
              :label="$tc('music.artists', 1)"
              return-object
              v-model="item.artist_id"
            />
            <VTextField :label="$t('common.name')" v-model="item.name" />
            <VTextField
              :label="$t('music.artist.separator')"
              v-model="item.separator"
              v-if="index !== newAlbum.album_artists.length - 1"
            />
          </VCol>
        </VRow>
        <h4 class="text-subtitle-1">{{ $tc("music.labels", 2) }}</h4>
        <VRow
          :key="`label-${index}`"
          v-for="(item, index) of newAlbum.album_labels"
          no-gutters
        >
          <VBtn
            @click="removeLabel(index)"
            @click.once="isDirty = true"
            icon
            small
            class="ma-2"
          >
            <VIcon>mdi-close</VIcon>
          </VBtn>
          <VCol class="flex-column">
            <VCombobox
              :items="sortedLabels"
              :filter="filterName"
              item-text="name"
              item-value="id"
              :label="$tc('music.labels', 1)"
              return-object
              v-model="item.label_id"
            />
            <VTextField
              :label="$t('music.label.catnr')"
              v-model="item.catalogue_number"
            />
            <VDivider v-if="index !== newAlbum.album_labels.length - 1" />
          </VCol>
        </VRow>
        <VCheckbox
          v-if="album && album.review_comment !== null"
          v-model="clear_review_comment"
          :label="$tc('music.flag.clear', 1)"
        />
        <VRow justify="center">
          <VBtn :disabled="!isValid" color="primary" class="ma-2" type="submit">
            {{
              this.album ? $t("music.album.update") : $t("music.album.create")
            }}
          </VBtn>
          <VSpacer />
          <VBtn
            @click="addArtist"
            @click.once="isDirty = true"
            color="success"
            class="ma-2"
          >
            {{ $t("music.artist.add") }}
          </VBtn>
          <VBtn
            @click="addLabel"
            @click.once="isDirty = true"
            color="success"
            class="ma-2"
          >
            {{ $t("music.label.add") }}
          </VBtn>
        </VRow>
      </VForm>
    </VCol>
  </VRow>
</template>

<script>
import { mapGetters, mapActions, mapState } from "vuex";
import FilePicker from "./FilePicker";

export default {
  name: "AlbumForm",
  components: { FilePicker },
  props: { album: { type: Object, default: null } },
  data() {
    return {
      isDirty: false,
      isValid: true,
      originalModal: false,
      editionModal: false,
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
    };
  },
  created() {
    if (this.album)
      this.read(this.album.id).then(() => {
        this.fillValues();
      });
  },
  watch: {
    album: function () {
      if (this.album && !this.isDirty) {
        this.fillValues();
      }
    },
  },
  computed: {
    ...mapState("artists", ["artists"]),
    ...mapState("labels", ["labels"]),
    ...mapState("userSettings", ["locale"]),
    ...mapGetters("artists", {
      sortedArtists: "artistsByName",
    }),
    ...mapGetters("labels", {
      sortedLabels: "labelsByName",
    }),
  },
  methods: {
    ...mapActions("albums", ["create", "read", "update"]),
    ...mapActions({
      createArtist: "artists/create",
      createLabel: "labels/create",
    }),
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
      this.newAlbum.edition = this.album.edition;
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
        this.newAlbum.album_artists.splice(index, 1)[0]
      );
    },
    submit() {
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

      const promises = [];

      for (let label of this.newAlbum.album_labels) {
        if (typeof label.label_id === "string") {
          promises.push(
            this.createLabel({ name: label.label_id }).then((id) => {
              if (id) {
                transformed.album_labels.push({
                  label_id: id,
                  catalogue_number: label.catalogue_number,
                });
              } else {
                return Promise.reject();
              }
            })
          );
        } else {
          transformed.album_labels.push({
            label_id: label.label_id.id,
            catalogue_number: label.catalogue_number,
          });
        }
      }

      this.newAlbum.album_artists.forEach((aa, index) => {
        if (typeof aa.artist_id === "string") {
          promises.push(
            this.createArtist({
              name: aa.artist_id,
              review_comment: "New artist",
            }).then((id) => {
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
                return Promise.reject();
              }
            })
          );
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
      });

      Promise.all(promises).then(() => {
        let promise = null;
        if (this.album) {
          promise = this.update({ id: this.album.id, newAlbum: transformed });
        } else {
          promise = this.create(transformed);
        }
        promise.then((succeeded) => {
          if (succeeded) {
            this.$router.push(this.$route.query.redirect || { name: "albums" });
          }
        });
      });
    },
  },
};
</script>
