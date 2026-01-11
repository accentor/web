import { onMounted, type Ref, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

export function useSearch(saveSearch = true): { search: Ref<string> } {
  const route = useRoute();
  const router = useRouter();
  const search = ref<string>("");

  function getRouteSearch(): string {
    return (route.query.search || "") as string;
  }

  const startingRouteSearch = getRouteSearch();
  onMounted(() => {
    search.value = startingRouteSearch;
  });

  watch(search, async () => {
    if (saveSearch && getRouteSearch() !== search.value) {
      await router.replace({
        query: {
          ...route.query,
          search: search.value,
        },
      });
    }
  });

  return { search };
}
