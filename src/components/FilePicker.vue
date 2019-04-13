<template>
  <div>
    <input type="file" ref="picker" @change="interpret" class="hidden" />
    <VInput>
      <VTextField
        :value="value ? value.filename : ''"
        label="Image"
        clearable
        readonly
        v-on:click:clear="clear"
      />
      <template v-slot:append>
        <VBtn dark color="primary" @click="passthrough"><slot>Choose file</slot></VBtn>
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
