<template>
  <v-menu v-bind="{attach}" top nudge-left="60" nudge-top="45">
    <!-- Speed -->
    <template v-slot:activator="{ on }">
      <v-btn 
        v-on="on"
        icon
        large
        @mousedown="startLongPress"
        @mouseup="stopLongPress"
        @mouseleave="stopLongPress"
      >
        <span class="caption font-weight-bold">{{ active.label }}</span>
      </v-btn>
    </template>

    <!-- Speeds -->
    <v-list dense v-if="isSpeedNotChanged">
      <template v-for="(s, k) in variants">
        <v-list-item :key="k" :input-value="s.value === active.value" @click="$emit('click', s.value)">
          <v-list-item-subtitle v-text="s.label"/>
        </v-list-item>
      </template>
    </v-list>

  </v-menu>
</template>

<script>
const props = {
  player: {
    type: Object,
    default: null
  },
  attach: {
    type: HTMLDivElement,
    default: null
  }
}

export default {
  props,
  data () {
    return {
      speed: 1,
      longPressTimer: null,
      isSpeedNotChanged: true
    }
  },
  computed: {

    /**
     * Get speed variants
     *
     * @return {array}
     */
    variants () {
      return [
        { label: '2x', value: 2 },
        { label: '1.75x', value: 1.75 },
        { label: '1.5x', value: 1.50 },
        { label: '1.25x', value: 1.25 },
        { label: '1x', value: 1 },
        { label: '0.75x', value: 0.75 },
        { label: '0.5x', value: 0.5 },
      ]
    },

    /**
     * Get selected speed
     *
     * @return {{}}
     */
    active () {
      return this.variants.find(variant => variant.value === this.speed)
    }

  },

  created () {
    this.speed = this.player.speed
    this.player.on('ratechange', () => this.speed = this.player.speed)
  },

  methods: {
    startLongPress() {
      this.isSpeedNotChanged = true

      // Start a timer for 600 ms
      this.longPressTimer = setTimeout(() => {
        this.isSpeedNotChanged = false
        this.speed = 2
        this.player.speed = this.speed
      }, 600)
    },

    stopLongPress() {
      // Clear the timer if the user releases the button before 600 ms
      clearTimeout(this.longPressTimer)
      
      // If the speed was changed due to a long press, reset it to 1
      if (this.speed === 2) {
        this.speed = 1
        this.player.speed = this.speed
      }
    }
  }
}
</script>
