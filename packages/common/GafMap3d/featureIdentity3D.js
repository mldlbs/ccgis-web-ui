/**
 *要素识别功能
 *
 * @class FeatureIdentity3D
 */
class FeatureIdentity3D {
  constructor(map) {
    this.map = map
    // 绘制工具对象
    this.selectHandler = null
    //  单击事件时执行的方法（回调函数）
    this.selectCanvasPoint = null
  }

  // 创建绘制对象
  createHandler() {
    if (!this.selectHandler || this.selectHandler.isDestroyed()) {
      this.selectHandler = new Cesium.ScreenSpaceEventHandler(this.map.scene.canvas)
    }
  }
  /**
   *执行识别功能
   *
   * @param {Function} selectCanvasPoint 识别功能的回调函数,有个参数e
   * @memberof FeatureIdentity3D
   */
  identityTool(selectCanvasPoint) {
    this.createHandler()
    this.selectCanvasPoint = selectCanvasPoint
    // 设置鼠标左键单击回调事件
    if (this.selectHandler.getInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK) === undefined) {
      this.selectHandler.setInputAction(selectCanvasPoint, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    }
  }
  /**
   * 清除注销事件
   *
   * @memberof FeatureIdentity3D
   */
  deactivate() {
    if (this.selectHandler && !this.selectHandler.isDestroyed()) {
      this.selectHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
      this.selectHandler.destroy()
      this.selectHandler = null
    }
  }
  /**
   *清除图层中的要素
   *
   * @memberof FeatureIdentity3D
   */
  clearAllEntities() {
    if (this.map) {
      this.map.entities.removeAll()
    }
  }
}
export default FeatureIdentity3D
