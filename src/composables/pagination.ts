import { onMounted, type Ref, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

export function usePagination(savePagination = true): { page: Ref<number> } {
  const route = useRoute();
  const router = useRouter();
  const page = ref<number>(1);

  function getRoutePage(): number {
    return parseInt((route.query.page ?? "1") as string);
  }

  const startingRoutePage = getRoutePage();
  onMounted(() => {
    page.value = startingRoutePage;
  });

  watch(page, async () => {
    if (savePagination && getRoutePage() !== page.value) {
      await router.replace({
        query: {
          ...route.query,
          page: `${page.value}`,
        },
      });
    }
  });

  watch(
    () => route.query.page,
    () => (page.value = getRoutePage()),
  );

  return { page };
}
