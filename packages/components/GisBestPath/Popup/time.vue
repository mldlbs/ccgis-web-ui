<template>
  <div class="safmain" style="min-width: 60px">
    <div>
      驾车：<span>{{ time.tcar }}分钟</span>
    </div>
    <div>
      步行：<span>{{ time.tman }}分钟</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    time: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.safmain {
  position: relative;
  width: 142px;
  height: 78px;
  color: #fff;
  font-size: 16px;
  line-height: 24px;
  border-radius: 5px;
  padding: 10px 10px 20px 15px;
  background: url(/static/images/marker/1000007911.png) no-repeat;
  background-size: 100% 100%;
}
div {
  width: 100%;
}
span {
  margin-left: 5px;
}
</style>
