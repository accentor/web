import { computed, markRaw, ref } from "vue";
import { delay } from "@/util";
import api from "@/api";
import { fetchAll } from "./actions";
import { useErrorsStore } from "./errors";
import { useAuthStore } from "./auth";
import { defineStore } from "pinia";

export const useRescansStore = defineStore("rescans", () => {
  const authStore = useAuthStore();
  const errorsStore = useErrorsStore();

  const _rescans = ref({});
  const rescans = computed(() => _rescans.value);
  const allRescans = computed(() => Object.values(_rescans.value));
  const running = computed(() => allRescans.value.some((r) => r.running));
  const combinedRescans = computed(() =>
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
        finished_at: 0,
        processed: 0,
        error_text: "",
        warning_text: "",
      },
    ),
  );
  const finishedAt = computed(() =>
    allRescans.value.reduce((acc, rescan) => {
      return acc < new Date(rescan.finished_at)
        ? new Date(rescan.finished_at)
        : acc;
    }, null),
  );
  const _lastClick = ref(new Date(0));
  const lastClick = computed(() => _lastClick.value);
  const startLoading = ref(new Date(0));
  const loading = ref(false);

  function setRescans(payload) {
    const newRescancs = {};
    for (let id in _rescans.value) {
      newRescancs[id] = _rescans.value[id];
    }
    const loaded = new Date();
    for (let rescan of payload) {
      rescan.loaded = loaded;
      newRescancs[rescan.id] = markRaw(rescan);
    }
    _rescans.value = newRescancs;
  }

  function setRescan(id, rescan) {
    const newRescancs = {};
    for (let id in _rescans.value) {
      newRescancs[id] = _rescans.value[id];
    }
    rescan.loaded = new Date();
    newRescancs[id] = markRaw(rescan);
    _rescans.value = newRescancs;
  }

  function setStartLoading() {
    startLoading.value = new Date();
  }

  function removeOld() {
    const newRescans = {};
    for (let id in rescans.value) {
      if (rescans.value[id].loaded > startLoading.value) {
        newRescans[id] = rescans.value[id];
      }
    }
    _rescans.value = newRescans;
  }

  async function index() {
    if (loading.value) {
      return true;
    }
    try {
      loading.value = true;
      do {
        const generator = api.rescans.index(authStore.apiToken);
        await fetchAll(generator, setRescans, setStartLoading, removeOld);
        await delay(1000);
      } while (_lastClick.value > new Date(finishedAt.value) || running.value);
      return true;
    } catch (error) {
      errorsStore.addError(error);
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function show(id) {
    if (loading.value) {
      return true;
    }
    try {
      loading.value = true;
      let result = null;
      do {
        result = await api.rescans.show(authStore.apiToken, id);
        setRescan(id, result);
        await delay(1000);
      } while (
        _lastClick.value > new Date(result.finished_at) ||
        result.running
      );
      return true;
    } catch (error) {
      errorsStore.addError(error);
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function startAll() {
    _lastClick.value = new Date();
    try {
      await api.rescans.startAll(authStore.apiToken);
      setTimeout(() => index(), 2500);
      return true;
    } catch (error) {
      errorsStore.addError(error);
      return false;
    }
  }

  async function start(id) {
    _lastClick.value = new Date();
    try {
      const result = await api.rescans.start(authStore.apiToken, id);
      result.running = true;
      setRescan(id, result);
      setTimeout(() => show(id), 1000);
      return true;
    } catch (error) {
      errorsStore.addError(error);
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
