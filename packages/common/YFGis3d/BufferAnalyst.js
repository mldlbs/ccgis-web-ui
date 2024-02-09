/*global turf,SuperMap3D,SuperMap*/ // SuperMap, SuperMap3D turf
/*eslint new-cap: */

import DrawFeature from './DrawFeature'
import EntityFeature from './EntityFeature'
import QueryFeatures from './QueryFeatures'
// import getArea from './Utils/area'
import { DrawType, DrawTypeStyle } from './Utils/constant'
import Style from './Utils/style'
import UUID from './Utils/uuid'
import { singleton } from './Utils/singleton'

class BufferAnalystIns {
  constructor(viewer) {
    // if (!BufferAnalyst.instance) {
    this.viewer = viewer

    this.entityFeature = new EntityFeature(viewer)
    this.drawFeature = new DrawFeature(viewer, 'buffer-analyst-layer')
    this.dataSource = this.drawFeature.dataSource
    this.queryFeatures = new QueryFeatures()

    //   BufferAnalyst.instance = this
    // }
    // return BufferAnalyst.instance

    // viewer.scene.globe.depthTestAgainstTerrain = false

    this.currPoint = []
    this.features = []
  }

  /**
   *
   * @param {*} config
   * {
   *   type: point, // 绘制类型, point, polyline, ploygon, shp(点数组)
   * }
   */
  draw(config, callback) {
    this.bufferDistance = (config.distance || 10)
    this.points = []
    switch (config.type) {
      case 'point': {
        this.drawFeature.startDrawPoint(res => {
          const _points = res.cartographicArr
          this.currPoint = _points

          this.drawFeature.deactivate()
          if (_points.length === 0) return
          const points = _points.map(it => [it.longitude, it.latitude])

          const polygonF = turf.point(points[0])
          const buffer = this._pointsToBuffer(polygonF)

          this.points = buffer

          //   this.geometry = this._pointsToPolygon(buffer)
          this.geometry = res.geometry
          const geometries = this.geometries = _points.map((it, i) => {
            return {
              'type': 'POINT', 'id': i, 'points': [{ 'x': it.longitude, 'y': it.latitude }]
            }
          })

          if (callback) callback(geometries)
        })
        break
      }
      case 'polyline': {
        this.drawFeature.startDrawLine(res => {
          const _points = res.cartographicArr
          this.drawFeature.deactivate()

          if (_points.length === 0) return
          const points = _points.map(it => [it.longitude, it.latitude])

          const polygonF = turf.lineString(points)
          const buffer = this._pointsToBuffer(polygonF)

          this.points = buffer

          this.geometry = res.geometry

          const geometries = this.geometries = _points.map((it, i) => {
            return {
              'type': 'POINT', 'id': i, 'points': [{ 'x': it.longitude, 'y': it.latitude }]
            }
          })

          if (callback) callback(geometries)
        })
        break
      }
      case 'polygon': {
        this.drawFeature.startDrawPolygon(res => {
          const _points = res.cartographicArr
          this.drawFeature.deactivate()

          _points.push(_points[0])

          if (_points.length === 0) return
          const points = _points.map(it => [it.longitude, it.latitude])

          const polygonF = turf.polygon([points])
          const buffer = this._pointsToBuffer(polygonF)

          this.points = buffer

          this.geometry = res.geometry

          const geometries = this.geometries = _points.map((it, i) => {
            return {
              'type': 'POINT', 'id': i, 'points': [{ 'x': it.longitude, 'y': it.latitude }]
            }
          })
          if (callback) callback(geometries)
        })
        break
      }
      case 'shape': {
        // this.drawFeature.startDrawPoint(res => {
        //   console.log(res)
        // })
        break
      }
    }
  }

  calcArea() {
    return turf.area(this.buffer)
  }

  drawBuffer() {
    this._drawCompleted(this.points)
  }

  analyze(config, markConf, callback) {
    const du = 0.00000899
    this.queryFeatures.queryMapFeaturesByBuffer(config.dataUrl, config.dataSource, config.dataSet,
      this.geometry,
      this.bufferDistance * du
    ).then((res) => {
      const result = res.result
      const _result = {
        count: result.featureCount
      }
      this.queryFeatures
        .queryRestFields(config.dataUrl, config.dataSource, config.dataSet)
        .then(fieldInfos => {
          this._addFeatures(result, fieldInfos, markConf)
          if (callback) callback(_result)
        })
    })
  }

  minDistance(config, markConf, callback) {
    this.queryFeatures.getMinDistanceIDsByGeometry(config.analysisUrl, config.dataSource, config.dataSet, this.geometries, 0, -1).then(result => {
      if (result.length > 0) {
        const smid = result[0].referenceGeometryIDs[0]
        this.queryFeatures
          .queryMapFeaturesBySQL(config.dataUrl, config.dataSource, config.dataSet, 'SMID = ' + smid)
          .then(res => {
            const result = res.result
            this.queryFeatures
              .queryRestFields(config.dataUrl, config.dataSource, config.dataSet)
              .then(fieldInfos => {
                const list = this._addFeatures(result, fieldInfos, markConf)
                if (callback) callback(list)
              })
          })
      }
    })
  }

  minDistancePoints(from, tos = []) {
    if (tos.length === 0) return
    const fromJson = turf.point([from.longitude, from.latitude])
    tos.forEach((item, i) => {
      const to = item.position
      const toJson = turf.point([to.longitude, to.latitude])
      const options = { units: 'miles' }
      const distance = turf.rhumbDistance(fromJson, toJson, options)
      tos[i].distance = distance
    })
    tos.sort((a, b) => a.distance - b.distance)
    return tos[0]
  }

  _addFeatures(result, fieldInfos, markConf) {
    const features = result.features

    const list = []
    features.forEach(fea => {
      const _data = fea.data
      const label = this._createLabel(_data, markConf.label)
      const geometry = fea.geometry
      const featrue = {
        id: UUID.randomUUID(),
        label: label,
        type: markConf.type,
        position: {
          longitude: geometry.x,
          latitude: geometry.y,
          height: _data[markConf.height] || 365
        },
        data: {
          param: _data,
          fieldInfos,
          dataType: markConf.dataType
        },
        style: markConf.style
      }

      list.push(featrue)
      this.features.push(featrue)
    })
    this.entityFeature.createFeatures(list, false)
    return list
  }

  _createLabel(_data, label) {
    let _label = ''

    if (label && typeof (label) !== 'string') {
      _label = {
        ...label,
        text: _data[label.field]
      }
    } else {
      _label = _data[label]
    }

    return _label
  }

  _drawCompleted(buffer) {
    const positions = []
    buffer.forEach(_p => {
      positions.push(SuperMap3D.Cartesian3.fromDegrees(parseFloat(_p[0]), parseFloat(_p[1]), 0))
    })
    const _style = Style.buffer(DrawTypeStyle[DrawType.POLYGON])
    this.drawFeature.drawShape(positions, _style)
    this.drawFeature.deactivate()
  }

  _pointsToDegreesArray(points) {
    const degreesArray = []
    points.map(item => {
      degreesArray.push(item.longitude)
      degreesArray.push(item.latitude)
    })
    return degreesArray
  }

  _pointsToBuffer(polygonF) {
    const buffered = this.buffer = turf.buffer(polygonF, this.bufferDistance, {
      units: 'meters'
    })
    const dis = this.bufferDistance > 1000 ? this.bufferDistance : 1000
    const buffered2 = (turf.buffer(polygonF, dis, {
      units: 'meters'
    }))
    const bbox2 = turf.bbox(buffered2)
    const rectangle = new SuperMap3D.Rectangle.fromDegrees(...bbox2)
    this.viewer.scene.camera.flyTo({
      destination: rectangle,
      duration: 3
    })
    const coordinates = buffered.geometry.coordinates
    const points = coordinates[0]
    return points
  }

  _pointsToPolygon(points) {
    if (!SuperMap || !points) {
      return undefined
    }
    if (points && Array.isArray(points) && points.length >= 3) {
      const arr = points.map(it => new SuperMap.Geometry.Point(it[0], it[1]))
      const linearRing = new SuperMap.Geometry.LinearRing(arr)
      return new SuperMap.Geometry.Polygon([linearRing])
    }
    return undefined
  }

  visible(show) {
    const entities = this.entityFeature.dataSource.entities
    this.features.forEach(fea => {
      const entity = entities._entities._array.find((e) => e.id === fea.id)
      if (entity) {
        entity.show = show
      }
    })
  }

  clear() {
    this.dataSource.entities.removeAll()
    this.entityFeature.clear()
    // this.drawFeature.clear()
  }
}

const BufferAnalyst = singleton(BufferAnalystIns)
export default BufferAnalyst
