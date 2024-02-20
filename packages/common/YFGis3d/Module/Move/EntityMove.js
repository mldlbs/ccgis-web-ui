// 移动轨迹
/*global Cesium, SuperMap3D*/ // SuperMap
class EntityMove {
    $inject = ['config']
    constructor(config) {
      if (!window.Cesium) {
        window.Cesium = SuperMap3D
      }
      this.viewer = config.viewer
      this.entities = []
    }

    create(hierarchy, animateEntity, speed, range, date) {
    // this.clear();
      this.entities.push(animateEntity)
      const timeObj = getSiteTimes(hierarchy, speed || 50)
      const startTime = Cesium.JulianDate.fromDate(date || new Date(2015, 2, 25, 16)) // Cesium.JulianDate.fromDate(new Date());
      const stopTime = Cesium.JulianDate.addSeconds(startTime, timeObj.timeSum, new Cesium.JulianDate())
      this.viewer.clock.startTime = startTime.clone()
      this.viewer.clock.stopTime = stopTime.clone()
      this.viewer.clock.currentTime = startTime.clone()
      this.viewer.clock.clockRange = Cesium.ClockRange.CLAMPED
      const property = computeCirclularFlight(hierarchy, startTime, timeObj.siteTimes)
      animateEntity.position = property
      animateEntity.orientation = new Cesium.VelocityOrientationProperty(property)
      animateEntity.availability = new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({ start: startTime, stop: stopTime })])
      // this.viewer.flyTo(animateEntity)
      this.viewer.trackedEntity = animateEntity
      animateEntity.viewFrom = new Cesium.Cartesian3(30, -30, range || 420)
      this.timoutId = setTimeout(e => {
        clearTimeout(this.timoutId)
        if (this.viewer.trackedEntity) {
          this.viewer.trackedEntity = undefined
          this.viewer.clock.clockRange = Cesium.ClockRange.UNBOUNDED
        }
      }, timeObj.timeSum * 1000)
    }

    createMutiFeature(hierarchy, animateEntities, speed, range) {
    // this.clear();
      const timeObj = getSiteTimes(hierarchy, speed || 50)
      // hierarchy = linearSplinePositions(timeObj.siteTimes, hierarchy);
      // timeObj = getSiteTimes(hierarchy, speed || 50);
      const startTime = Cesium.JulianDate.fromDate(new Date(2015, 2, 25, 16)) // Cesium.JulianDate.fromDate(new Date());
      const stopTime = Cesium.JulianDate.addSeconds(startTime, timeObj.timeSum, new Cesium.JulianDate())
      this.viewer.clock.startTime = startTime.clone()
      this.viewer.clock.stopTime = stopTime.clone()
      this.viewer.clock.currentTime = startTime.clone()
      this.viewer.clock.clockRange = Cesium.ClockRange.CLAMPED
      const property = computeCirclularFlight(hierarchy, startTime, timeObj.siteTimes)
      const orientationProperty = new Cesium.VelocityOrientationProperty(property)
      for (let i = 0; i < animateEntities.length; i++) {
        const animateEntity = animateEntities[i]
        this.entities.push(animateEntity)
        if (i === 0) {
          animateEntity.position = property
          animateEntity.viewFrom = new Cesium.Cartesian3(30, -30, range || 420)
          this.viewer.trackedEntity = animateEntity
        } else {
          animateEntity.position = Cesium.Cartesian3.fromDegrees(108, 34, 0)
        }
        animateEntity.orientation = orientationProperty
        animateEntity.availability = new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({ start: startTime, stop: stopTime })])
      }
      this.viewer.clock.onTick.addEventListener(() => {
        for (let i = 0; i < animateEntities.length; i++) {
          if (i === 0) { continue }
          const otherEntity = animateEntities[i]
          const carPosition = computePosition.call(this, property, i)
          otherEntity.position = carPosition
          const carOrientation = computeOrientation.call(this, orientationProperty, i)
          if (carOrientation) { otherEntity.orientation = carOrientation }
        }
      })
      this.timoutId = setTimeout(e => {
        clearTimeout(this.timoutId)
        if (this.viewer.trackedEntity) {
          this.viewer.trackedEntity = undefined
          this.viewer.clock.clockRange = Cesium.ClockRange.UNBOUNDED
        }
      }, timeObj.timeSum * 1000)
    }

    computeCirclularFlight(pArr, startTime, siteTimes) {
      var property = new Cesium.SampledPositionProperty()
      for (var i = 0; i < pArr.length; i++) {
        const time = Cesium.JulianDate.addSeconds(startTime, siteTimes[i], new Cesium.JulianDate())
        property.addSample(time, pArr[i])
      }
      return property
    }

    gpsPointsToCartesian3s(gpsPoints) {
      for (let i = 0; i < gpsPoints.length; i++) {
        const element = gpsPoints[i]
        gpsPoints[i] = Cesium.Cartesian3.fromDegrees(element[0], element[1], element[2])
      }
    }

    clear() {
      this.entities.forEach(item => {
        this.viewer.entities.remove(item)
      })
      this.entities = []
      clearTimeout(this.timoutId)
      if (this.viewer.trackedEntity) {
        this.viewer.trackedEntity = undefined
      }
    }
}
// export default function EntityMove(cc3dcesium) {
//   this.viewer = cc3dcesium.viewer
//   this.entities = []
// }
// EntityMove.$inject = ['cc3dcesium']

// let currEntity = undefined

// function linearSplinePositions(times, hierarchy) {
//   var spline = new Cesium.LinearSpline({
//     times: times,
//     points: hierarchy
//   })
//   const maxTime = parseInt(times[times.length - 1])
//   var positions = []
//   for (var i = 0; i <= 100; i++) {
//     var cartesian3 = spline.evaluate(i * maxTime / 100)
//     positions.push(cartesian3)
//   }
// }

function computePosition(property, index) {
  var currentTime = Cesium.JulianDate.clone(this.viewer.clock.currentTime)
  const dt = Cesium.JulianDate.toDate(currentTime)
  var ndt = new Date(dt.getTime() - 400 * index)
  var time = new Cesium.JulianDate()
  Cesium.JulianDate.fromDate(ndt, time)
  var carPosition = property.getValue(time)
  return carPosition
}

function computeOrientation(orientation, index) {
  var currentTime = Cesium.JulianDate.clone(this.viewer.clock.currentTime)
  const dt = Cesium.JulianDate.toDate(currentTime)
  var ndt = new Date(dt.getTime() - 400 * index)
  var time = new Cesium.JulianDate()
  Cesium.JulianDate.fromDate(ndt, time)
  var carOrientation = orientation.getValue(time)
  return carOrientation
}

function computeCirclularFlight(pArr, startTime, siteTimes) {
  var property = new Cesium.SampledPositionProperty()
  for (var i = 0; i < pArr.length; i++) {
    const time = Cesium.JulianDate.addSeconds(startTime, siteTimes[i], new Cesium.JulianDate())
    const position = pArr[i]
    if (position) { property.addSample(time, position) }
  }
  return property
}

function getSiteTimes(pArr, speed) {
  // pArr = getLinearPoints(pArr);
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
    const point1cartographic = Cesium.Cartographic.fromCartesian(positions[i])
    const point2cartographic = Cesium.Cartographic.fromCartesian(positions[i + 1])
    /** 根据经纬度计算出距离**/
    const geodesic = new Cesium.EllipsoidGeodesic()
    geodesic.setEndPoints(point1cartographic, point2cartographic)
    let s = geodesic.surfaceDistance
    // 返回两点之间的距离
    s = Math.sqrt(Math.pow(s, 2) + Math.pow(point2cartographic.height - point1cartographic.height, 2))
    distance = distance + s
  }
  return distance.toFixed(2)
}

export default EntityMove
