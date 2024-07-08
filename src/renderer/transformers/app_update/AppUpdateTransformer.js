import BaseTransformer from '@transformers/BaseTransformer'

export default class AppUpdateTransformer extends BaseTransformer {
  /**
   * Fetch app release data
   *
   * @param appReleases
   * @return {*}
   */
  fetch (appReleases) {
    return {
      latest_version: this.get(appReleases, 'tag_name'),
      prerelease: this.get(appReleases, 'prerelease'),
      published_at: this.formatTimeUTCToCurrentTimeZone(this.get(appReleases, 'published_at')),
      assets: this.get(appReleases, 'assets')
    }
  }

  /**
   * Fetch app release data
   *
   * @param time {string} Template "YYYY-mm-ddTHH:MM:SSZ"
   * @return {string} Returns a correctly formatted time. Example: "2024-07-06T11:48:39Z" -> "06.07.2024 14:48:39" (Moscow time zone)
   */
  formatTimeUTCToCurrentTimeZone(time) {
    const utcTime = new Date(time);
    const localOffset = utcTime.getTimezoneOffset();
    const localTime = new Date(utcTime.getTime() - (localOffset * 60000));
    const formattedTime = `${localTime.getDate()}.${localTime.getMonth() + 1}.${localTime.getFullYear()} ${localTime.getHours()}:${localTime.getMinutes()}:${localTime.getSeconds()}`;
  
    return formattedTime;
  }
}