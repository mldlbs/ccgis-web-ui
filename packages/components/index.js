
/**
 * Gis组件开发
 */
// import Vue from 'vue'
import '@/assets/styles/ccgis.scss'
import { Event } from '../utils/bus'

import GisDialog from './GisDialog'
import GisDialogList from './GisDialogList'
import GisSvgIcon from './GisSvgIcon'
import GisFeature from './GisFeature'

const components = [
  GisDialogList, GisSvgIcon, GisFeature
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

export const GisWebUi = { install, Event, GisDialog, GisDialogList, GisSvgIcon, GisFeature }
