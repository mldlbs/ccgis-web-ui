
/**
 * Gis组件开发
 */
// import Vue from 'vue'
import { Event } from '../utils/bus'

import GisDialog from './GisDialog'
import GisDialogList from './GisDialogList'
import GisSvgIcon from './GisSvgIcon'

const components = [
  GisDialogList, GisSvgIcon
]
const install = (Vue, options) => {
  components.forEach((it) => {
    Vue.component(it.name, it)
  })
  GisDialog.root = options && options.root || ''
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

// const GisWebUi =

export { install, Event, GisDialog, GisDialogList, GisSvgIcon }
