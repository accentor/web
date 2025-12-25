import {computed} from "vue";
import {defineStore} from "pinia";
import api from "@/api";
import {useBaseModelStore} from "./base";

export const useCodecsStore = defineStore('codecs', () => {
    const {
        items: codecs,
        index,
        create,
        update,
        destroy,
    } = useBaseModelStore(api.codecs, "codecs.codecs", "codec");

    const allCodecs = computed(() => Object.values(codecs.value).sort((c1, c2) => c1.id - c2.id));

    return {
        codecs,
        allCodecs,
        index,
        create,
        update,
        destroy,
    }
})