<template>
  <VContainer fill-height fluid v-if="user">
    <VLayout align-center justify-center>
      <VFlex md4 sm8 xs12>
        <VForm @submit.prevent="submit">
          <VTextField :label="$t('common.name')" v-model="newUser.name" />
          <VTextField
            v-if="user === currentUser"
            :label="$t('users.current-password')"
            type="password"
            v-model="newUser.current_password"
          />
          <VTextField
            :label="$t('users.password')"
            type="password"
            v-model="newUser.password"
          />
          <VTextField
            :label="$t('users.confirm-password')"
            type="password"
            v-model="newUser.password_confirmation"
          />
          <VSelect
            :items="permissionOptions"
            :label="$t('users.permissions')"
            v-model="newUser.permission"
          />
          <VBtn color="primary" class="ma-2" type="submit">
            {{ $t("users.update") }}
          </VBtn>
        </VForm>
      </VFlex>
    </VLayout>
  </VContainer>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";

export default {
  name: "EditUser",
  data() {
    return {
      newUser: {
        current_password: "",
        name: "",
        password: "",
        password_confirmation: "",
        permission: ""
      },
      permissionOptions: [
        { text: this.$t("users.permission.admin"), value: "admin" },
        { text: this.$t("users.permission.moderator"), value: "moderator" },
        { text: this.$t("users.permission.user"), value: "user" }
      ]
    };
  },
  created() {
    this.$nextTick(() => {
      if (this.user) {
        this.fillValues();
      }
    });
  },
  watch: {
    user: function() {
      if (this.user) {
        this.fillValues();
      }
    }
  },
  computed: {
    ...mapGetters("auth", ["currentUser"]),
    ...mapState("users", ["users"]),
    user: function() {
      return this.users[this.$route.params.id];
    }
  },
  methods: {
    ...mapActions("users", ["update"]),
    fillValues() {
      this.newUser.name = this.user.name;
      this.newUser.permission = this.user.permission;
    },
    submit() {
      this.update({ id: this.user.id, newUser: this.newUser }).then(
        succeeded => {
          if (succeeded) {
            this.$router.push(this.$route.query.redirect || { name: "users" });
          }
        }
      );
    }
  }
};
</script>
