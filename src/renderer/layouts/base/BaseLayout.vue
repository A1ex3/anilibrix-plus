<template>
  <v-layout
    column
    fill-height
    id="container"
    class="base-layout"
    :class="{ showScroll, isOnBlack }">

    <!-- App Toolbar -->
    <!-- Content -->
    <app-tool-bar/>
    <slot/>

    <!-- Button to scroll to top -->
    <v-btn
      v-if="scrollToTop"
      :class="['scroll-to-top', { 'visible': showScrollButton }]"
      fab
      small
      @click="scrollToTopFunction">
      <v-icon color="white">mdi-arrow-up</v-icon>
    </v-btn>

  </v-layout>
</template>

<script>
import AppToolBar from '@components/app/toolbar'

export default {
  name: 'Layout.Base',
  components: {
    AppToolBar
  },
  data() {
    return {
      showScrollButton: false
    }
  },
  computed: {
    showScroll () {
      return this.$__get(this.$route, 'meta.layout.show_scroll') || false
    },
    isOnBlack () {
      return this.$__get(this.$route, 'meta.layout.is_on_black') || false
    },
    scrollToTop () {
      return this.$__get(this.$route, 'meta.layout.scroll_to_top') || false
    }
  },
  methods: {
    scrollToTopFunction() {
      const container = document.getElementById('container');
      container.scrollTo({ top: 0, behavior: 'smooth' });
    },
    handleScroll() {
      const container = document.getElementById('container');
      this.showScrollButton = container.scrollTop > 1000;
    }
  },
  mounted() {
    const container = document.getElementById('container');
    container.addEventListener('scroll', this.handleScroll);
  },
  beforeDestroy() {
    const container = document.getElementById('container');
    container.removeEventListener('scroll', this.handleScroll);
  }
}
</script>

<style lang="scss" scoped>
.base-layout {
  top: 40px;
  padding: 15px 5% 30px 5%;
  position: absolute;
  overflow-x: hidden;
  overflow-y: overlay;
  width: 100%;
  height: calc(100vh - 40px);

  &::-webkit-scrollbar-thumb {
    background-color: transparent;
  }

  &::-webkit-scrollbar {
    background-color: transparent;
  }

  &.showScroll {
    &::-webkit-scrollbar-thumb {
      background-color: #353535;
    }

    &::-webkit-scrollbar {
      background-color: #1d1d1d;
    }
  }

  &.isOnBlack {
    background: black;
  }
}

/* Styles for the scroll to top button */
.scroll-to-top {
  position: fixed;
  bottom: 20px;
  left: 20px;
  z-index: 1000;

  transform: translateY(100px);
  transition: transform 0.3s ease, opacity 0.3s ease;
  opacity: 0;
}

.scroll-to-top.visible {
  transform: translateY(0);
  opacity: 1;
}
</style>
