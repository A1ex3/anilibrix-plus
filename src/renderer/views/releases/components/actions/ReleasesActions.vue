<template>
  <loader v-if="loading"/>
  <v-layout v-else class="shrink">

    <!-- Show video -->
    <!-- Show release -->
    <v-btn class="mr-1" @click="$emit('toVideo')">Смотреть</v-btn>
    <v-btn class="mr-1" @click="$emit('toRelease')">Релиз</v-btn>

  </v-layout>
</template>

<script>

import Loader from './components/loader'

const props = {
  loading: {
    type: Boolean,
    default: false
  },
  release: {
    type: Object,
    default: null
  }
}
export default {
  props,
  components: {
    Loader,
  },
}
</script>
