<template>
  <div>
    <VFileInput
      @change="interpret"
      accept="image/*"
      :label="$t('common.choose-image')"
      prepend-icon="mdi-image"
    />
  </div>
</template>

<script>
export default {
  name: "FilePicker",
  props: ["value"],
  methods: {
    interpret(file) {
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
    }
  }
};
</script>
