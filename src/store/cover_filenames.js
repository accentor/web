import Vue, {computed} from "vue";
import api from "@/api";
import { fetchAll } from "./actions";
import { useErrorsStore } from "./errors";
import { useAuthStore } from "./auth";
import {defineStore} from "pinia";
import {useBaseModelStore} from "./base";

export const useCoverFilenamesStore = defineStore('cover-filenames', () => {
    const {
        items: coverFilenames,
        index,
        create,
        destroy,
    } = useBaseModelStore(api.cover_filenames, 'cover_filenames.cover_filenames', 'cover_filename');

    const allCoverFilenames = computed(() => Object.values(coverFilenames.value).sort((cf1, cf2) => cf1.id - cf2.id));

    return {
        coverFilenames,
        allCoverFilenames,
        index,
        create,
        destroy,
    }
})