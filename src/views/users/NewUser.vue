<template>
  <VContainer class="fill-height" fluid>
    <vue-headful :title="$t('users.new') + ' | Accentor'" />
    <VRow no-gutters align="center" justify="center">
      <VCol md="4" sm="8" cols="12">
        <UserForm :showPermissions="true" />
      </VCol>
    </VRow>
  </VContainer>
</template>

<script>
import { mapActions } from "vuex";
import UserForm from "@/components/UserForm";

export default {
  name: "NewUser",
  components: { UserForm },
};
</script>
