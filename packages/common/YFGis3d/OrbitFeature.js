/*global SuperMap3D*/ // SuperMap
/*eslint new-cap: */
/**
 * 轨迹回放
 */
import DrawFeature from './DrawFeature'
import EntityFeature from './EntityFeature'
import { DrawType, DrawTypeStyle } from './Utils/constant'
import Style from './Utils/style'
import { singleton } from './Utils/singleton'

class OrbitFeatureIns {
  constructor(viewer) {
    if (!OrbitFeature.instance) {
      this.viewer = viewer

      this.entityFeature = new EntityFeature(viewer)
      this.drawFeature = new DrawFeature(viewer, 'orbit-layer')
      this.dataSource = this.drawFeature.dataSource
      OrbitFeature.instance = this
    }
    return OrbitFeature.instance
  }

  create(data) {
    const positions = this._hierarchy = []
    data.positions.forEach(_point => {
      positions.push(SuperMap3D.Cartesian3.fromDegrees(parseFloat(_point.longitude), parseFloat(_point.latitude), parseFloat(_point.height)))
    })
    const _style = Style.orbit(DrawTypeStyle[DrawType.POLYLINE])
    this.drawFeature.drawLine(positions, _style)

    if (!data.position) data.position = data.positions[0]
    this._addFeature(data)

    setTimeout(() => {
      this._createAnimate()
    }, 1000)
  }

  play() {
    const timeObj = this.timeObj
    this.viewer.clock.shouldAnimate = true
    this.viewer.trackedEntity = this._animateEntity
    this.timoutId = setTimeout(e => {
      clearTimeout(this.timoutId)
      if (this.viewer.trackedEntity) {
        this.viewer.trackedEntity = undefined
        this.viewer.clock.clockRange = SuperMap3D.ClockRange.UNBOUNDED
      }
    }, timeObj.timeSum * 1000)
  }

  reset() {
    this.viewer.clock.currentTime = this.viewer.clock.startTime
    this.viewer.clock.shouldAnimate = false
    this.viewer.trackedEntity = undefined
  }

  pause() {
    this.viewer.clock.shouldAnimate = false
    this.viewer.trackedEntity = undefined
  }

  speed(_val = 1) {
    this.viewer.clockViewModel.multiplier = _val
  }

  _createAnimate(speed = 50, range = 420) {
    const hierarchy = this._hierarchy
    const animateEntity = this._animateEntity
    const timeObj = getSiteTimes(hierarchy, speed)
    const startTime = SuperMap3D.JulianDate.fromDate(new Date(2015, 2, 25, 16)) // Cesium.JulianDate.fromDate(new Date());
    const stopTime = SuperMap3D.JulianDate.addSeconds(startTime, timeObj.timeSum, new SuperMap3D.JulianDate())
    this.viewer.clock.startTime = startTime.clone()
    this.viewer.clock.stopTime = stopTime.clone()
    this.viewer.clock.currentTime = startTime.clone()
    this.viewer.clock.clockRange = SuperMap3D.ClockRange.CLAMPED
    const property = this._computeCirclularFlight(hierarchy, startTime, timeObj.siteTimes)
    animateEntity.position = property
    animateEntity.orientation = new SuperMap3D.VelocityOrientationProperty(property)
    animateEntity.availability = new SuperMap3D.TimeIntervalCollection([new SuperMap3D.TimeInterval({ start: startTime, stop: stopTime })])
    // this.viewer.flyTo(animateEntity)
    this.viewer.trackedEntity = animateEntity
    animateEntity.viewFrom = new SuperMap3D.Cartesian3(30, -30, range)
    this.viewer.clock.shouldAnimate = false
    this.timeObj = timeObj
  }

  clear() {
    if (this.timoutId) clearTimeout(this.timoutId)
    this.dataSource.entities.removeAll()
    this._hierarchy = null
    this._animateEntity = null
    this.entityFeature.clear()
  }

  _computeCirclularFlight(pArr, startTime, siteTimes) {
    var property = new SuperMap3D.SampledPositionProperty()
    for (var i = 0; i < pArr.length; i++) {
      const time = SuperMap3D.JulianDate.addSeconds(startTime, siteTimes[i], new SuperMap3D.JulianDate())
      const position = pArr[i]
      //   position = this.viewer.scene.clampToHeight(position)
      if (position) { property.addSample(time, position) }
    }
    return property
  }

  _addFeature(_data) {
    const entity = this._animateEntity = this.entityFeature._createFeature(_data)
    this.dataSource.entities.add(entity)
    this.viewer.trackedEntity = this._animateEntity
  }
}

function getSiteTimes(pArr, speed) {
  let timeSum = 0
  const times = []
  for (var i = 0; i < pArr.length; i++) {
    if (i === 0) {
      times.push(0) // 第0个时间为0
      continue
    }
    timeSum += spaceDistance([pArr[i - 1], pArr[i]]) / speed
    times.push(timeSum)
  }
  return {
    timeSum: timeSum,
    siteTimes: times
  }
}

function spaceDistance(positions) {
  let distance = 0
  for (let i = 0; i < positions.length - 1; i++) {
    const point1cartographic = SuperMap3D.Cartographic.fromCartesian(positions[i])
    const point2cartographic = SuperMap3D.Cartographic.fromCartesian(positions[i + 1])
    /** 根据经纬度计算出距离**/
    const geodesic = new SuperMap3D.EllipsoidGeodesic()
    geodesic.setEndPoints(point1cartographic, point2cartographic)
    let s = geodesic.surfaceDistance
    // 返回两点之间的距离
    s = Math.sqrt(Math.pow(s, 2) + Math.pow(point2cartographic.height - point1cartographic.height, 2))
    distance = distance + s
  }
  return distance.toFixed(2)
}

const OrbitFeature = singleton(OrbitFeatureIns)

export default OrbitFeature
