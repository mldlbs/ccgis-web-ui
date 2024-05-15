<template>
  <div v-drag="true" class="ccgis-editor" :style="active.style">
    <div v-if="enter.visible" class="ccgis-editor__enter" :style="enter.style" @click="handleClick" @mouseleave="handleLeave">
      <div class="ccgis-editor__body" />
    </div>
    <div v-show="active.visible" class="ccgis-editor__active">
      <div id="ccgis-editor-header" class="ccgis-editor__header">
        <span class="ccgis-editor__title">预览</span>
      </div>
      <div class="ccgis-editor__body" />
    </div>
  </div>
</template>

<script>
import Directives from './directives'
export default {
  name: 'EditorModule',
  mixins: [Directives],
  props: {
    enterStyle: {
      type: Object,
      default: () => ({})
    },
    activeStyle: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      draging: false,
      enter: {
        visible: false,
        style: {

        }
      },
      active: {
        visible: false,
        style: {

        }
      }
    }
  },
  computed: {
  },
  watch: {
    enterStyle: {
      handler(val) {
        if (this.draging) return
        if (val) {
          if (this.active.id === val.id) return
          this.enter.id = val.id
          this.enter.visible = true
          this.enter.style = {
            top: val.top,
            left: val.left,
            width: val.width,
            height: val.height
          }
        }
      },
      deep: true
    },
    active: {
    }
  },
  methods: {
    handleClick() {
      if (this.active.id === this.enter.id) return
      this.active.id = this.enter.id
      this.active.visible = true
      this.active.style = {
        top: (Number(this.enter.style.top.replace('px', '')) - 36) + 'px',
        left: this.enter.style.left,
        width: this.enter.style.width,
        height: (Number(this.enter.style.height.replace('px', '')) + 36) + 'px'
      }
      this.enter.visible = false
    },
    handleLeave(winInfo) {
      this.enter.visible = false
    },
    handleMove(winInfo) {
      this.$emit('handleMove', {
        ...winInfo,
        id: this.active.id
      })
    //   this.active.style = {
    //     ...this.active.style,
    //     top: winInfo.top,
    //     left: winInfo.left
    //   }
    }
  }
}
</script>

<style> </style>
