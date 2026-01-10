<template>
  <VForm ref="form" v-model="isValid">
    <VRow>
      <VCol cols="5">
        <VTextField
          v-model="newLocation.path"
          :label="$t('library.path')"
          :disabled="location !== null"
          required
          :rules="rules.path"
        />
      </VCol>
      <VCol cols="2" sm="1">
        <VBtn
          v-if="!location"
          :disabled="!isValid"
          icon
          variant="outlined"
          color="success"
          class="ma-2"
          @click="saveLocation"
        >
          <VIcon color="success">mdi-plus</VIcon>
        </VBtn>
        <VBtn
          v-if="location"
          icon
          variant="outlined"
          color="error"
          class="ma-2"
          @click="deleteLocation"
        >
          <VIcon color="error">mdi-delete</VIcon>
        </VBtn>
      </VCol>
    </VRow>
  </VForm>
</template>

<script setup lang="ts">
import { useLocationsStore } from "../store/locations";
import { computed, onMounted, ref, useTemplateRef } from "vue";
import type { Location } from "@accentor/api-client-js";
import i18n from "@/i18n";

const locationsStore = useLocationsStore();

const props = defineProps<{ location?: Location }>();
const newLocation = ref({ path: "" });
const isValid = ref(true);
const rules = computed(() => {
  const result = {
    path: [
      (v: string): true | string =>
        !!v || i18n.global.t("errors.location.path-blank"),
    ] as ((v: string) => true | string)[],
  };
  if (!props.location) {
    result.path.push((v: string): true | string => {
      const double = locationsStore.allLocations.some((l) => l.path === v);
      return !double || i18n.global.t("errors.location.path-taken");
    });
  }
  return result;
});

onMounted(fillValues);
function fillValues(): void {
  if (props.location) {
    newLocation.value.path = props.location.path;
  }
}

async function deleteLocation(): Promise<void> {
  if (!props.location) {
    return;
  }

  if (confirm(i18n.global.t("common.are-you-sure"))) {
    await locationsStore.destroy(props.location.id);
  }
}

const form = useTemplateRef("form");
async function saveLocation(): Promise<void> {
  if ((await form.value!.validate()).valid) {
    const id = await locationsStore.create(newLocation.value);
    if (id) {
      newLocation.value.path = "";
    }
  }
}
</script>
