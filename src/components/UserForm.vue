<template>
  <div @change="isDirty = true">
    <VForm ref="userForm" v-model="isValid" @submit.prevent="submit">
      <VTextField
        v-model="newUser.name"
        :label="I18n.t('common.name')"
        autocomplete="username"
        required
        :rules="[(v) => !!v || I18n.t('errors.user.name-blank')]"
      />
      <VTextField
        v-if="user === currentUser"
        v-model="newUser.current_password"
        :label="I18n.t('users.current-password')"
        type="password"
        autocomplete="current-password"
        :rules="rules.current"
      />
      <VTextField
        v-model="newUser.password"
        :label="I18n.t('users.password')"
        type="password"
        autocomplete="new-password"
        :rules="rules.password"
      />
      <VTextField
        v-model="newUser.password_confirmation"
        :label="I18n.t('users.confirm-password')"
        type="password"
        autocomplete="new-password"
        :rules="rules.confirmation"
      />
      <VSelect
        v-if="showPermissions"
        v-model="newUser.permission"
        :items="permissionOptions"
        :label="I18n.t('users.permissions')"
      />
      <VBtn color="primary" class="ma-2" type="submit">
        {{ user ? I18n.t("users.update") : I18n.t("users.create") }}
      </VBtn>
    </VForm>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, useTemplateRef } from "vue";
import { storeToRefs } from "pinia";
import type { VForm } from "vuetify/components";
import type { User } from "@accentor/api-client-js";
import { UserPermission } from "@accentor/api-client-js";
import { useAuthStore } from "@/store/auth";
import { useUsersStore } from "@/store/users";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

const I18n = useI18n();
const router = useRouter();
const route = useRoute();

interface Props {
  user?: User | undefined;
  redirectFallback?: string;
  showPermissions?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  user: undefined,
  redirectFallback: "users",
  showPermissions: false,
});

const usersStore = useUsersStore();
const { currentUser } = storeToRefs(useAuthStore());

const permissionOptions = computed(() => [
  { title: I18n.t("users.permission.admin"), value: "admin" },
  { title: I18n.t("users.permission.moderator"), value: "moderator" },
  { title: I18n.t("users.permission.user"), value: "user" },
]);

const isDirty = ref(false);
const isValid = ref(true);

const newUser = ref({
  current_password: "",
  name: "",
  password: "",
  password_confirmation: "",
  permission: "" as UserPermission,
});

onMounted(() => {
  if (props.user) {
    newUser.value.name = props.user.name;
    newUser.value.permission = props.user.permission;
  }
});

const userForm = useTemplateRef("userForm");

async function submit(): Promise<void> {
  userForm.value?.validate();
  if (isValid.value) {
    let pendingResult;
    if (props.user) {
      pendingResult = usersStore.update(props.user.id, newUser.value);
    } else {
      pendingResult = usersStore.create(newUser.value);
    }
    const succeeded = await pendingResult;
    if (succeeded) {
      await router.push(
        (route.query.redirect as string | undefined) || {
          name: props.redirectFallback,
        },
      );
    }
  }
}

const rules = computed(() => {
  const rules = {
    confirmation: [] as ((v: string) => true | string)[],
    current: [] as ((v: string) => true | string)[],
    password: [] as ((v: string) => true | string)[],
  };

  if (newUser.value.password) {
    const confirmationBlank = (v: string): true | string =>
      !!v || I18n.t("errors.user.password-confirmation-blank");
    const confirmationMatch = (v: string): true | string =>
      (!!v && v) === newUser.value.password ||
      I18n.t("errors.user.password-confirmation");
    rules.confirmation.push(confirmationBlank, confirmationMatch);

    const currentBlank = (v: string): true | string =>
      !!v || I18n.t("errors.user.current-password-blank");
    rules.current.push(currentBlank);
  }

  if (newUser.value.current_password || newUser.value.password_confirmation) {
    const passwordBlank = (v: string): true | string =>
      !!v || I18n.t("errors.user.password-blank");
    rules.password.push(passwordBlank);
  }

  return rules;
});
</script>
