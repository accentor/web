<template>
  <VContainer v-if="user" fluid>
    <VRow>
      <VCol>
        <div class="text-h4">{{ user.name }}</div>
        <span class="text-grey">
          {{ user.permission }}
        </span>
      </VCol>
    </VRow>
  </VContainer>
</template>

<script setup lang="ts">
import { computed, watch } from "vue";
import { useRouter } from "vue-router";
import { useHead } from "@unhead/vue";
import { useUsersStore } from "@/store/users";

const props = defineProps<{ id: string }>();

const usersStore = useUsersStore();
const router = useRouter();

const user = computed(() => usersStore.users[props.id]);
const userName = computed(() => user.value?.name);

useHead({ title: userName });

watch(user, () => {
  if (!user.value) {
    router.go(-1);
  }
});
</script>
