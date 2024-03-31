
/**
 * Gis组件开发
 */
// import Vue from 'vue'
import './assets/styles/ccgis.scss'
import Bus, { Event } from './utils/bus'
import * as Utils from './utils'

import GisDialog from './components/GisDialog'
import GisDialogList from './components/GisDialogList'
import GisEditor from './components/GisEditor'
import GisSvgIcon from './components/GisSvgIcon'
import GisTest from './components/GisTest'

const components = [
  GisDialogList, GisSvgIcon, GisEditor, GisTest
]
const install = (Vue, options) => {
  components.forEach((it) => {
    Vue.component(it.name, it)
  })
  //   GisDialog.root = options && options.root || ''
  // 全局方法挂载
  Vue.prototype.parseTime = Utils.parseTime
  Vue.prototype.resetForm = Utils.resetForm
  Vue.prototype.addDateRange = Utils.addDateRange
  Vue.prototype.selectDictLabel = Utils.selectDictLabel
  Vue.prototype.handleTree = Utils.handleTree

  Vue.prototype.$Bus = Bus
  Vue.prototype.$Event = Event
  Vue.prototype.$Panel = GisDialog
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export const GisWebUi = { install, Bus, Event, GisDialog, GisDialogList, GisEditor, GisSvgIcon }
