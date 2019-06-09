export default {
  data() {
    return {
      pagination: {}
    };
  },
  props: {
    savePagination: { default: true, type: Boolean }
  },
  created() {
    const page = parseInt(this.$route.query.page);
    this.$nextTick(() => {
      if (this.savePagination === undefined || this.savePagination) {
        this.pagination.page = page;
      }
    });
  },
  watch: {
    "pagination.page": function() {
      if (this.savePagination === undefined || this.savePagination) {
        this.$router.replace({
          query: {
            ...this.$route.query,
            page: this.pagination.page
          }
        });
      }
    },
    "$route.query.page": function() {
      if (this.savePagination === undefined || this.savePagination) {
        this.pagination.page = parseInt(this.$route.query.page) || 1;
      }
    }
  }
};
