<template>
  <div style="position: absolute;">
    <div class="ccgis-component">
      <div v-for="(dia) in renderDialogs" :key="dia.id" class="ccgis-dialog__list">
        <Component
          :is="dia.component"
          :key="dia.id"
          :config="dia.config"
          @winActive="$handleWinActive"
          @winRemove="$handleWinRemove"
          @winDragStart="$winDragStart"
          @winDragEnd="$winDragEnd"
          @handleEnter="$handleEnter"
        />
      </div>
      <editor-module :enter-style="enterStyle" :active-style="activeStyle" @handleMove="$handleMove" />
    </div>
  </div>
</template>

<script>
import Bus, { Event } from '../../../utils/bus'

import EditorModule from './editor'
export default {
  name: 'GisEditor',
  components: {
    EditorModule
  },
  data() {
    return {
      activeStyle: {},
      enterStyle: {},
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
    $handleResize(winInfo) {
      this.resize = new Date().getTime()
      console.log(winInfo)
    },
    $handleWinActive(winInfo) {
      console.log(winInfo)
    },
    $handleMove(winInfo) {
      // 鼠标移入面板参数
      this.enterStyle = winInfo
      this.renderDialogs.forEach(dia => {
        if (dia.config.id === winInfo.id) {
          dia.config.style.top = Number(winInfo.top)
          dia.config.style.left = Number(winInfo.left)
        }
      })
    },
    $handleEnter(winInfo) {
      // 鼠标移入面板参数
      this.enterStyle = winInfo
      console.log(winInfo.id)
    },
    $winDragStart(winInfo) {
      console.log(winInfo)
    },
    $winDragEnd(winInfo) {
      console.log(winInfo)
    },
    $handleWinRemove(winCompenent) {}
  }
}
</script>

<style lang="scss" scoped></style>
