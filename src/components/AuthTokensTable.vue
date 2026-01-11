<template>
  <div>
    <VDataTable
      ref="table"
      v-model="selected"
      v-model:page="page"
      item-selectable="isSelectable"
      :items-per-page-options="[30]"
      :headers="headers"
      :items="authTokens"
      :items-per-page="30"
      show-select
      class="elevation-3"
    >
      <template #header.actions>
        <VBtn
          color="error"
          class="ma-2"
          :disabled="selected.length === 0"
          @click.stop.prevent="deleteAuthTokens"
        >
          {{ $t("users.auth.destroy-selected") }}
        </VBtn>
      </template>
      <template #bottom>
        <VDivider />
        <div class="text-center py-2">
          <VPagination
            v-model="page"
            density="compact"
            :length="pageCount"
            total-visible="5"
          />
        </div>
      </template>
      <template #item.actions="{ item }">
        <VBtn
          color="error"
          class="ma-1"
          href="#"
          variant="text"
          icon
          size="small"
          :disabled="!item.isSelectable"
          @click.stop.prevent="deleteAuthToken(item)"
        >
          <VIcon>mdi-delete</VIcon>
        </VBtn>
      </template>
    </VDataTable>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/store/auth";
import { useAuthTokensStore } from "@/store/auth_tokens";
import { usePagination } from "@/composables/pagination";
import i18n from "@/i18n";
import { computed, ref } from "vue";
import type { AuthToken } from "@accentor/api-client-js";

const authStore = useAuthStore();
const authTokensStore = useAuthTokensStore();
const props = withDefaults(defineProps<{ savePagination?: boolean }>(), {
  savePagination: true,
});
const { page } = usePagination(props.savePagination);

const headers = [
  {
    text: "#",
    value: "id",
    sortable: false,
    align: "center" as const,
    width: "1px",
  },
  {
    text: i18n.global.t("users.auth.user-agent"),
    value: "user_agent",
    sortable: false,
  },
  {
    text: i18n.global.t("common.actions"),
    value: "actions",
    sortable: false,
    align: "end" as const,
  },
];

const destroyAllDisabled = ref(false);
const selected = ref([]);
const authTokens = computed(() => {
  const result = [];
  for (const token of authTokensStore.authTokens) {
    result.push({
      ...token,
      isSelectable: token.id !== authStore.currentSession,
    });
  }
  return result;
});
const pageCount = computed(() => Math.ceil(authTokens.value.length / 30));

async function deleteAuthToken(item: AuthToken): Promise<void> {
  if (confirm(i18n.global.t("common.are-you-sure"))) {
    await authTokensStore.destroy(item.id);
  }
}

async function deleteAuthTokens(): Promise<void> {
  if (confirm(i18n.global.t("common.are-you-sure"))) {
    destroyAllDisabled.value = true;
    await Promise.all(
      selected.value.map((authTokenId) => authTokensStore.destroy(authTokenId)),
    );
    destroyAllDisabled.value = false;
  }
}
</script>
