<template>
  <transition name="dialog-fade">
    <div v-show="visible" v-drag="compData.drag.enabled" class="ccgis-dialog" :style="style">
      <div class="ccgis-dialog__wrapper">
        <div :key="compData.id" ref="dialog" role="dialog" aria-modal="true" :aria-label="compData.title || 'dialog'">
          <div v-show="tp.header || true" class="ccgis-dialog__header">
            <span>{{ tp }}</span>
            <span class="ccgis-dialog__icon"> <svg-icon slot="prefix" icon-class="资源" class="el-input__icon input-icon" /></span>
            <span v-if="tp.title" class="ccgis-dialog__title">{{ compData.title }}</span>
            <span v-if="tp.close" class="ccgis-dialog__close" @click="handleClose">
              <svg-icon slot="prefix" icon-class="close" class="el-input__icon input-icon" />
            </span>
          </div>
          <div class="ccgis-dialog__body" :style="bodyStyle">
            <component :is="config.name" v-if="config.name" ref="comp" :comp-data="config.data" />
          </div>
        </div>
      </div>
    </div>

  </transition>
</template>

<script>
import { Directives, DialogType } from './mixins'
import Bus, { Event } from '../../../utils/bus'

export default {
  name: 'GisDialog',
  mixins: [Directives, DialogType],
  props: {
    config: {
      type: Object,
      default: null
    }
  },

  data() {
    return {
      name: 'username',
      visible: true,
      closed: false,
      key: 0,
      tp: {}
    }
  },
  computed: {
    bodyStyle() {
      const style = {}
      const conf = {
        ...this.compData.style
      }
      if (conf.margin) style.margin = conf.margin
      if (conf.border) style.border = conf.border
      return style
    },
    style() {
      const style = {}
      if (!this.fullscreen) {
        style.marginTop = this.top
        if (this.width) {
          style.width = this.width
        }
      }

      const conf = {
        width: '100%',
        height: '100%',
        opacity: 1,
        zIndex: 1,
        // display: 'none'
        ...this.compData.style
      }
      if (conf.left) conf.left = conf.left + 'px'
      if (conf.top) conf.top = conf.top + 'px'
      if (conf.bottom) conf.bottom = conf.bottom + 'px'
      if (conf.right) conf.right = conf.right + 'px'

      if (conf.width && (conf.width + '').indexOf('%') < 0) conf.width = conf.width + 'px'
      if (conf.height && (conf.height + '').indexOf('%') < 0) {
        conf.height = conf.height + 'px'
      } else {
        conf.height = `calc(100% - ${conf.top || '0px'})`
      }
      const finalStyle = { ...style, ...conf }
      return finalStyle
    }
  },
  destroyed() {
    // if appendToBody is true, remove DOM node after destroy
    if (this.appendToBody && this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el)
    }
  },

  mounted() {
    this.initType()
    console.log(this.tp.header)
    Bus.$on(Event.Window.show, data => {
      this.visible = true
    })

    Bus.$on(Event.Window.hide, data => {
      this.visible = false
    })
  },

  methods: {
    handleClose() {
      this.compData.close()
    },
    handleMouseDown() {}
  }
}
</script>
