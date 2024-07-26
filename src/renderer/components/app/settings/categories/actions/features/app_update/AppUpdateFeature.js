import { platform as _platform, arch as _arch } from 'os';
import { invokeAppSystemInfo } from '@main/handlers/app/appHandlers';
import AppUpdateProxy from '@proxies/app_update';
import AppUpdateTransformer from '@transformers/app_update';
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const { spawn } = require('child_process');

export default class AppUpdateFeature{
    constructor(){
        this._AppUpdateTransformer = new AppUpdateTransformer()
        this._updaterFileName = 'updater';
        this._appName = 'anilibrix' // linux
        this._dirNameUpdates = null // the name of the directory where the new files for the update are stored
        
        invokeAppSystemInfo('', '').then((appPath) => {
            this._appDirectory = path.dirname(appPath['app_full_path']);
            this._mainPid = appPath['main_pid']
            console.log('App directory:', this._appDirectory);
            console.log('App main PID:', this._mainPid);
        }).catch((err) => {
            console.error('Error getting app path:', err);
        });
    }

    /**
     * Returns application and system information
     * 
     * @returns {any}
     */
    getAppAndSystemInfo(){
        const platform = _platform();
        const arch = _arch();
    
        return {
            'os': platform === 'win32' ? 'win' : (platform === 'linux' ? platform : null),
            'arch': (arch === 'x64' || arch === 'arm64') ? arch : null,
            'app_version': require('@package').version
        };
    }
    
    /**
     * @returns {string} returns the name for the archive to be downloaded
     */
    getArchiveName(){
        return 'archive.zip'
    }

    /**
     * @returns {string} returns the directory where the executable file is stored 
    */
    getAppDir(){
        return this._appDirectory
    }

    /**
     * @returns {number} returns pid of the main process
    */
    getMainPID(){
        return this._mainPid
    }

    /**
     * @returns {string} returns the full path to the updater utility
     */
    getFullPathToUpdater() {
        if (this.getAppAndSystemInfo()['os'] === 'win') {
            this._updaterFileName += '.exe';
            this._appName = 'AniLibrix Plus.exe' // windows
        }

        const updaterPath = path.join(this.getAppDir(), this._updaterFileName);
        try {
            fs.accessSync(updaterPath, fs.constants.F_OK);
            return updaterPath;
        } catch (err) {
            console.error(`File ${this._updaterFileName} is not found in the ${this.getAppDir()} directory.`);
            throw new Error('Обновление данной версии приложения не поддерживается. Установите полную версию используя установщик, если вы хотите получать обновления.')
        }
    }

    /**
     * Calculates the hash sum (sha512) of the "updater" program to protect against running third-party programs
     * @param {string} updaterPath
     * @returns {boolean}
     */
    verifyUpdater(updaterPath){
        try {
            const data = fs.readFileSync(updaterPath);
            const hash = crypto.createHash('sha512');
            hash.update(data);
            const sha512 = hash.digest('hex');
            const updaterHash = require('@package').updater_hash_sha512

            console.log(`Expected hash of the updater program (sha512): ${updaterHash}, got (sha512): ${sha512}`)

            if (updaterHash === sha512){
                return true
            } else{
                return false
            }
        } catch (err) {
            console.error(`Error: ${err.message}`);
            return false;
        }
    }

    /**
     * @returns {Promise<*>} returns release data from the GitHub API
     */
    async getReleaseData(){
        try{
            return this._AppUpdateTransformer.fetch(await new AppUpdateProxy().getAppReleases())
        } catch(e){
            throw new Error(e)
        }
    }

    /**
     * @param {*} releaseData data from the GitHub API
     * @returns {boolean} true - update is available, false - update is unavailable
     */
    updateIsAvailable(releaseData) {
        const operationSystem = this.getAppAndSystemInfo()['os'];
        const architectureSystem = this.getAppAndSystemInfo()['arch'];
        const currentAppVersion = this.getAppAndSystemInfo()['app_version'];
    
        if (operationSystem === null || architectureSystem === null) {
            return false;
        } else {
            // Formats the application version into a number. Example: "v1.2.3" -> "123"
            const currentAppVersionNumber = parseInt(currentAppVersion.substring(1).replace(/\./g, ''));
            const availableAppVersionNumber = parseInt(releaseData['latest_version'].substring(1).replace(/\./g, ''));
            
            if (availableAppVersionNumber > currentAppVersionNumber && releaseData['prerelease'] === false) {
                for (const element of releaseData['assets']) {
                    const releaseAppName = element['name'];
                    
                    if (architectureSystem === 'x64') {
                        if (releaseAppName.includes(`${operationSystem}-unpacked`)) {
                            this._dirNameUpdates = `${operationSystem}-unpacked`;
                            return true;
                        }
                    } else if (architectureSystem === 'arm64') {
                        if (releaseAppName.includes(`${operationSystem}-${architectureSystem}-unpacked`)) {
                            this._dirNameUpdates = `${operationSystem}-${architectureSystem}-unpacked`;
                            return true;
                        }
                    } else {
                        return false;
                    }
                }
    
                // Is returned if nothing is found
                return false;
            } else {
                return false;
            }
        }
    }

    /**
     * @param {*} releaseData data from the GitHub API
     * @returns {string} returns a link to the file to download
     */
    getUploadURL(releaseData) {
        const operationSystem = this.getAppAndSystemInfo()['os'];
        const architectureSystem = this.getAppAndSystemInfo()['arch'];

        for (const element of releaseData['assets']) {
            const releaseAppName = element['name'];

            if (architectureSystem === 'x64') {
                if (releaseAppName.includes(`${operationSystem}-unpacked`)) {
                    return element['browser_download_url'];
                }
            } else if (architectureSystem === 'arm64') {
                if (releaseAppName.includes(`${operationSystem}-${architectureSystem}-unpacked`)) {
                    return element['browser_download_url'];
                }
            } else {
                return "";
            }
        }
    }

    /**
     * Starts a program to synchronize files
     * @param {string} archiveFileName
     * @param {string} fullPathToUpdater
     */
    execUpdater(archiveFileName, fullPathToUpdater) {
        const child = spawn(fullPathToUpdater, [
            `-APP_FULL_PATH_DIR=${this.getAppDir()}`,
            `-CLOSE_APPS_BEFORE_PIDS_LIST=${this.getMainPID()}`,
            `-ARCHIVE_FILE_FULL_PATH=${path.join(this.getAppDir(), archiveFileName)}`,
            `-UPDATE_DIR=/${this._dirNameUpdates}`,
            `-FILES_IGNORE_LIST=${this._updaterFileName}`,
            `-FILES_DELETE_AFTER_LIST=/${this._dirNameUpdates},/${this.getArchiveName()}`
        ], {
            detached: true,
            stdio: 'ignore'
        });
        child.unref();

        console.log(`${fullPathToUpdater} process with PID ${child.pid} is started`);
    }
}