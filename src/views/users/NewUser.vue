<template>
  <VContainer class="fill-height" fluid>
    <VRow no-gutters align="center" justify="center">
      <VCol md="4" sm="8" cols="12">
        <UserForm :show-permissions="true" />
      </VCol>
    </VRow>
  </VContainer>
</template>

<script>
import UserForm from "@/components/UserForm.vue";

export default {
  name: "NewUser",
  components: { UserForm },
  head() {
    return { title: this.$t("users.new") };
  },
};
</script>
