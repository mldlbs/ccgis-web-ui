<template>
  <div>
    <div v-for="(dia) in dialogs" :key="dia.id" class="ccgis-dialog__list">
      <Component
        :is="dia.comp"
        v-show="true"
        :key="dia.id"
        :comp-data="dia.compData"
        @winActive="$handleWinActive"
        @winRemove="$handleWinRemove"
        @winDragStart="$winDragStart"
        @winDragEnd="$winDragEnd"
      />
    </div>
  </div>
</template>

<script>
import Bus, { Event } from '../../../utils/bus'
export default {
  name: 'GisDialogList',
  data() {
    return {
      dialogs: []
    }
  },
  created() {
    const _this = this
    Bus.$on(Event.Window.created, dia => {
      if (dia.isDialog) {
        const index = _this.dialogs.findIndex(it => it.type === dia.type)
        if (index > -1) return
        _this.dialogs.push(dia)
      }
    })

    Bus.$on(Event.Window.closed, dia => {
      if (dia.isDialog) {
        const index = _this.dialogs.findIndex(it => it.id === dia.id)
        if (index > -1) {
          _this.dialogs.splice(index, 1)
        }
      }
    })
  },
  methods: {
    $handleResize() {
      this.resize = new Date().getTime()
    },
    $handleWinActive(winInfo) {},
    $winDragStart() {},
    $winDragEnd() {},
    $handleWinRemove(winCompenent) {}
  }
}
</script>

<style lang="scss" scoped></style>
