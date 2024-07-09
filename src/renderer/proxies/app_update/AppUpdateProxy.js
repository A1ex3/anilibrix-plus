import BaseProxy from '@proxies/BaseProxy'
import __get from 'lodash/get'

export default class AppUpdateProxy extends BaseProxy{

  /**
   * Parse base response model
   *
   * @param response
   * @return {*}
   */
  handleResponse (response) {
    const data = __get(response, 'data', null)
    const status = __get(response, 'status', false)
    const message = __get(response, 'error.message', 'Ошибка при запросе')

    if (status === 200) {
      return data
    } else {
      throw new Error(message)
    }
  }

  /**
   * Get application releases
   *
   * @return {Promise}
   */
  async getAppReleases(){
    const response = await this.submit('GET', this.getAppUpdateChannelEndpoint() + '/latest')

    return this.handleResponse(response)
  }
}