import GisEditor from './src/component'

GisEditor.install = function(Vue) {
  Vue.component(GisEditor.name, GisEditor)
}

export default GisEditor
