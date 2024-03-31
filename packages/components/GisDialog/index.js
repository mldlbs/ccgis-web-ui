import baseComponent from './src/component'
import Bus, { Event } from '../../utils/bus'
import { getGuid } from '../../utils'

class GisDialog {
  constructor(cfg) {
    this.config = cfg
    this.config.id = getGuid()
    this.component = baseComponent
    this.type = this.config.name
    this.isDialog = true
    this.isShow = this.config.show
    this.id = getGuid()

    this.component.install = function(Vue) {
      Vue.component(this.component.name, this.component)
    }

    const _this = this
    this.config.close = function() {
      Bus.$emit(Event.Window.closed, _this)
    }

    // 发送创建事件
    Bus.$emit(Event.Window.created, _this)
  }

  /**
   * json
   */
  static createPanel(jsonArr) {
    jsonArr.forEach(cfg => new GisDialog(cfg))
  }
}

export default GisDialog
