<template>
  <div style="position: absolute;">
    <div class="ccgis-component">
      <div v-for="(dia) in renderDialogs" :key="dia.id" class="ccgis-dialog__list">
        <div class="ccgis-editor">
          <div v-if="dia.id !== active.id || dia.id === hover.id" class="ccgis-editor__header">
            <span class="ccgis-editor__title">预览</span>
          </div>
          <div class="ccgis-editor__body" :style="{height: dia.height + 'px'}">
            <Component
              :is="dia.component"
              :key="dia.id"
              :config="dia.config"
              @winActive="$handleWinActive"
              @winRemove="$handleWinRemove"
              @winDragStart="$winDragStart"
              @winDragEnd="$winDragEnd"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Bus, { Event } from '../../../utils/bus'
import Directives from './directives'
export default {
  name: 'GisEditor',
  mixins: [Directives],
  data() {
    return {
      active: {},
      hover: {},
      resize: {},
      dialogs: [], // 所有的弹窗
      renderDialogs: [] // 渲染的弹窗
    }
  },
  created() {
    const _this = this
    Bus.$on(Event.Window.created, dia => {
      const index = _this.dialogs.findIndex(it => it.id === dia.id)
      if (index > -1) return
      _this.dialogs.push(dia)
      if (dia.isDialog && dia.isShow) {
        _this.renderDialogs.push(dia)
      }
    })

    Bus.$on(Event.Window.closed, dia => {
      if (dia.isDialog) {
        const index = _this.renderDialogs.findIndex(it => it.id === dia.id)
        if (index > -1) {
          _this.renderDialogs.splice(index, 1)
        }
      }
    })

    Bus.$on(Event.Window.show, ({ type, data }) => {
      const dia = _this.dialogs.find(it => it.type === type)
      if (!dia) return console.log('dialog not exist!')
      if (data) dia.config.data = data
      const index = _this.renderDialogs.findIndex(it => it.id === dia.id)
      if (index < 0) {
        _this.renderDialogs.push(dia)
      }
    })
  },
  methods: {
    $handleResize() {
      this.resize = new Date().getTime()
    },
    $handleWinActive(winInfo) {
      this.hover = winInfo
    },
    $winDragStart(winInfo) {
    },
    $winDragEnd(winInfo) {
      this.winInfo = winInfo
    },
    $handleWinRemove(winCompenent) {}
  }
}
</script>

<style lang="scss" scoped></style>
