<template>
  <div class="gis-fly-to">
    <!--  -->
    <!-- <input type="text" class="queryButton"> -->
    <button type="button" class="queryButton" @click="flyTo1()"><span>飞到点位</span></button>
    <button type="button" class="queryButton" @click="flyTo()"><span>飞到点位</span></button>
  </div>
</template>

<script>
/*global */ // SuperMap3D
let viewer, entityFeature
import { YFGis } from '../../common'
import videoData from './data/video.json'
export default {
  name: 'GisFlyTo',
  data() {
    return {
    }
  },
  mounted() {
    this.$nextTick(() => {
      viewer = window.viewer
      console.log(viewer)
      //   viewer.resolutionScale = 0.8
      this.ref = YFGis.UUID.randomUUID()
      entityFeature = new YFGis.EntityFeature(viewer)
      //   console.log(entityFeature)

      entityFeature.createFeatures(videoData, false)
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
    flyTo1() {
    //   const cameraPosition = SuperMap3D.Cartesian3.fromDegrees(106.78031174785976, 31.846162552963076, 354.91073496209117 + 1550)

    //   viewer.scene.camera.flyTo({
    //     destination: cameraPosition
    //   })
    },
    flyTo() {
    //   const target = SuperMap3D.Cartesian3.fromDegrees(106.78031174785976, 31.846162552963076, 354.91073496209117)
      const position = { longitude: 106.78031174785976, latitude: 31.846162552963076, height: 354.91073496209117 }

      YFGis.Scene.flyTo(viewer, position, -30, 1550, () => {
        console.log('141234')
      })
    },
    clear() {}
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
