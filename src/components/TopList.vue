<template>
  <ol class="top-list">
    <li
      v-for="(item, index) in dataSlice"
      :key="`${index}-${page}`"
      class="top-item"
    >
      <VImg v-if="item.image" :src="item.image" class="top-item__cover" />
      <div class="top-item__stat">
        <span class="top-item__text">
          <span class="top-item__position font-weight-medium">
            {{ index + 1 + (page - 1) * ITEMS_PER_PAGE }}.
          </span>
          <span class="top-item__name">
            {{ item.label }}
          </span>
        </span>
        <div class="top-item__bg-wrapper">
          <div
            class="top-item__bg bg-primary"
            :style="{ '--width': `${widths[index]}%` }"
          >
            <span
              v-if="widths[index]! > 10 && showLength"
              class="top-item__count font-weight-medium text-white"
            >
              {{ formatLength(item.count) }}
            </span>
            <span
              v-else-if="widths[index]! > 10"
              class="top-item__count font-weight-medium text-white"
            >
              {{
                Number.isInteger(item.count)
                  ? item.count
                  : item.count.toFixed(2)
              }}
            </span>
          </div>
          <span
            v-if="widths[index]! <= 10 && showLength"
            class="top-item__count top-item__count--backup font-weight-medium text-primary"
            :style="{ 'margin-left': `${widths[index]}%` }"
          >
            {{ formatLength(item.count) }}
          </span>
          <span
            v-else-if="widths[index]! <= 10"
            class="top-item__count top-item__count--backup font-weight-medium text-primary"
            :style="{ 'margin-left': `${widths[index]}%` }"
          >
            {{
              Number.isInteger(item.count) ? item.count : item.count.toFixed(2)
            }}
          </span>
        </div>
      </div>
    </li>
  </ol>
  <VPagination
    v-if="paginate"
    v-model="page"
    density="compact"
    :length="Math.ceil(listData.length / ITEMS_PER_PAGE)"
    total-visible="5"
  />
</template>

<script setup lang="ts">
import { computed } from "vue";
import { formatLength } from "@/util";
import { usePagination } from "@/composables/pagination";

const ITEMS_PER_PAGE = 50;

const { page } = usePagination();

interface Props {
  listData: { label: string; count: number; image?: string }[];
  showLength?: boolean;
  paginate?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showLength: false,
  paginate: false,
});

const dataSlice = computed(() =>
  props.paginate
    ? props.listData.slice(
        ITEMS_PER_PAGE * (page.value - 1),
        ITEMS_PER_PAGE * page.value,
      )
    : props.listData,
);

const widths = computed(() => {
  const max = props.listData[0]?.count ?? 1;
  return dataSlice.value.map((i) => (i.count * 100.0) / max);
});
</script>

<style lang="scss" scoped>
.top-list {
  list-style: none;
  padding-left: 0;
}

.top-item {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0.375rem 1rem;

  &__cover {
    flex-grow: 0;
    object-fit: cover;
    height: 6rem;
    width: 6rem;
    margin-right: 1rem;
  }

  &__stat {
    flex-grow: 1;
  }
  &__bg-wrapper {
    width: 100%;
    height: 2rem;
    position: relative;
  }

  &__bg {
    width: var(--width, 0%);
    height: 100%;
    border-radius: 0.5rem;
    transition-property: width;
    transition-timing-function: ease-in-out;
    transition-duration: 500ms;
    display: flex;
    z-index: 1;
    position: relative;
    overflow: hidden;

    @starting-style {
      width: 0%;
    }
  }

  &__text {
    display: flex;
    line-height: 1.2;
    margin-bottom: 0.125rem;
  }

  &__position {
    margin-right: 0.25rem;
  }

  &__count {
    margin-left: auto;
    white-space: nowrap;
    padding: 0.25rem 0.5rem;

    &--backup {
      margin-left: 0;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 0;
    }
  }
}
</style>
