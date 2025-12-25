import {computed} from "vue";
import {defineStore} from "pinia";
import vuexStore from "./store";
import api from "@/api";
import { compareStrings } from "../comparators";
import { ArtistsScope } from "@accentor/api-client-js";
import {useBaseModelStore} from "./base";

export const useArtistsStore = defineStore('artists', () => {
    const {
        items: artists,
        index,
        create,
        read,
        update,
        destroy,
        destroyEmpty,
        merge,
        startLoading,
    } = useBaseModelStore(api.artists, "artists.artists", "artist", {
        baseScope: new ArtistsScope(),
        extraDestroyOperations: (id) => {
            vuexStore.commit("albums/removeArtistOccurence", id, { root: true });
            vuexStore.commit("tracks/removeArtistOccurence", id, { root: true });
        },
        extraMergeOperations: (newId, oldId) => {
            vuexStore.commit(
                "tracks/updateArtistOccurence",
                { newId, oldId },
                { root: true },
            );
            vuexStore.commit(
                "albums/updateArtistOccurence",
                { newId, oldId },
                { root: true },
            );
        },
    });
    const allArtists = computed(() => Object.values(artists.value));
    const artistsByName = computed(() =>
        [...allArtists.value].sort((a1, a2) =>
            compareStrings(a1.normalized_name, a2.normalized_name),
        ),
    );
    const artistsFlagged = computed(() => {
        return artistsByName.value
            .filter((t) => t.review_comment !== null)
            .sort((a1, a2) =>
                compareStrings(a1.normalized_name, a2.normalized_name),
            );
    });

    return {
        artists,
        allArtists,
        artistsByName,
        artistsFlagged,
        index,
        create,
        read,
        update,
        destroy,
        destroyEmpty,
        merge,
        startLoading,
    }
});