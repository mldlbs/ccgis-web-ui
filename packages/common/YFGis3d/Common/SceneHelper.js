/*global SuperMap3D*/ // SuperMap SuperMap3D
import EventHelper from './EventHelper'

class Scene {
  initEvent(viewer) {
    this.eventHelper = new EventHelper(viewer)
  }

  switch2D(viewer) {
    const centerResult = viewer.camera.pickEllipsoid(
      new SuperMap3D.Cartesian2(
        viewer.canvas.clientWidth / 2,
        viewer.canvas.clientHeight / 2
      )
    )

    const curPosition = SuperMap3D.Ellipsoid.WGS84.cartesianToCartographic(centerResult)
    const curLongitude = (curPosition.longitude * 180) / Math.PI
    const curLatitude = (curPosition.latitude * 180) / Math.PI
    viewer.camera.flyTo({
      destination: SuperMap3D.Cartesian3.fromDegrees(
        curLongitude,
        curLatitude, //  - 0.025
        // Number(data.LONGITUDE) || point.longitude,
        // Number(data.LATITUDE) || point.latitude,
        5000
      ),
      duration: 3
    })
  }
  switch3D(viewer) {

  }

  flyTo(viewer, target, pitch, range, complete) {
    if (!target) return console.warn('flyTo: target is required')
    const isDegrees = target => 'longitude' in target && 'latitude' in target
    const isCartesian = target => 'x' in target && 'y' in target

    const center = [
      { check: isDegrees, create: target => SuperMap3D.Cartesian3.fromDegrees(target.longitude, target.latitude, target.height || 0) },
      { check: isCartesian, create: target => target }
    ].find(candidate => candidate.check(target))

    if (!center) return console.warn('target is required')

    const boundingSphere = new SuperMap3D.BoundingSphere(center.create(target), 1)
    pitch = SuperMap3D.Math.toRadians(pitch || -90)
    viewer.scene.camera.flyToBoundingSphere(boundingSphere, {
      offset: new SuperMap3D.HeadingPitchRange(SuperMap3D.Math.toRadians(0.0), pitch, range || 1550),
      complete: () => {
        if (typeof complete === 'function') complete()
      }
    })
  }
}

export default new Scene()
