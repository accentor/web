import { computed, type ComputedRef, type Ref, markRaw, ref } from "vue";
import { delay } from "@/util";
import api from "@/api";
import { fetchAll } from "./actions";
import { type ApiError, useErrorsStore } from "./errors";
import { useAuthStore } from "./auth";
import { defineStore } from "pinia";
import type { ModelItemsType } from "@/store/base";
import type { Rescan } from "@accentor/api-client-js";

export const useRescansStore = defineStore("rescans", () => {
  const authStore = useAuthStore();
  const errorsStore = useErrorsStore();

  const _rescans: Ref<ModelItemsType<Rescan>> = ref({});
  const rescans = computed(() => _rescans.value);
  const allRescans = computed(() => Object.values(_rescans.value));
  const running = computed(() => allRescans.value.some((r) => r.running));
  const combinedRescans: ComputedRef<
    Omit<Rescan, "finished_at" | "location_id"> & { finished_at: Date }
  > = computed(() =>
    allRescans.value.reduce(
      (acc, rescan) => {
        acc.finished_at =
          acc.finished_at < new Date(rescan.finished_at)
            ? new Date(rescan.finished_at)
            : acc.finished_at;
        acc.processed += rescan.processed;
        acc.error_text += rescan.error_text;
        acc.warning_text += rescan.warning_text;
        return acc;
      },
      {
        running: false,
        finished_at: new Date(0),
        processed: 0,
        error_text: "",
        warning_text: "",
      },
    ),
  );
  const finishedAt: ComputedRef<Date | null> = computed(() =>
    allRescans.value.reduce((acc: Date | null, rescan) => {
      return acc === null || acc < new Date(rescan.finished_at)
        ? new Date(rescan.finished_at)
        : acc;
    }, null),
  );
  const _lastClick: Ref<Date> = ref(new Date(0));
  const lastClick = computed(() => _lastClick.value);
  const startLoading: Ref<Date> = ref(new Date(0));
  const loading: Ref<boolean> = ref(false);

  function addRescans(payload: Rescan[]): void {
    const newRescans: ModelItemsType<Rescan> = {};
    for (const id in _rescans.value) {
      newRescans[id] = _rescans.value[id]!;
    }
    const loaded = new Date();
    for (const rescan of payload) {
      newRescans[`${rescan.id}`] = { loaded, ...rescan };
    }
    _rescans.value = markRaw(newRescans);
  }

  function setRescan(id: number, rescan: Rescan): void {
    const newRescans: ModelItemsType<Rescan> = {};
    for (const id in _rescans.value) {
      newRescans[id] = _rescans.value[id]!;
    }
    newRescans[`${id}`] = { loaded: new Date(), ...rescan };
    _rescans.value = markRaw(newRescans);
  }

  function setStartLoading(): void {
    startLoading.value = new Date();
  }

  function removeOld(): void {
    const newRescans: ModelItemsType<Rescan> = {};
    for (const id in rescans.value) {
      if (rescans.value[id]!.loaded > startLoading.value) {
        newRescans[id] = rescans.value[id]!;
      }
    }
    _rescans.value = newRescans;
  }

  async function index(): Promise<boolean> {
    if (loading.value) {
      return true;
    }
    try {
      loading.value = true;
      do {
        const generator = api.rescans.index(authStore.apiToken!);
        await fetchAll(generator, addRescans, setStartLoading, removeOld);
        await delay(1000);
      } while (
        finishedAt.value === null ||
        _lastClick.value > finishedAt.value ||
        running.value
      );
      return true;
    } catch (error) {
      errorsStore.addError(error as ApiError);
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function show(id: number): Promise<boolean> {
    if (loading.value) {
      return true;
    }
    try {
      loading.value = true;
      let result = null;
      do {
        result = await api.rescans.show(authStore.apiToken!, id);
        setRescan(id, result);
        await delay(1000);
      } while (
        _lastClick.value > new Date(result.finished_at) ||
        result.running
      );
      return true;
    } catch (error) {
      errorsStore.addError(error as ApiError);
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function startAll(): Promise<boolean> {
    _lastClick.value = new Date();
    try {
      await api.rescans.startAll(authStore.apiToken!);
      setTimeout(() => index(), 2500);
      return true;
    } catch (error) {
      errorsStore.addError(error as ApiError);
      return false;
    }
  }

  async function start(id: number): Promise<boolean> {
    _lastClick.value = new Date();
    try {
      const result = await api.rescans.start(authStore.apiToken!, id);
      result.running = true;
      setRescan(id, result);
      setTimeout(() => show(id), 1000);
      return true;
    } catch (error) {
      errorsStore.addError(error as ApiError);
      return false;
    }
  }

  return {
    allRescans,
    combinedRescans,
    finishedAt,
    lastClick,
    index,
    startAll,
    start,
  };
});
