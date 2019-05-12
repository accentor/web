<template>
  <VContainer fill-height fluid>
    <VLayout align-center justify-center>
      <VFlex md4 sm8 xs12>
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
          <VLayout row>
            <VBtn color="primary" type="submit">Create album</VBtn>
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
import { mapActions, mapGetters } from "vuex";
import FilePicker from "../../components/FilePicker";

export default {
  name: "EditAlbum",
  components: { FilePicker },
  data() {
    return {
      releaseModal: false,
      newAlbum: {
        title: "",
        albumartist: "",
        release: new Date().toISOString().substr(0, 10),
        edition: null,
        edition_description: null,
        image: null,
        album_labels: [
          {
            label_id: null,
            catalogue_number: ""
          }
        ]
      },
      editionInformation: false
    };
  },
  computed: {
    ...mapGetters("labels", {
      sortedLabels: "labelsByName"
    })
  },
  methods: {
    ...mapActions("albums", ["create"]),
    ...mapActions("labels", {
      createLabel: "create"
    }),
    addLabel() {
      this.newAlbum.album_labels.push({
        label_id: null,
        catalogue_number: ""
      });
    },
    removeLabel(index) {
      this.newAlbum.album_labels.splice(index, 1);
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
        album_labels: []
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

      Promise.all(promises).then(() => {
        this.create(transformed).then(succeeded => {
          if (succeeded) {
            this.$router.push({ name: "albums" });
          }
        });
      });
    }
  }
};
</script>
