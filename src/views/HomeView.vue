<script setup lang="ts">
import { inject, ref, computed, type Ref } from 'vue'
import type { DaoCollection } from '@/sqlite'
const { users, tracks }: DaoCollection = inject('db')!
const values = users.getAll()
const tracksCount = tracks.getCount()
const page = ref(0)

function nextPage() {
  page.value++
}

function prevPage() {
  if (page.value > 0) {
    page.value--
  }
}

const someTracks: Ref<any[]> = tracks.getPage(page, 25)
const titles = computed(() => someTracks.value.map((t) => t.title))
</script>

<template>
  <p>Home</p>
  <div>Table contents: {{ values }}</div>
  <div>Track count: {{ tracksCount }}</div>
  <v-btn @click="prevPage">Previous page</v-btn>
  <v-btn @click="nextPage">Next page</v-btn>
  <div>Some tracks: {{ titles }}</div>
</template>
