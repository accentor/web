<template>
  <VContainer fill-height fluid v-if="album">
    <VLayout align-center justify-center>
      <VFlex md4 sm8 xs12>
        <VAlert
          :value="album.review_comment !== null"
          type="warning"
          icon="mdi-flag"
        >
          {{ album.review_comment }}
        </VAlert>
        <VForm @submit.prevent="submit">
          <VTextField label="Title" v-model="newAlbum.title" />
          <VDialog
            ref="dialogOriginal"
            v-model="originalModal"
            :return-value.sync="newAlbum.release"
            persistent
            lazy
            full-width
            width="290px"
          >
            <template v-slot:activator="{ on }">
              <VTextField
                v-model="newAlbum.release"
                label="Release"
                readonly
                v-on="on"
              ></VTextField>
            </template>
            <VDatePicker
              v-model="newAlbum.release"
              scrollable
              :first-day-of-week="1"
            >
              <VSpacer></VSpacer>
              <VBtn flat color="primary" @click="originalModal = false">
                Cancel
              </VBtn>
              <VBtn
                flat
                color="primary"
                @click="$refs.dialogOriginal.save(newAlbum.release)"
              >
                OK
              </VBtn>
            </VDatePicker>
          </VDialog>
          <VCheckbox
            v-model="editionInformation"
            label="Add edition information"
          />
          <VDialog
            ref="dialogEdition"
            v-model="editionModal"
            v-if="editionInformation"
            :return-value.sync="newAlbum.edition"
            persistent
            lazy
            full-width
            width="290px"
          >
            <template v-slot:activator="{ on }">
              <VTextField
                v-model="newAlbum.edition"
                label="Edition"
                readonly
                v-on="on"
                clearable
              ></VTextField>
            </template>
            <VDatePicker
              v-model="newAlbum.edition"
              scrollable
              :first-day-of-week="1"
            >
              <VSpacer></VSpacer>
              <VBtn flat color="primary" @click="editionModal = false">
                Cancel
              </VBtn>
              <VBtn
                flat
                color="primary"
                @click="$refs.dialogEdition.save(newAlbum.edition)"
              >
                OK
              </VBtn>
            </VDatePicker>
          </VDialog>
          <VTextField
            label="Edition Description"
            v-model="newAlbum.edition_description"
            v-if="editionInformation"
            clearable
          />
          <FilePicker v-model="newAlbum.image">Choose image</FilePicker>
          <VLayout
            :key="`artist-${index}`"
            row
            v-for="(item, index) of newAlbum.album_artists"
          >
            <VLayout column class="no-grow">
              <VBtn
                @click="moveArtist(index, -1)"
                icon
                small
                :disabled="index === 0"
              >
                <VIcon>mdi-menu-up</VIcon>
              </VBtn>
              <VBtn
                @click="moveArtist(index, 1)"
                icon
                small
                :disabled="index === newAlbum.album_artists.length - 1"
              >
                <VIcon>mdi-menu-down</VIcon>
              </VBtn>
              <VBtn @click="removeArtist(index)" icon small>
                <VIcon>mdi-close</VIcon>
              </VBtn>
            </VLayout>
            <VLayout column>
              <VCombobox
                :items="sortedArtists"
                item-text="name"
                item-value="id"
                label="Artist"
                return-object
                v-model="item.artist_id"
              />
              <VTextField label="Name" v-model="item.name" />
              <VTextField
                label="Separator"
                v-model="item.separator"
                v-if="index !== newAlbum.album_artists.length - 1"
              />
            </VLayout>
          </VLayout>
          <h4>Labels</h4>
          <VLayout
            :key="`label-${index}`"
            row
            v-for="(item, index) of newAlbum.album_labels"
          >
            <VBtn @click="removeLabel(index)" icon small>
              <VIcon>mdi-close</VIcon>
            </VBtn>
            <VLayout column>
              <VCombobox
                :items="sortedLabels"
                item-text="name"
                item-value="id"
                label="Label"
                return-object
                v-model="item.label_id"
              />
              <VTextField
                label="Catalogue number"
                v-model="item.catalogue_number"
              />
              <VDivider v-if="index !== newAlbum.album_labels.length - 1" />
            </VLayout>
          </VLayout>
          <VCheckbox
            v-if="album.review_comment !== null"
            v-model="clear_review_comment"
            label="Clear review comment"
          />
          <VLayout row>
            <VBtn color="primary" type="submit">Update album</VBtn>
            <VSpacer />
            <VBtn @click="addArtist" color="success">Add artist</VBtn>
            <VBtn @click="addLabel" color="success">Add label</VBtn>
          </VLayout>
        </VForm>
      </VFlex>
    </VLayout>
  </VContainer>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import FilePicker from "../../components/FilePicker";

export default {
  name: "EditAlbum",
  components: { FilePicker },
  data() {
    return {
      originalModal: false,
      editionModal: false,
      newAlbum: {
        title: "",
        release: new Date().toISOString().substr(0, 10),
        edition: null,
        edition_description: null,
        image: null,
        review_comment: null,
        album_labels: [],
        album_artists: []
      },
      clear_review_comment: true,
      editionInformation: false
    };
  },
  created() {
    this.$nextTick(() => {
      if (this.album) {
        this.fillValues();
      }
    });
  },
  watch: {
    album: function() {
      if (this.album) {
        this.fillValues();
      }
    }
  },
  computed: {
    ...mapState("artists", ["artists"]),
    ...mapState("labels", ["labels"]),
    ...mapState("albums", ["albums"]),
    ...mapGetters("artists", {
      sortedArtists: "artistsByName"
    }),
    ...mapGetters("labels", {
      sortedLabels: "labelsByName"
    }),
    album: function() {
      return this.albums[this.$route.params.id];
    }
  },
  methods: {
    ...mapActions("albums", ["update"]),
    ...mapActions({
      createArtist: "artists/create",
      createLabel: "labels/create"
    }),
    fillValues() {
      this.newAlbum.title = this.album.title;
      this.newAlbum.release = this.album.release;
      this.newAlbum.edition = this.album.edition;
      this.newAlbum.edition_description = this.album.edition_description;
      this.newAlbum.review_comment = this.album.review_comment;
      this.newAlbum.album_labels = this.album.album_labels.map(l => {
        return {
          label_id: this.labels[l.label_id],
          catalogue_number: l.catalogue_number
        };
      });
      this.newAlbum.album_artists = this.album.album_artists
        .map(a => {
          return {
            artist_id: this.artists[a.artist_id],
            name: a.name,
            separator: a.separator || "",
            order: a.order
          };
        })
        .sort((a1, a2) => a1.order - a2.order);
      this.editionInformation =
        this.album.edition !== null || this.album.edition_description !== null;
    },
    addLabel() {
      this.newAlbum.album_labels.push({
        label_id: null,
        catalogue_number: ""
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
        order: 0
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
        album_artists: []
      };

      const promises = [];

      for (let label of this.newAlbum.album_labels) {
        if (typeof label.label_id === "string") {
          promises.push(
            this.createLabel({ name: label.label_id }).then(id => {
              if (id) {
                transformed.album_labels.push({
                  label_id: id,
                  catalogue_number: label.catalogue_number
                });
              } else {
                return Promise.reject();
              }
            })
          );
        } else {
          transformed.album_labels.push({
            label_id: label.label_id.id,
            catalogue_number: label.catalogue_number
          });
        }
      }

      this.newAlbum.album_artists.forEach((aa, index) => {
        if (typeof aa.artist_id === "string") {
          promises.push(
            this.createArtist({
              name: aa.artist_id,
              review_comment: "New artist"
            }).then(id => {
              if (id) {
                transformed.album_artists.push({
                  artist_id: id,
                  name: aa.name || aa.artist_id,
                  separator:
                    index !== this.newAlbum.album_artists.length - 1
                      ? aa.separator
                      : null,
                  order: index + 1
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
            order: index + 1
          });
        }
      });

      Promise.all(promises).then(() => {
        this.update({ id: this.album.id, newAlbum: transformed }).then(
          succeeded => {
            if (succeeded) {
              this.$router.push(
                this.$route.query.redirect || { name: "albums" }
              );
            }
          }
        );
      });
    }
  }
};
</script>
