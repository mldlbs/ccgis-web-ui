<template>
  <div class="gis-pipe-burst">
    <!--  -->
  </div>
</template>

<script>
/*global */ // SuperMap3D
let viewer
import { YFGis } from '../../common'
export default {
  name: 'GisPipeBurst',
  data() {
    return {
    }
  },
  mounted() {
    this.$nextTick(() => {
      viewer = window.viewer
      viewer.resolutionScale = 0.8
      this.ref = YFGis.UUID.randomUUID()
    })

    let i = 0
    const hander = (data) => {
      console.log(i++, data)
    }
    const hander2 = (data) => {
      console.log(i++, data)
    }

    // YFGis.Event.selected.removeAll()
    YFGis.Event.selected.add(hander2)
    YFGis.Event.selected.remove(hander2)
    YFGis.Event.selected.add(hander)

    YFGis.Event.enter.add((data) => {
    })
    YFGis.Event.leave.add((data) => {
    })
    // YFGis.Event.picked.add((data) => {
    //   console.log(4, data)
    // })
  },
  destroyed() {
  },
  methods: {
    clear() {
    }
  }
}
</script>

<style scoped>
.gis-pipe-burst {
  display: flex;
  flex-flow: column nowrap;
}
/* .gis-pipe-burst span {
  cursor: pointer;
} */
</style>
