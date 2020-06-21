<template>
  <VContainer class="fill-height" fluid>
    <vue-headful :title="$t('music.album.new') + ' | Accentor'" />
    <VRow no-gutters align="center" justify="center">
      <VCol lg="6" sm="8" cols="12">
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
          <VRow
            :key="`artist-${index}`"
            v-for="(item, index) of newAlbum.album_artists"
            no-gutters
          >
            <VCol class="flex-column no-grow">
              <VBtn
                @click="moveArtist(index, -1)"
                icon
                small
                class="ma-2"
                :disabled="index === 0"
              >
                <VIcon>mdi-menu-up</VIcon>
              </VBtn>
              <VBtn
                @click="moveArtist(index, 1)"
                icon
                small
                class="ma-2"
                :disabled="index === newAlbum.album_artists.length - 1"
              >
                <VIcon>mdi-menu-down</VIcon>
              </VBtn>
              <VBtn @click="removeArtist(index)" icon small class="ma-2">
                <VIcon>mdi-close</VIcon>
              </VBtn>
            </VCol>
            <VCol class="flex-column">
              <VCombobox
                :items="sortedArtists"
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
            <VBtn @click="removeLabel(index)" icon small class="ma-2">
              <VIcon>mdi-close</VIcon>
            </VBtn>
            <VCol class="flex-column">
              <VCombobox
                :items="sortedLabels"
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
          <VRow justify="center">
            <VBtn
              :disabled="!isValid"
              color="primary"
              class="ma-2"
              type="submit"
            >
              {{ $t("music.album.create") }}
            </VBtn>
            <VSpacer />
            <VBtn @click="addArtist" color="success" class="ma-2">
              {{ $t("music.artist.add") }}
            </VBtn>
            <VBtn @click="addLabel" color="success" class="ma-2">
              {{ $t("music.label.add") }}
            </VBtn>
          </VRow>
        </VForm>
      </VCol>
    </VRow>
  </VContainer>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import FilePicker from "../../components/FilePicker";

export default {
  name: "NewAlbum",
  components: { FilePicker },
  data() {
    return {
      originalModal: false,
      releaseModal: false,
      newAlbum: {
        title: "",
        albumartist: "",
        release: new Date().toISOString().substr(0, 10),
        edition: null,
        edition_description: null,
        image: null,
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
      editionInformation: false,
      isValid: true,
    };
  },
  computed: {
    ...mapState("userSettings", ["locale"]),
    ...mapGetters("artists", {
      sortedArtists: "artistsByName",
    }),
    ...mapGetters("labels", {
      sortedLabels: "labelsByName",
    }),
  },
  methods: {
    ...mapActions("albums", ["create"]),
    ...mapActions("labels", {
      createLabel: "create",
    }),
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
        albumartist: this.newAlbum.albumartist,
        release: this.newAlbum.release,
        edition: this.editionInformation ? this.newAlbum.edition : null,
        edition_description: this.editionInformation
          ? this.newAlbum.edition_description
          : null,
        image: this.newAlbum.image,
        album_labels: [],
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

      Promise.all(promises).then(() => {
        this.create(transformed).then((succeeded) => {
          if (succeeded) {
            this.$router.push({ name: "albums" });
          }
        });
      });
    },
  },
};
</script>
