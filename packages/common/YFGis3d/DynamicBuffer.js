/*global SuperMap3D, SuperMap*/ // SuperMap
class DynamicBuffer {
  constructor(viewer) {
    this.viewer = viewer
  }

  create(callback) {
    this.callback = callback
    this.viewer.scene.camera.moveEnd.removeEventListener(this._listener.bind(this))
    this.viewer.scene.camera.moveEnd.addEventListener(this._listener.bind(this))
  }

  _listener() {
    // 计算相机高度
    const height = this.viewer.scene.camera.positionCartographic.height
    let pitch = this.viewer.scene.camera.pitch

    pitch = pitch * (180 / Math.PI)

    let geometry = null

    if (height < 15000 && pitch < -30) {
      const centerResult = this.viewer.camera.pickEllipsoid(new SuperMap3D.Cartesian2(this.viewer.canvas.clientWidth / 2, this.viewer.canvas.clientHeight / 2))
      const curPosition = SuperMap3D.Ellipsoid.WGS84.cartesianToCartographic(centerResult)
      const longitude = (curPosition.longitude * 180) / Math.PI
      const latitude = (curPosition.latitude * 180) / Math.PI
      geometry = new SuperMap.Geometry.Point(longitude, latitude, 0)
    }
    // 计算场景中心点
    // 返回buffer
    this.callback(geometry)
  }
  clear() {}
}

export default DynamicBuffer
