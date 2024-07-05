import BaseProxy from '@proxies/BaseProxy'
import __get from 'lodash/get'

export default class ScheduleProxy extends BaseProxy{

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
   * Get schedule
   *
   * @return {Promise}
   */
  async getSchedule(){
    const params = {
      parameters: {
        filter: "id,names.ru,posters.small.url,type.full_string,player.episodes.string"
      }
    }
    const response = await this.submit('GET', this.getApiEndpointExtend("v3") + '/title/schedule', params)

    return this.handleResponse(response)
  }
}