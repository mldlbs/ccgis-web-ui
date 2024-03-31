<template>
  <div class="custom-video">
    <div class="panelButton">
      <button type="button" class="queryButton" @click="addFeatures(1001)"><span>打开已经创建的面板</span></button>
      <button type="button" class="queryButton" @click="addFeatures(1002)"><span>关闭已经创建的面板</span></button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GisTest',
  mounted() {
  },
  methods: {
    addFeatures(type) {
    }
  }
}
</script>

<style scoped> </style>
