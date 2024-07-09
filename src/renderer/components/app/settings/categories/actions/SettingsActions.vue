<template>
  <div ref="settings">

    <div class="pa-4 caption grey--text">
      <div class="body-1">Системные команды</div>
      <div>Некоторые полезные команды для управления приложением</div>
      <div>В случае успешного обновления приложения вам нужно будет заново запустить программу. Поддерживаемые платформы: Windows-x64, Windows-arm64, Linux-x64, Linux-arm64</div>
    </div>

    <v-card>
      <v-list dense>
        <template v-for="(item, k) in settings">
          <v-divider v-if="k > 0" :key="`d:${k}`"/>
          <v-list-item :key="k" @click="item.action">
            <v-list-item-content>
              <v-list-item-title v-text="item.title" :class="item.classes"/>
            </v-list-item-content>
            <v-list-item-action class="text-right">
              <v-list-item-subtitle v-html="item.value"/>
            </v-list-item-action>
          </v-list-item>
        </template>
      </v-list>
    </v-card>


    <!-- Dialogs -->
    <template v-if="isMounted">
      <component
        v-for="(dialog,k) in dialogs"
        :is="dialog.component"
        :key="k"
        :ref="dialog.ref"
        :attach="$refs.settings">
      </component>
    </template>

  </div>
</template>

<script>
import AppUpdateFeature from './features/app_update'
import ExitDialog from './dialogs/exit'
import CacheDialog from './dialogs/cache'
import { invokeShowConfig } from '@main/handlers/app/appHandlers'
const fs = require('fs');
const path = require('path');
const axios = require('axios');

export default {
  data () {
    return {
      isUpdating: false,
      isMounted: false,
    }
  },

  computed: {

    /**
     * Get settings items
     *
     * @return array
     */
    settings () {
      return [
        {
          title: 'Перезагрузить приложение',
          value: this.shortcuts['reload'],
          action: () => require('@electron/remote').getCurrentWindow().reload(),
        },
        {
          title: 'Обновить приложение',
          action: async () => await this.update(),
        },
        {
          title: 'Показать расположение конфиг файла',
          action: () => invokeShowConfig(),
        },
        {
          title: 'Свернуть приложение',
          value: this.shortcuts['minimize'],
          action: () => require('@electron/remote').getCurrentWindow().minimize(),
        },
        {
          title: 'Закрыть приложение',
          value: this.shortcuts['close'],
          action: () => this.$refs.exit[0].showDialog(),
        },
        {
          title: 'Сбросить кеш и настройки приложения',
          action: () => this.$refs.cache[0].showDialog(),
        }
      ]
    },

    /**
     * Get dialogs
     *
     * @return Array
     */
    dialogs () {
      return [
        {
          component: ExitDialog,
          ref: 'exit'
        },
        {
          component: CacheDialog,
          ref: 'cache'
        }
      ]
    },

    /**
     * Get actions shortcuts
     *
     * @return {object}
     */
    shortcuts () {
      return {
        'close': process.platform === 'darwin' ? '⌘Q' : 'Alt + Q',
        'reload': process.platform === 'darwin' ? '⌘⇧R' : 'Ctrl + Shift + R',
        'minimize': process.platform === 'darwin' ? '⌘M' : 'Ctrl + M',
        'fullscreen': process.platform === 'darwin' ? '⌃⌘F' : 'Ctrl + F',
      }
    }

  },

  mounted () {
    this.isMounted = true
  },
  methods: {
    _downloadFile: async function(url, directory, name){
      if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
      }

      const filePath = path.join(directory, name);

      const response = await axios({
        url,
        method: 'GET',
        responseType: 'arraybuffer',
        maxRedirects: 10
      });

      const buffer = Buffer.from(response.data, 'binary');

      const writer = fs.createWriteStream(filePath);
      writer.write(buffer);
      writer.end();

      return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });
    },

    update: async function() {
      if (this.isUpdating === true) {
        this.$toasted.error('Подождите пока завершится процесс обновления...');
        return;
      }

      this.isUpdating = true;

      try {
        this.$toasted.info('Начат процесс обновления приложения...');
        const appUpdate = new AppUpdateFeature();
        const systemInfo = appUpdate.getAppAndSystemInfo();

        if (systemInfo['os'] === null || systemInfo['arch'] === null) {
          this.$toasted.error('Обновление приложения не поддерживается для данной системы');
          return;
        }

        const releaseData = await appUpdate.getReleaseData();

        if (appUpdate.updateIsAvailable(releaseData)) {
          const uploadURL = appUpdate.getUploadURL(releaseData);

          try{
            const fullPathToUpdater = appUpdate.getFullPathToUpdater()
            if (fullPathToUpdater !== null){
              if(!appUpdate.verifyUpdater(fullPathToUpdater)){
                this.$toasted.error('Устарела программа для обновлений, переустановите приложение, чтобы дальше получать обновления');
                return
              }

              this.$toasted.info('Начат процесс загрузки обновления...');
              await this._downloadFile(uploadURL, appUpdate.getAppDir(), appUpdate.getArchiveName());
              console.log('File successfully downloaded');

              this.$toasted.info('Начат процесс установки обновления...');
              appUpdate.execUpdater(appUpdate.getArchiveName(), fullPathToUpdater)
            }
          } catch(e){
            this.$toasted.error(e);
          }
        } else {
          this.$toasted.success("У вас уже установлена последняя версия приложения");
        }
      } catch (error) {
        console.error('An error occurred:', error);
        this.$toasted.error('Не удалось обновить приложение. Неизвестная ошибка');
      } finally {
        this.isUpdating = false;
      }
    }
  }
}
</script>
