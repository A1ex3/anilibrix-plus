import { Main, Torrent } from '@main/utils/windows'
import { app, ipcMain, ipcRenderer } from 'electron'
import { start as startSystemSleepBlocker, stop as stopSystemSleepBlocker } from '../../utils/powerSaveBlocker'
import { setEncrypted } from '@main/utils/safeStorage'
import axios from 'axios'
import axiosRetry from 'axios-retry';
import parseTorrent from 'parse-torrent';
import qs from 'querystring';
import { catGirlFetch } from '@utils/fetch';
import { parse } from 'content-disposition-attachment';
axiosRetry(axios, {
  retryDelay: () => 1500,
  retries: 10,
  retryCondition: function (response) {
    if (response.status === 404) return false

    return axiosRetry.isNetworkOrIdempotentRequestError(response)
  }
})

const { shell } = require('electron')
const path = require('path')

export const APP_DISCORD_RICH_PRESENSE = 'app:richpresense'

export const APP_ABOUT = 'app:about'
export const APP_SYSTEM_SLEEP_DISABLE = 'app:system:disable_sleep'
export const APP_SYSTEM_SLEEP_ENABLE = 'app:system:enable_sleep'
export const APP_SYSTEM_INFO = 'app:system:info'
export const APP_DOCK_NUMBER = 'app:dock:number'
export const APP_DEVTOOLS_MAIN = 'app:devtools:main'
export const APP_DEVTOOLS_TORRENT = 'app:devtools:torrent'
export const APP_SAFE_STORAGE_ENCRYPT_REQUEST = 'app:system:safe_storage:encrypt'
export const APP_SAFE_STORAGE_DECRYPT_REQUEST = 'app:system:safe_storage:decrypt'

export const APP_SHOW_CONFIG = 'app:show_config'
export const APP_CHECK_API_ENDPOINT = 'app:check_api_endpoint'

export const APP_RAND = 'app:rand'

export const APP_TORRENT_PARSE = 'app:torrent_parse'

/**
 * Send app about event
 *
 * @return {void}
 */
export const sendAppAboutEvent = () => ipcRenderer.send(APP_ABOUT)

/**
 * Listen app about event
 *
 * @return {Electron.IpcMain}
 */
export const catchAppAboutEvent = () => ipcMain.on(APP_ABOUT, () => app.showAboutPanel())

/**
 * Send app devtools main event
 *
 * @return {void}
 */
export const sendAppDevtoolsMainEvent = () => ipcRenderer.send(APP_DEVTOOLS_MAIN)

/**
 * Listen app devtools main event
 *
 * @return {Electron.IpcMain}
 */
export const catchAppDevtoolsMainEvent = () => ipcMain.on(APP_DEVTOOLS_MAIN, () => Main.showDevTools())

/**
 * Send app devtools torrent event
 *
 * @return {void}
 */
export const sendAppDevtoolsTorrentEvent = () => ipcRenderer.send(APP_DEVTOOLS_TORRENT)

/**
 * Listen app devtools torrent event
 *
 * @return {Electron.IpcMain}
 */
export const catchAppDevtoolsTorrentEvent = () => ipcMain.on(APP_DEVTOOLS_TORRENT, () => Torrent.showDevTools())

/**
 * Send app docker number event
 *
 * @param number
 * @return {void}
 */
export const sendAppDockNumberEvent = (number) => ipcRenderer.send(APP_DOCK_NUMBER, number)

/**
 * Listen app dock number event
 *
 * @return {void}
 */

export const catchAppDockNumberEvent = () => {
  ipcMain.on(APP_DOCK_NUMBER, (e, number) => {
    if (app.dock) app.dock.setBadge(number && number > 0 ? number.toString() : '')
  })
}

/**
 * Send app system sleep blocker enable event
 *
 * @param number
 * @return {void}
 */
export const sendEnableSystemSleepBlockerEvent = (number) => ipcRenderer.send(APP_SYSTEM_SLEEP_DISABLE)

/**
 * Listen app system sleep blocker enable event
 *
 * @return {void}
 */
export const catchEnableSystemSleepBlockerEvent = () => {
  ipcMain.on(APP_SYSTEM_SLEEP_DISABLE, (e) => {
    startSystemSleepBlocker()
  })
}

/**
 * Send app system sleep blocker disable event
 *
 * @param number
 * @return {void}
 */
export const sendDisableSystemSleepBlockerEvent = (number) => ipcRenderer.send(APP_SYSTEM_SLEEP_ENABLE)

/**
 * Listen app system sleep blocker disable event
 *
 * @return {void}
 */
export const catchDisableSystemSleepBlockerEvent = () => {
  ipcMain.on(APP_SYSTEM_SLEEP_ENABLE, (e) => {
    stopSystemSleepBlocker()
  })
}

/**
 * Send encrypt request to safe storage
 *
 * @param {string} prop Property name
 * @param {string} data Data to encrypt
 * @return {Promise<string>}
 */
export const invokeSafeStorageEncrypt = (prop, data) => ipcRenderer.invoke(APP_SAFE_STORAGE_ENCRYPT_REQUEST, prop, data)

/**
 * Listen encrypt request to safe storage
 *
 * @return {void}
 */
export const handleSafeStorageEncrypt = () => {
  ipcMain.handle(APP_SAFE_STORAGE_ENCRYPT_REQUEST, async (event, prop, data) => {
    return setEncrypted(prop, data)
  })
}

/**
 * Get application system information
 *
 * @param {string} prop Property name
 * @param {string} data Data to encrypt
 * @return {Promise<string>}
 */
export const invokeAppSystemInfo = (prop, data) => ipcRenderer.invoke(APP_SYSTEM_INFO, prop, data)

/**
 * Get application system information
 *
 * @return {void}
 */
export const handleAppSystemInfo = () => {
  ipcMain.handle(APP_SYSTEM_INFO, async () => {
    return {
      app_full_path: app.getPath('exe'),
      main_pid: process.pid
    };
  })
}

/**
 * Send activity for discord rich presence
 *
 * @param {object} data
 * @return {Promise}
 */
export const invokeRichPresense = (data) => ipcRenderer.invoke(APP_DISCORD_RICH_PRESENSE, data)

/**
 * Listens for activity for discord rich presence
 *
 * @return {void}
 */
export const handleRichPresense = (setActivity) => {
  ipcMain.handle(APP_DISCORD_RICH_PRESENSE, async (event, data) => {
    return setActivity(data)
  })
}

/**
 * Send activity for discord rich presence
 *
 * @param {object} data
 * @return {Promise}
 */
export const invokeShowConfig = () => ipcRenderer.invoke(APP_SHOW_CONFIG)

/**
 * Listens for activity for discord rich presence
 *
 * @return {void}
 */
export const handleShowConfig = () => {
  ipcMain.handle(APP_SHOW_CONFIG, async (event, data) => {
    return shell.showItemInFolder(path.join(app.getPath('userData'), 'anilibrix.json'))
  })
}

/**
 * Send activity for discord rich presence
 *
 * @param {object} data
 * @return {Promise}
 */
export const invokeRand = () => ipcRenderer.invoke(APP_RAND)

/**
 * Listens for activity for discord rich presence
 *
 * @return {void}
 */
export const handleRand = () => {
  ipcMain.handle(APP_RAND, async (event) => {
    const endpoint = require('@store/index').default?.state?.app?.settings?.system?.api?.endpoint
    const ext_endpoint = require('@store/index').default?.state?.app?.settings?.system?.api?.ext_endpoint

    try {
      const { data } = await axios.get(`${ext_endpoint}/v3/title/random`)
      console.log('Rand:', data.id)
      return { id: data.id, name: data.names.en }
    } catch (e) {
      if (e.response != null || e.response != undefined) {
        const { data: { data: { code } } } = await axios.post(`${endpoint}/public/api/index.php`, new URLSearchParams({ query: 'random_release' }))
        const { data: { data: { id, names } } } = await axios.post(`${endpoint}/public/api/index.php`, new URLSearchParams({
          query: 'release',
          code: code
        }))
        return { id: id, name: names.pop() }
      }
      throw e
    }
  })
}

export const invokeTorrentParse = (url) => ipcRenderer.invoke(APP_TORRENT_PARSE, url)

export const handleTorrentParse = () => {
  ipcMain.handle(APP_TORRENT_PARSE, async (event, url) => {
    const { file, name } = await catGirlFetch(url, { raw: true })
      .then(async x => {
        return {
          name: parse(x.headers.get('content-disposition')).filename || 'unknown.torrent',
          file: Buffer.from(await x.arrayBuffer())
        }
      })

    const data = parseTorrent(file);

    return {
      file: file.toString('base64'),
      name,
      magnet: 'magnet:?' + qs.stringify({
        xt: `urn:btih:${data.infoHash}`,
        dn: data.name,
        tr: data.announce
      })
    }
  })
}
