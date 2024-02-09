<template>
  <div class="gis-query">
    <!--  -->
    <div class="panelButton">
      <button type="button" class="queryButton" @click="selectPoints(0)"><span>sql查询(源)</span></button>
      <button type="button" class="queryButton" @click="selectPoints(1)"><span>sql查询</span></button>
      <button type="button" class="queryButton" @click="selectPoints(2)"><span>字段查询</span></button>
    </div>
  </div>
</template>

<script>
/*global */ // SuperMap3D
let queryFeatures
let popupFeature
import { YFGis } from '../../common'
export default {
  name: 'GisQuery',
  data() {
    return {
      length: 0,
      tCar: 0,
      tMan: 0
    }
  },
  mounted() {
    this.$nextTick(() => {
      queryFeatures = new YFGis.QueryFeatures()
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
      console.log(data)
    })
    YFGis.Event.leave.add((data) => {
      popupFeature.close('123412')
    })
  },
  destroyed() {},
  methods: {
    selectPoints(type) {
      switch (type) {
        case 0:
          queryFeatures.queryMapFeaturesBySQL('http://117.176.63.158:31111/iserver/services/data-JGTT/rest/data', 'JGTT', 'YJJYJD', 'SMID < 10').then((res) => {
            // const features = res.features
            // features.forEach(feature => {
            // //   const data = queryFeatures.fieldArrayToObject(feature.fieldNames, feature.fieldValues)
            console.log(res)
            // })
          })
          break
        case 1:
          queryFeatures.queryRestMapFeaturesBySQL('http://117.176.63.158:31111/iserver/services/data-JGTT/rest/data', 'JGTT', 'YJJYJD', 'SMID < 10').then((res) => {
            console.log(res)
            const features = res.features
            features.forEach(feature => {
              const data = queryFeatures.fieldArrayToObject(feature.fieldNames, feature.fieldValues)
              console.log(data)
            })
          })
          break
        case 2:
          queryFeatures.queryRestFields('http://117.176.63.158:31111/iserver/services/data-JGTT/rest/data', 'JGTT', 'YJJYJD').then((res) => {
            console.log(res)
          })
          break
        default:
          break
      }
    }
  }
}
</script>

<style scoped>
.gis-pipe-burst {
  display: flex;
  flex-flow: column nowrap;
  /* width: 260px; */
}

.panelButton .queryButton {
  margin: 0 5px;
  height: 23px;
}

button {
  background: transparent;
  color: var(--base-light-color, #45c3ff);
  border-radius: 6px;
  border: solid 1px var(--base-light-color, #45c3ff);
  padding: 0 5px;
  cursor: pointer;
}
/* .gis-pipe-burst span {
  cursor: pointer;
} */

.item2 {
  width: 150px;
}
</style>
