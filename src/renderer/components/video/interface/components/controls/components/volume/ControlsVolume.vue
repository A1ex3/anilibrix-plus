<template>
  <v-layout align-center class="shrink">

    <!-- Volume Mute -->
    <v-btn icon large @click="toggleMute">
      <v-icon size="24">mdi-volume-{{ getVolumeState }}</v-icon>
    </v-btn>

    <!-- Volume Level -->
    <v-slider
      hide-details
      min="0"
      max="1"
      step=".05"
      :value="volume"
      :style="{maxWidth: '70px', width: '70px'}"
      @input="changeVolume($event)">
    </v-slider>

  </v-layout>
</template>

<script>

const props = {
  player: {
    type: Object,
    default: null
  }
}

export default {
  props,
  data () {
    return {
      volume: .5,
      previousVolume: .5,
    }
  },
  computed: {

    /**
     * Get volume state
     *
     * @return {string}
     */
    getVolumeState () {
      if (this.volume === 0) return 'off'
      if (this.volume <= .33) return 'low'
      if (this.volume > .33 && this.volume <= .66) return 'medium'
      if (this.volume > .66) return 'high'
    },

  },

  methods: {
    toggleMute() {
      if (this.volume > 0) {
        this.previousVolume = this.volume;
        this.changeVolume(0);
      } else {
        this.changeVolume(this.previousVolume);
      }
    },
    changeVolume(value) {
      this.volume = value;
      this.$emit('change', value);
    }
  },

  mounted () {
    // Set initial values
    this.volume = this.player.volume;
    this.previousVolume = this.player.volume;

    // Watch for player volume change
    // Update player interface
    this.player.on('volumechange', e => this.volume = this.player.volume);
  },
}
</script>
