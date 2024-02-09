/*global SuperMap3D,*/ // SuperMap
/*eslint new-cap: */

export default class VideoShed {
    static instance
    constructor(viewer) {
      this.drwing = true
      if (VideoShed.instance) {
        return VideoShed.instance
      }
      VideoShed.instance = this
      this.viewer = viewer

      this._projectionImage = undefined
      this.screenSpaceHandler = new SuperMap3D.ScreenSpaceEventHandler(viewer.canvas)
      this.create()
      this.addInputAction()
    }

    addInputAction() {
      this.screenSpaceHandler.setInputAction((mvEvt) => {
        if (!this.drwing) return
        const newPosition = this.viewer.scene.pickPosition(mvEvt.endPosition)
        const cartograhphic = SuperMap3D.Cartographic.fromCartesian(newPosition)
        const longitude = SuperMap3D.Math.toDegrees(cartograhphic.longitude)
        const latitude = SuperMap3D.Math.toDegrees(cartograhphic.latitude)
        const height = cartograhphic.height
        this.target = [longitude, latitude, height]
        this._projectionImage.distance = 999
      }, SuperMap3D.ScreenSpaceEventType.MOUSE_MOVE)
    }

    /**
     * @param {any} val
     */
    set horizontalFov(val) {
      this._projectionImage.horizontalFov = val
    }

    /**
     * @param {any} val
     */
    set verticalFov(val) {
      this._projectionImage.verticalFov = val
    }
    /**
     * @param {any} val [longitude, latitude, height]
     */
    set target(val) {
      if (val) { this._projectionImage.setDistDirByPoint(val) }
    }
    /**
     * @param {any} val [longitude, latitude, height]
     */
    set position(val) {
      if (!val) {
        const wgsPosition = this.viewer.scene.camera.positionCartographic
        const longitude = SuperMap3D.Math.toDegrees(wgsPosition.longitude)
        const latitude = SuperMap3D.Math.toDegrees(wgsPosition.latitude)
        const height = wgsPosition.height
        val = [longitude, latitude, height]
      }
      this._projectionImage.viewPosition = val
    }

    /**
     * @param {any} val
     */
    set video(val) {
      if (val) {
        this._projectionImage.setImage({
          video: val
        })
      }
    }

    create() {
      const projectionImage = new SuperMap3D.ProjectionImage(this.viewer.scene)
      projectionImage.distance = 999
      projectionImage.setClipMode(SuperMap3D.ModifyRegionMode.CLIP_INSIDE)
      this._projectionImage = projectionImage
      //   this.update(option)
    }

    update(option) {
      this.position = option.position
      this.target = option.target
      this.horizontalFov = option.hfov || 20
      this.verticalFov = option.vfov || 10
      this.video = option.video

      this._projectionImage.distance = 99999999

      this._projectionImage.removeAllClipRegion()
      this._projectionImage.build()
      this.drwing = false
    }

    active() {
      this.drwing = true
    }

    deactive() {
      this.drwing = false
    }

    clear() {
      this._projectionImage.removeAllClipRegion()
      this.instance = undefined
    }
}
