<template>
  <VMenu>
    <template v-slot:activator="{ on }">
      <div v-on="on">
        <VBtn icon small>
          <VIcon small>mdi-file-music</VIcon>
        </VBtn>
      </div>
    </template>
    <VList dense>
      <VListItem v-if="Object.keys(locations).length > 1">
        <VListItemContent>
          <span class="font-weight-bold">
            {{ $t("library.location") }}:
            <span class="font-weight-regular">
              {{ locations[track.location_id].path }}
            </span>
          </span>
        </VListItemContent>
      </VListItem>
      <VListItem>
        <VListItemContent>
          <span class="font-weight-bold">
            {{ $t("library.filename") }}:
            <span class="font-weight-regular">
              {{ track.filename }}
            </span>
          </span>
        </VListItemContent>
      </VListItem>
      <VListItem>
        <VListItemContent>
          <span class="font-weight-bold">
            {{ $t("music.track.bitrate") }}:
            <span class="font-weight-regular">
              {{ track.bitrate }}
            </span>
          </span>
        </VListItemContent>
      </VListItem>
      <VListItem v-if="track.hasOwnProperty('sample_rate')">
        <VListItemContent>
          <span class="font-weight-bold">
            {{ $t("music.track.sample_rate") }}:
            <span class="font-weight-regular">
              {{ track.sample_rate }}
            </span>
          </span>
        </VListItemContent>
      </VListItem>
      <VListItem v-if="track.hasOwnProperty('bit_depth')">
        <VListItemContent>
          <span class="font-weight-bold">
            {{ $t("music.track.bit_depth") }}:
            <span class="font-weight-regular">
              {{ track.bit_depth }}
            </span>
          </span>
        </VListItemContent>
      </VListItem>
    </VList>
  </VMenu>
</template>

<script>
import { mapGetters, mapState } from "vuex";

export default {
  name: "TrackDetails",
  props: {
    track: { type: Object, required: true },
  },
  computed: {
    ...mapState("codecs", ["codecs"]),
    ...mapState("locations", ["locations"]),
  },
};
</script>
