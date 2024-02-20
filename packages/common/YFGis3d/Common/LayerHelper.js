/*global */ // SuperMap SuperMap3D
class Layer {
  constructor(config) {
    this.viewer = config.viewer
  }
  setInitParam(layers, config = {}) {
    const _layers = this.viewer.scene.layers
    _layers.layerQueue.forEach(ly => {
      if (!ly.layerInfo) return
      const id = layers.find(id => id === ly.layerInfo.resourceId)
      if (id) {
        ly.LoadingPriority = config.LoadingPriority || 3
        ly.translucencyByDistance = true // 雾化加载
        console.log('s3mlayer: ', ly)
      }
    })
  }

  setColorParam(layerid, config = {}) {
    const _layers = this.viewer.scene.layers
    _layers.layerQueue.forEach(ly => {
      if (!ly.layerInfo) return
      if (layerid === ly.layerInfo.resourceId) {
        ly.brightness = config.brightness || 1 // 亮度
        ly.contrast = config.contrast || 1 // 对比度
        ly.hue = config.hue || 1 // 色调
        ly.saturation = config.saturation || 1 // 饱和度
      }
    })

    const _imageryLayers = this.viewer.scene.imageryLayers._layers

    _imageryLayers.forEach(ly => {
      if (!ly.layerInfo) return
      if (layerid === ly.layerInfo.resourceId) {
        ly.brightness = config.brightness || 1 // 亮度
        ly.contrast = config.contrast || 1 // 对比度
        ly.hue = config.hue || 1 // 色调
        ly.saturation = config.saturation || 1 // 饱和度
      }
    })
  }

  setAlpha(layers, alpha = 1) {
    const _layers = this.viewer.scene.layers
    _layers.layerQueue.forEach(ly => {
      if (!ly.layerInfo) return
      const id = layers.find(id => id === ly.layerInfo.resourceId)
      if (id) {
        ly.style3D.fillForeColor.alpha = parseFloat(alpha)
      }
    })
  }
  visibleByIds(viewer, layerid, ids) {
    const _layers = this.viewer.scene.layers
    _layers.layerQueue.forEach(ly => {
      console.log(ly, layerid, ids)
      if (!ly.layerInfo) return
      if (layerid === ly.layerInfo.resourceId) {
        // ly.style3D.fillForeColor.alpha = parseFloat(alpha)
        ly.setObjsVisible(ids, true)
      }
    })
  }
}

export default Layer

