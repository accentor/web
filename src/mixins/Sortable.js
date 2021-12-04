export default {
  data() {
    return {
      sortable: { sortBy: null, sortDesc: null },
    };
  },
  props: {
    saveSort: { default: true, type: Boolean },
  },
  watch: {
    "sortable.sortBy": function () {
      if (
        (this.saveSort === undefined || this.saveSort) &&
        this.$route.query.sortBy !== this.sortable.sortBy
      ) {
        this.$router.replace({
          query: {
            ...this.$route.query,
            sortBy: this.sortable.sortBy,
          },
        });
      }
    },
    "sortable.sortDesc": function () {
      if (
        (this.saveSort === undefined || this.saveSort) &&
        this.$route.query.sortDesc !== this.sortable.sortDesc?.toString()
      ) {
        this.$router.replace({
          query: {
            ...this.$route.query,
            sortDesc: this.sortable.sortDesc,
          },
        });
      }
    },
    "$route.query.sortBy": {
      handler() {
        if (this.saveSort === undefined || this.saveSort) {
          this.sortable.sortBy = this.$route.query.sortBy || null;
        }
      },
      immediate: true,
    },
    "$route.query.sortDesc": {
      handler() {
        if (this.saveSort === undefined || this.saveSort) {
          this.sortable.sortDesc = this.$route.query.sortDesc === "true";
        }
      },
      immediate: true,
    },
  },
};
