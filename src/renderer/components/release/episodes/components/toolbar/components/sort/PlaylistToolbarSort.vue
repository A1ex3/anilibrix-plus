<template>
  <v-btn height="48" @click="_setEpisodesSort(sortOrder)">
    <v-icon>mdi-sort</v-icon>
  </v-btn>
</template>

<script>

import { mapActions, mapState } from 'vuex'

export default {
  computed: {
    ...mapState('app/settings/player', { _sort: s => s.episodes.order }),

    /**
     * Get sort order
     *
     * @return {string}
     */
    sortOrder () {
      return this._sort === 'asc' ? 'desc' : 'asc'
    },

  },
  methods: {
    ...mapActions('app/settings/player', { _setEpisodesSort: 'setEpisodesSort' })
  }

}
</script>
