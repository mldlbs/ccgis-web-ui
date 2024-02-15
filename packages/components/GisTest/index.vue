<template>
  <div class="custom-video">
    <div class="panelButton">
      <button type="button" class="queryButton" @click="addFeatures(1001)"><span>打开已经创建的面板</span></button>
      <button type="button" class="queryButton" @click="addFeatures(1002)"><span>关闭已经创建的面板</span></button>
    </div>
  </div>
</template>

<script>
import Bus, { Event } from '../../utils/bus'
export default {
  name: 'GisTest',
  methods: {
    addFeatures(type) {
      switch (type) {
        case 1001:
          Bus.$emit(Event.Window.show, { type: 'GisFeature' })
          break
        case 1002:
          break
        default:
          break
      }
    }
  }
}
</script>

<style scoped> </style>
