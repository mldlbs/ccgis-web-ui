
/**
 * Gis组件开发
 */
// import Vue from 'vue'
import '@/assets/styles/ccgis.scss'
import Bus, { Event } from '../utils/bus'
import * as Utils from '../utils'

import GisDialog from './GisDialog'
import GisDialogList from './GisDialogList'
import GisSvgIcon from './GisSvgIcon'
// import GisFeature from './GisFeature'

const components = [
  GisDialogList, GisSvgIcon
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
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export const GisWebUi = { install, Bus, Event, GisDialog, GisDialogList, GisSvgIcon }
