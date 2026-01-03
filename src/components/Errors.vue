<template>
  <VAlert
    :model-value="errors.length > 0"
    closable
    type="error"
    @update:model-value="clearErrors"
  >
    <div v-for="(error, index) in errors" :key="index">
      <div v-for="(value, key) in error" :key="key">
        <div v-for="(e, innerIndex) in value" :key="innerIndex">
          <strong>{{ $t(`errors.${key}`) }}:</strong>
          {{ $t(`errors.${e}`) }}
        </div>
      </div>
    </div>
  </VAlert>
</template>
<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useErrorsStore } from "@/store/errors";

const errorsStore = useErrorsStore();
const { errors } = storeToRefs(errorsStore);

function clearErrors(): void {
  errorsStore.clearErrors();
}
</script>
