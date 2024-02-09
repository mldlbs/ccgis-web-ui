<template>
  <div v-show="show" class="safmain">12341
    <span @click="close">关闭</span>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      show: true
    }
  }
}
</script>

<style>
.safmain{
    position: relative;
    width: 300px;
    height: 200px;
    background: #272525;
}
</style>
