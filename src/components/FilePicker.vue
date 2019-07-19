<template>
  <div>
    <input @change="interpret" class="hidden" ref="picker" type="file" />
    <VInput>
      <VTextField
        :value="value ? value.filename : ''"
        clearable
        :label="$tc('image.images', 1)"
        readonly
        v-on:click:clear="clear"
      />
      <template v-slot:append>
        <VBtn @click="passthrough" color="primary" dark>
          <slot>
            {{ $t("common.choose-file") }}
          </slot>
        </VBtn>
      </template>
    </VInput>
  </div>
</template>

<script>
export default {
  name: "FilePicker",
  props: ["value"],
  methods: {
    interpret(event) {
      const file = event.target.files[0];
      if (file) {
        const fileReader = new FileReader();
        fileReader.onload = ev => {
          this.$emit("input", {
            filename: file.name,
            mimetype: file.type,
            data: ev.target.result.replace(
              /^data:[a-zA-Z0-9!#$%^&\\*_\-+{}|'.`~]+\/[a-zA-Z0-9!#$%^&\\*_\-+{}|'.`~]+;base64,/,
              ""
            )
          });
        };
        fileReader.readAsDataURL(file);
      } else {
        this.$emit("input", null);
      }
    },
    clear() {
      this.$emit("input", null);
    },
    passthrough() {
      this.$refs.picker.click();
    }
  }
};
</script>

<style scoped>
.hidden {
  display: none;
}
</style>
