<template>
  <div ref="settings">

    <div class="pa-4 caption grey--text">
      <div class="body-1">Настройки приложения</div>
      <div>
        В данном разделе вы можете настроить автоматическое обновление релизов, системные уведомления
        и другие параметры приложения
      </div>
    </div>

    <!-- Appbar inverse -->
    <template v-if="!this.isMac">
      <v-card class="mt-2">
        <v-list-item dense @click="_setAppbarRight(!_appbar_right)">
          <v-list-item-title>
            Переместить кнопки контроля вправо
          </v-list-item-title>

          <v-list-item-action class="mr-2">
            <v-switch :input-value="_appbar_right" @change="_setAppbarRight"/>
          </v-list-item-action>
        </v-list-item>

        <v-card-text class="pt-2">
          <div class="caption">
            Перемещает кнопки упралвления окном (свернуть, закрыть и развернуть) вправо
          </div>
        </v-card-text>
      </v-card>
    </template>

    <!-- Appbar inverse -->
    <v-card class="mt-2">
      <v-list-item dense @click="_setFilterNotify(!_filter_notify)">
        <v-list-item-title>
          Фильтровать уведомления по избранному
        </v-list-item-title>

        <v-list-item-action class="mr-2">
          <v-switch :input-value="_filter_notify" @change="_setFilterNotify"/>
        </v-list-item-action>
      </v-list-item>

      <v-card-text class="pt-2">
        <div class="caption">
          Включает показ уведомлений только для релизов из избранного
        </div>
      </v-card-text>
    </v-card>

    <!-- API Endpoint -->
    <v-card>
      <v-card-text class="mt-2">
        <v-combobox
          outlined
          :value="_api_endpoint"
          @input="_setAPIEndpoint($event ? $event : process.env.API_ENDPOINT_URL)"
          :items="['https://anilibria.tv', 'https://wwnd.space', 'https://anilibriaqt.anilib.top', 'https://anilibrix.anilib.top', 'https://anilibria.animehaze.me']"
          label="Точка подключения к API"
          persistent-hint
        />

        <v-combobox
          outlined
          class="mb-2"
          :value="_ext_api_endpoint"
          @input="_setExtAPIEndpoint($event ? $event : process.env.EXT_API_SERVER)"
          :items="['https://api.anilibria.tv', 'https://api.anilib.top']"
          label="Точка подключения к API (новые версии)"
          persistent-hint
        />

        <v-combobox
          outlined
          class="mb-2"
          :value="_static_endpoint"
          @input="_setAPIStaticEndpoint($event ? $event : process.env.STATIC_ENDPOINT_URL)"
          :items="['https://static-libria.weekstorm.one/', 'https://static.anilibria.tv/', 'https://static.wwnd.space/', 'https://anilibriaqt.anilib.top/', 'https://anilibrix.anilib.top/', 'https://anilibria.animehaze.me/']"
          label="Точка подключения к серверу статики"
          persistent-hint
        />

        <v-combobox
          outlined
          class="mb-2"
          :value="_app_update_channel_endpoint"
          @input="_setAppUpdateChannelEndpoint($event ? $event : process.env.APP_UPDATE_CHANNEL_ENDPOINT_URL)"
          :items="['https://api.github.com/repos/A1ex3/anilibrix-plus/releases']"
          label="Точка подключения к каналу обновлений приложения"
          persistent-hint
        />

        <div class="caption">
          Вы можете использовать основной домен, если он не заблокирован вашим провайдером, или использовать
          дополнительные домены.

          Вы можете ввести свю точку подключения к API, серверу статики и каналу обновлений приложения в поле "Точка подключения к API", "Точка подключения к API (новые версии)", "Точка подключения к серверу статики" и "Точка подключения к каналу обновлений приложения".

          <b>После изменения точки доступа рекомендуется перезагрузить приложение.</b>
        </div>
      </v-card-text>
    </v-card>

    <v-card class="mt-2">
      <v-list-item dense @click="_setDRPC(!_drpc_enabled)">
        <v-list-item-title>Discord Rich Presence</v-list-item-title>
        <v-list-item-action class="mr-2">
          <v-switch :input-value="_drpc_enabled" @change="_setDRPC"/>
        </v-list-item-action>
      </v-list-item>
      <v-card-text class="pt-2 caption">
        Приложение будет выводть информацию о просматриваемом релизе в Discord Rich Presence
      </v-card-text>
    </v-card>
    <v-divider/>

    <!-- System Notifications -->
    <v-card>
      <v-list-item dense @click="_setSystemNotifications(!_notifications_system)">
        <v-list-item-title>Показывать системные уведомления</v-list-item-title>
        <v-list-item-action class="mr-2">
          <v-switch :input-value="_notifications_system" @change="_setSystemNotifications"/>
        </v-list-item-action>
      </v-list-item>
      <v-card-text class="pt-2">
        <div class="caption">
          Если при загрузке последних релизов приложение обнаружит обновленный релиз,
          то оно покажет системное уведомление о новом эпизоде
        </div>
      </v-card-text>
    </v-card>


    <!-- Auto update -->
    <v-card class="mt-2">
      <v-list-item dense @click="_setUpdates(!_updates_enabled)">
        <v-list-item-title>Автоматическое обновление релизов</v-list-item-title>
        <v-list-item-action class="mr-2">
          <v-switch :input-value="_updates_enabled" @change="_setUpdates"/>
        </v-list-item-action>
      </v-list-item>
      <v-card-text class="pt-2 caption">
        Приложение будет в фоне обновлять последние релизы, даже если оно свернуто
      </v-card-text>
    </v-card>
    <v-divider/>

    <!-- Update Timeouts -->
    <v-card>
      <v-card-text class="pb-2">
        <div class="caption">
          Вы можете указать с какой периодичностью приложение будет обновлять релизы в фоновом режиме
        </div>
      </v-card-text>
      <v-card-text>
        <v-text-field
          outlined
          hide-details
          class="mb-2"
          type="number"
          label="Периодичность обновления релизов"
          suffix="мин"
          :value="_updates_timeout"
          @input="_setUpdatesTimeout($event ? parseInt($event) : 1)">
        </v-text-field>
      </v-card-text>
    </v-card>


    <!-- Ads -->
    <v-card class="mt-2">
      <v-list-item dense @click="_setAds(!_ads)">
        <v-list-item-title>Показывать рекламу</v-list-item-title>
        <v-list-item-action class="mr-2">
          <v-switch :input-value="_ads" @change="_setAds"/>
        </v-list-item-action>
      </v-list-item>
      <v-card-text class="pt-2 caption">
        <div>Спасибо, что выбрали <b>Анилибрию!</b></div>
        <div>
          Мы понимаем, что реклама никому не нравится, но это бесплатный способ поддержать проект.
          Отключение рекламы - абсолютно бесплатно, но, если вы хотите поддержать нас, то оставьте рекламу включенной.
          Обещаем, что не будем сильно навязчивыми (✿◠‿◠)
        </div>
      </v-card-text>
    </v-card>

    <!-- Ads Maximum -->
    <v-card class="mt-2">
      <v-list-item dense @click="_setAdsMaximum(!_ads_maximum)">
        <v-list-item-title>Показывать рекламу перед каждым эпизодом</v-list-item-title>
        <v-list-item-action class="mr-2">
          <v-switch :input-value="_ads_maximum" @change="_setAdsMaximum"/>
        </v-list-item-action>
      </v-list-item>
      <v-card-text class="pt-2 caption">
        <div>Максимальная поддержка проекта!</div>
        <div>Реклама будет показываться перед каждым просмотром любого эпизода</div>
      </v-card-text>
    </v-card>

    <div v-show="_isAuthorized" class="pa-4 caption grey--text">
      <div class="body-1">Снапшоты</div>
      <div>Вы можете создавать резервные копии данных приложения привязанные к вашему аккаунту анилибрии</div>
    </div>

    <v-card v-show="_isAuthorized">
      <v-list dense>
        <template>
          <v-list-item @click="snapshots">
            <v-list-item-content>
              <v-list-item-title v-text="'Список снапшотов'"/>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-card>

    <template v-if="isMounted">
      <component
        :is="Confirm"
        ref="confirm"
        v-on:openSnapshots="showSnapshotsList"/>

      <component
        :is="snapshotsList"
        ref="snapshotsList"></component>
    </template>
  </div>
</template>

<script>

import { mapActions, mapGetters, mapState } from 'vuex'
import Confirm from '@components/app/settings/categories/system/dialogs/confirm.vue'
import snapshotsList from '@components/app/settings/categories/system/dialogs/snapshotsList.vue'
import { AppPlatformMixin } from '@mixins/app'

export default {
  mixins: [AppPlatformMixin],
  data () {
    return {
      isMounted: false,
      Confirm,
      snapshotsList
    }
  },

  computed: {
    ...mapGetters('app/account', { _isAuthorized: 'isAuthorized' }),
    ...mapState('app/settings/system', {
      _ads: s => s.ads.enabled,
      _ads_maximum: s => s.ads.maximum,
      _updates_enabled: s => s.updates.enabled,
      _updates_timeout: s => s.updates.timeout,
      _api_endpoint: s => s.api.endpoint,
      _ext_api_endpoint: s => s.api.ext_endpoint,
      _static_endpoint: s => s.api.static_endpoint,
      _app_update_channel_endpoint: s => s.api.app_update_channel_endpoint,
      _notifications_system: s => s.notifications.system,
      _appbar_right: s => s.appbar_right,
      _filter_notify: s => s.filter_notify,
      _drpc_enabled: s => s.drpc_enabled,
    }),
  },

  methods: {
    showSnapshotsList: function () {
      this.$refs.confirm.hideDialog()
      this.$refs.snapshotsList.showDialog()
      this.$refs.snapshotsList.fetchSnapshots()
    },
    snapshots: function () {
      this.$refs.confirm.showDialog()
    },
    ...mapActions('app/settings/system', {
      _setAds: 'setAds',
      _setUpdates: 'setUpdates',
      _setAdsMaximum: 'setAdsMaximum',
      _setUpdatesTimeout: 'setUpdatesTimeout',
      _setSystemNotifications: 'setSystemNotifications',
      _setAPIEndpoint: 'setAPIEndpoint',
      _setExtAPIEndpoint: 'setExtAPIEndpoint',
      _setAPIStaticEndpoint: 'setAPIStaticEndpoint',
      _setAppUpdateChannelEndpoint: 'setAppUpdateChannelEndpoint',
      _setAppbarRight: 'setAppbarRight',
      _setFilterNotify: 'setFilterNotify',
      _setDRPC: 'setDRPC'
    })
  },

  mounted () {
    this.isMounted = true
  }
}
</script>
