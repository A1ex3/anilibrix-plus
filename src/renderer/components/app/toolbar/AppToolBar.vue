<template>
  <v-app-bar v-if="!hideToolbar" flat color="transparent" class="toolbar shrink">
    <!-- Search -->
    <search class="mr-4"/>

    <!-- Dropdown Menu -->
    <v-menu offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-tooltip left activator="#toolbar__menu">
          <div class="py-1">
            <div class="font-weight">Меню</div>
          </div>
        </v-tooltip>
        <v-btn id="toolbar__menu" icon v-bind="attrs" v-on="on">
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>
      <v-list>
        <!-- Releases -->
        <v-list-item :to="{name: 'releases'}" exact>
          <v-list-item-icon>
            <v-icon>mdi-view-column</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Релизы</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <!-- Catalog -->
        <v-list-item :to="{name: 'catalog'}" exact>
          <v-list-item-icon>
            <v-icon>mdi-folder-text-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Каталог</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <!-- Schedule -->
        <v-list-item :to="{name: 'schedule'}" exact>
          <v-list-item-icon>
            <v-icon>mdi-calendar</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Расписание</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <!-- Favorites -->
        <v-list-item :to="{name: 'favorites'}" exact>
          <v-list-item-icon>
            <v-icon>mdi-star</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Избранное</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>

    <!-- Random Release -->
    <div>
      <v-btn :disabled="diceIntervalId !== null" icon id="toolbar__rand" v-on:click="randomRelease">
        <v-icon>mdi-dice-{{ dice }}</v-icon>
      </v-btn>
      <v-tooltip left activator="#toolbar__rand">Случайный релиз</v-tooltip>
    </div>

    <!-- Additional Components -->
    <update/>
    <notifications/>
    <settings/>
    <account/>
  </v-app-bar>
</template>

<script>
import Update from './components/update'
import Search from './components/search'
import Account from './components/account'
import Settings from './components/settings'
import Notifications from './components/notifications'
import { invokeRand } from '@main/handlers/app/appHandlers'

export default {
  components: {
    Update,
    Search,
    Account,
    Settings,
    Notifications
  },
  data() {
    return {
      dice: 5,
      diceIntervalId: null,
      direction: 0
    }
  },
  computed: {
    hideToolbar() {
      return this.$__get(this.$route, 'meta.layout.hide_toolbar') || false
    }
  },
  methods: {
    async randomRelease() {
      this.diceIntervalId = setInterval(() => {
        this.dice = this.direction ? this.dice - 1 : this.dice + 1;
        if (this.dice === 6) {
          this.direction = 1;
        } else if (this.dice === 0) {
          this.direction = 0;
        }
      }, 200);

      const { id, name } = await invokeRand();
      if (id === -1) {
        this.$toasted.show('Функция не поддерживается выбранным API сервером', { type: 'error' });
        return;
      }
      await this.$router.push('/release/' + id + '/' + name );
      clearInterval(this.diceIntervalId);
      this.dice = 5;
      this.diceIntervalId = null;
    }
  }
}
</script>

<style lang="scss" scoped>
.toolbar {
  ::v-deep {
    .v-toolbar__content {
      padding-left: 0;
      padding-right: 0;
    }
  }
}
</style>
