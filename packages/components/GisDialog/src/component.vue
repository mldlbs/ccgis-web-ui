<template>
  <transition name="dialog-fade">
    <div v-show="visible" v-drag="config.drag.enabled" class="ccgis-dialog" :style="style">
      <div class="ccgis-dialog__wrapper" @mouseenter="handleMove">
        <div :key="config.id" ref="dialog" role="dialog" aria-modal="true" :aria-label="config.title || 'dialog'">
          <div v-show="tp.header" class="ccgis-dialog__header">
            <span class="ccgis-dialog__icon"> <svg-icon slot="prefix" icon-class="资源" class="el-input__icon input-icon" /></span>
            <span v-if="tp.title" class="ccgis-dialog__title">{{ config.title }}</span>
            <span v-if="tp.close" class="ccgis-dialog__close" @click="handleClose">
              <svg-icon slot="prefix" icon-class="close" class="el-input__icon input-icon" />
            </span>
          </div>
          <div class="ccgis-dialog__body" :style="bodyStyle">
            <component :is="config.name" v-show="config.name" ref="comp" :comp-data="config.data" />
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { Directives, DialogType } from './mixins'
// import Bus, { Event } from '../../../utils/bus'

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
      visible: true,
      closed: false,
      key: 0
    }
  },
  computed: {
    bodyStyle() {
      const style = {}
      const conf = {
        ...this.config.style
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
        ...this.config.style
      }
      if (conf.left) conf.left = conf.left + 'px'
      if (conf.top) conf.top = conf.top + 'px'
      if (conf.bottom) conf.bottom = conf.bottom + 'px'
      if (conf.right) conf.right = conf.right + 'px'

      if (conf.width && (conf.width + '').indexOf('%') < 0) {
        conf.width = conf.width + 'px'
      } else {
        conf.width = `calc(100% - ${conf.left || '0px'})`
      }
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

  mounted() {},
  methods: {
    show(visible) {
      this.visible = visible
    },
    handleMove() {
      const winInfo = {
        id: this.config.id,
        name: this.config.name,
        width: this.$el.style.width,
        height: this.$el.style.height,
        left: this.$el.style.left,
        top: this.$el.style.top
      }
      this.$emit('handleMove', winInfo)
    },
    handleClose() {
      this.config.close()
    },
    handleMouseDown() {}
  }
}
</script>
