// 闪烁点
/*global Cesium, SuperMap3D*/ // SuperMap

class AlertMarker {
    $inject = ['config'];
    constructor(config) {
      if (!window.Cesium) {
        window.Cesium = SuperMap3D
      }
      this.viewer = config.viewer
    }

    create(cfg) {
      this.position = cfg.position
      this.color = cfg.color || Cesium.Color.RED
      this.iconUrl = cfg.iconUrl
      this.pixelSize = cfg.pixelSize || 10
      this.pixelMax = cfg.pixelMax || 50
      this.outWidth = cfg.outWidth || 20
      this.createMarker()
      return this.markerEntity
    }

    // 闪烁点
    createMarker() {
      let markerOpacity = 1
      let a = true
      let pixelSize = this.pixelSize
      let n = true
      let outLineOpacity = 0.7
      let o = true
      //   const t = 0
      const pixelMax = this.pixelMax
      this.markerEntity = this.viewer.entities.add({
        position: this.position
      })

      this.markerEntity.point = {
        color: new Cesium.CallbackProperty(() => {
          a ? (markerOpacity -= 0.03, markerOpacity <= 0 && (a = false)) : (markerOpacity = 1, a = true)
          return this.color.withAlpha(markerOpacity)
        }, false),
        pixelSize: new Cesium.CallbackProperty((time, result) => {
          n ? (pixelSize += 2, pixelSize >= pixelMax && (n = false)) : (pixelSize = 10, n = true)
          return pixelSize
        }, false),
        outlineColor: new Cesium.CallbackProperty(() => {
          o ? (outLineOpacity -= 0.035, outLineOpacity <= 0 && (o = false)) : (outLineOpacity = 0.7, o = true)
          return this.color.withAlpha(outLineOpacity)
        }, false),
        outlineWidth: this.outWidth,
        scaleByDistance: new Cesium.NearFarScalar(1200, 1, 5200, 0.4)
      }

      if (this.iconUrl) {
        this.markerEntity.billboard = {
          image: this.iconUrl,
          scaleByDistance: new Cesium.NearFarScalar(1200, 1, 5200, 0.4), // 设置随图缩放距离和比例
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 10000) // 设置可见距离 10000米可见
        }
      }
    }

    remove() {
      this.viewer.entities.remove(this.markerEntity)
      this.markerEntity = undefined
    }
}

export default AlertMarker

