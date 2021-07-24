export default {
  data() {
    return {
      search: "",
    };
  },
  props: {
    saveSearch: { default: true, type: Boolean },
  },
  created() {
    const search = this.$route.query.search;
    this.$nextTick(() => {
      if (this.saveSearch) {
        this.search = search;
      }
    });
  },
  watch: {
    search: function () {
      if (this.saveSearch && this.$route.query.search !== this.search) {
        this.$router.replace({
          query: {
            ...this.$route.query,
            search: this.search,
          },
        });
      }
    },
  },
};
