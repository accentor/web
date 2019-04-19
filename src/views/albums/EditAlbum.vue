<template>
  <VContainer fill-height fluid v-if="album">
    <VLayout align-center justify-center>
      <VFlex md4 sm8 xs12>
        <VForm @submit.prevent="submit">
          <VTextField label="Title" v-model="newAlbum.title" />
          <VTextField label="Albumartist" v-model="newAlbum.albumartist" />
          <VDialog
            ref="dialog"
            v-model="releaseModal"
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
            <VDatePicker v-model="newAlbum.release" scrollable>
              <VSpacer></VSpacer>
              <VBtn flat color="primary" @click="releaseModal = false">
                Cancel
              </VBtn>
              <VBtn
                flat
                color="primary"
                @click="$refs.dialog.save(newAlbum.release)"
              >
                OK
              </VBtn>
            </VDatePicker>
          </VDialog>
          <FilePicker v-model="newAlbum.image">Choose image</FilePicker>
          <h4>Labels</h4>
          <VLayout
            :key="index"
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
            <VBtn color="primary" type="submit">Update album</VBtn>
            <VSpacer />
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
      releaseModal: false,
      newAlbum: {
        title: "",
        albumartist: "",
        release: new Date().toISOString().substr(0, 10),
        image: null,
        album_labels: []
      }
    };
  },
  created() {
    setTimeout(() => {
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
    ...mapState("labels", ["labels"]),
    ...mapState("albums", ["albums"]),
    ...mapGetters("labels", {
      sortedLabels: "labelsByName"
    }),
    album: function() {
      return this.albums[this.$route.params.id];
    }
  },
  methods: {
    ...mapActions("albums", ["update"]),
    ...mapActions("labels", {
      createLabel: "create"
    }),
    fillValues() {
      this.newAlbum.title = this.album.title;
      this.newAlbum.albumartist = this.album.albumartist;
      this.newAlbum.release = this.album.release;
      this.newAlbum.album_labels = this.album.album_labels.map(l => {
        return {
          label_id: this.labels[l.label_id],
          catalogue_number: l.catalogue_number
        };
      });
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
    submit() {
      const transformed = {
        title: this.newAlbum.title,
        albumartist: this.newAlbum.albumartist,
        release: this.newAlbum.release,
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
