<template>
  <VContainer fill-height fluid v-if="label">
    <VLayout align-center justify-center>
      <VFlex md4 sm8 xs12>
        <VForm @submit.prevent="submit">
          <VTextField :label="$t('common.name')" v-model="newLabel.name" />
          <VBtn color="primary" class="ma-2" type="submit">
            {{ $t("music.label.update") }}
          </VBtn>
        </VForm>
      </VFlex>
    </VLayout>
  </VContainer>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "EditLabel",
  data() {
    return {
      newLabel: {
        name: ""
      }
    };
  },
  created() {
    this.$nextTick(() => {
      if (this.label) {
        this.fillValues();
      }
    });
  },
  watch: {
    label: function() {
      if (this.label) {
        this.fillValues();
      }
    }
  },
  computed: {
    ...mapState("labels", ["labels"]),
    label: function() {
      return this.labels[this.$route.params.id];
    }
  },
  methods: {
    ...mapActions("labels", ["update"]),
    fillValues() {
      this.newLabel.name = this.label.name;
    },
    submit() {
      this.update({ id: this.label.id, newLabel: this.newLabel }).then(
        succeeded => {
          if (succeeded) {
            this.$router.push(this.$route.query.redirect || { name: "labels" });
          }
        }
      );
    }
  }
};
</script>
