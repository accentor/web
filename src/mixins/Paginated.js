export default {
  data() {
    return {
      pagination: {}
    };
  },
  created() {
    const page = parseInt(this.$route.query.page);
    setTimeout(() => (this.pagination.page = page));
  },
  watch: {
    "pagination.page": function() {
      this.$router.replace({
        query: {
          ...this.$route.query,
          page: this.pagination.page
        }
      });
    },
    "$route.query.page": function() {
      this.pagination.page = parseInt(this.$route.query.page) || 1;
    }
  }
};
