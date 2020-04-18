<template>
  <div v-if="track_artists.length !== 0">
    <VMenu open-on-hover offset-y>
      <template v-slot:activator="{ on }">
        <div v-on="on">
          {{ track_artists.map((a) => a.name).join(" / ") }}
        </div>
      </template>
      <VList dense>
        <VListItem
          v-for="ta of track_artists"
          :key="`${ta.artist_id} ${ta.name} ${ta.role}`"
        >
          <VListItemContent>
            <span>
              <RouterLink
                :to="{ name: 'artist', params: { id: ta.artist_id } }"
                >{{ artists[ta.artist_id].name }}</RouterLink
              >
              ({{ $t(`music.artist.roles.${ta.role}`) }})
              <span v-if="ta.name !== artists[ta.artist_id].name">
                {{ $t("common.as") }} {{ ta.name }}
              </span>
            </span>
          </VListItemContent>
        </VListItem>
      </VList>
    </VMenu>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "TrackArtists",
  props: {
    track: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState("artists", ["artists"]),
    track_artists() {
      return this.track.track_artists
        .map((ta) => ta)
        .sort((a1, a2) => a1.order - a2.order);
    },
  },
};
</script>
