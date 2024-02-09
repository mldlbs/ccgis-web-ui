import Vue from 'vue'
import component from './component.vue'
import Time from './time.vue'

const _Popup = Vue.extend(component)
const _TimePopup = Vue.extend(Time)

export class Popup {
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

export class TimePopup {
  constructor(data) {
    const _component = new _TimePopup({
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
