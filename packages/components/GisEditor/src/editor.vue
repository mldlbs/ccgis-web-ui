<template>
  <div class="ccgis-editor">
    <div v-if="enter.visible" class="ccgis-editor__enter">
      <div class="ccgis-editor__body" :style="enter.style" @click="handleClick" />
    </div>
    <div v-if="active.visible" class="ccgis-editor__active">
      <div class="ccgis-editor__header" :style="active.header">
        <span class="ccgis-editor__title">预览</span>
      </div>
      <div class="ccgis-editor__body" :style="active.style" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'EditorModule',
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
        console.log('enterStyle', val)
        if (val) {
          this.enter.visible = true
          this.enter.style = {
            position: 'absolute',
            top: val.top,
            left: val.left,
            width: val.width,
            height: val.height,
            background: '#74ab7a33',
            zIndex: 9999
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
      this.active.visible = true
      this.active.header = {
        position: 'absolute',
        top: (Number(this.enter.style.top.replace('px', '')) - 36) + 'px',
        left: this.enter.style.left,
        width: this.enter.style.width,
        height: 36 + 'px',
        background: '#4262456e',
        zIndex: 9999

      }
      this.active.style = this.enter.style
      this.enter.visible = false
    }
  }
}
</script>

<style> </style>
