<template>
  <div class="safmain" style="min-width: 60px;">
    {{ guide.description }}
  </div>
</template>

<script>
export default {
  props: {
    guide: {
      type: Object,
      required: true
    }
  }
}
</script>

<style>
.safmain{
    position: relative;
    width: auto;
    height: 32px;
    font-size: 16px;
    line-height: 32px;
    border-radius: 5px;
    padding: 0 10px;
    background: #fcfcfc;
}
</style>
