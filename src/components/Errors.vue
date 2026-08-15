<template>
  <VAlert
    :model-value="errors.length > 0"
    closable
    type="error"
    @update:model-value="clearErrors"
  >
    <div v-for="(error, index) in errors" :key="index">
      <strong>{{ I18n.t(`errors.types.${error.name}`, error.name) }}:</strong>
      &nbsp;
      <ul v-if="errorOfType(error, NotFoundError, UnprocessableContentError)">
        <li v-for="(detail, innerIndex) in error.details" :key="innerIndex">
          {{
            I18n.t(
              `errors.models.${detail.model}.${detail.attribute || "base"}.${detail.type}`,
            )
          }}
        </li>
      </ul>
      <ul v-if="errorOfType(error, UnauthorizedError, ForbiddenError)">
        <li v-for="(detail, innerIndex) in error.details" :key="innerIndex">
          {{
            I18n.t(
              `errors.models.${detail.model}.${detail.attribute || "base"}.${detail.type}`,
            )
          }}
        </li>
      </ul>
      <span v-else-if="errorOfType(error, UnexpectedError)">
        {{ I18n.t("errors.api.unexpected", error.details) }}
      </span>
      <span v-else-if="errorOfType(error, UnknownError)">
        {{ I18n.t("errors.api.unknown", { message: error.message }) }}
      </span>
      <span v-else-if="errorOfType(error, PlayerError)">
        {{ I18n.t(`errors.player.${error.message}`) }}
      </span>
      <span v-else>
        {{ I18n.t("errors.internal.unknown", { message: error.message }) }}
      </span>
    </div>
  </VAlert>
</template>
<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useErrorsStore } from "@/store/errors";
import { useI18n } from "vue-i18n";
import {
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  UnprocessableContentError,
  UnexpectedError,
  UnknownError,
} from "@accentor/api-client-js";
import { PlayerError } from "@/errors";

const I18n = useI18n();
const errorsStore = useErrorsStore();
const { errors } = storeToRefs(errorsStore);

function errorOfType(error: Error, ...types: Error[]): boolean {
  return types.some((constructor) => error instanceof constructor);
}

function clearErrors(): void {
  errorsStore.clearErrors();
}
</script>
