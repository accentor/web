<template>
  <ol class="top-list">
    <li v-for="(item, index) in listData" :key="index" class="top-item">
      <VImg v-if="item.image" :src="item.image" class="top-item__cover" />
      <div class="top-item__stat">
        <span class="top-item__text">
          <span class="top-item__position font-weight-medium">
            {{ index + 1 }}.
          </span>
          <span class="top-item__name">
            {{ item.label }}
          </span>
        </span>
        <div class="top-item__bg-wrapper">
          <div
            class="top-item__bg bg-primary"
            :style="{ width: `${animatedWidths[index]}%` }"
          >
            <span
              v-if="widths[index] > 10 && showLength"
              class="top-item__count font-weight-medium text-white"
            >
              {{ $filters.length(item.count) }}
            </span>
            <span
              v-else-if="widths[index] > 10"
              class="top-item__count font-weight-medium text-white"
            >
              {{ item.count }}
            </span>
          </div>
          <span
            v-if="widths[index] <= 10 && showLength"
            class="top-item__count top-item__count--backup font-weight-medium text-primary"
            :style="{ 'margin-left': `${animatedWidths[index]}%` }"
          >
            {{ $filters.length(item.count) }}
          </span>
          <span
            v-else-if="widths[index] <= 10"
            class="top-item__count top-item__count--backup font-weight-medium text-primary"
            :style="{ 'margin-left': `${animatedWidths[index]}%` }"
          >
            {{ item.count }}
          </span>
        </div>
      </div>
    </li>
  </ol>
</template>

<script>
export default {
  name: "TopList",
  props: {
    listData: {
      type: Array,
      required: true,
    },
    showLength: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      animatedWidths: Array(10).fill(0),
    };
  },
  computed: {
    widths() {
      const max = this.listData[0]?.count;
      return this.listData.map((i) => (i.count * 100.0) / max);
    },
  },
  watch: {
    widths() {
      setTimeout(() => {
        this.animatedWidths = this.widths;
      }, 0);
    },
  },
};
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
    height: 100%;
    border-radius: 0.5rem;
    transition-property: width;
    transition-timing-function: ease-in-out;
    transition-duration: 500ms;
    display: flex;
    z-index: 1;
    position: relative;
    overflow: hidden;
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
