import Vue from 'vue'
import component from './component.vue'

const _Popup = Vue.extend(component)

export default class Popup {
  constructor(data) {
    const _component = new _Popup({
      propsData: data,
      methods: {
        close() {
          if (data.close) data.close(this.id)
        }
      }
    }).$mount()
    return _component.$el
  }
}
