/*global SuperMap,SuperMap3D*/

// 地图实体对象的操作
const cesiumOp = {
  map: null,
  getGeometry(_features) {
    const geometrys = []
    if (_features) {
      if (_features instanceof SuperMap.Geometry) {
        geometrys.push(_features)
      } else if (_features instanceof SuperMap.Feature) {
        geometrys.push(_features.geometry)
      } else if (Array.isArray(_features)) {
        for (let i = 0; i < _features.length; i++) {
          if (_features[i]) {
            const features = _features[i].features
            if (features && features.length > 0) {
              for (let j = 0; j < features.length; j++) {
                const feature = features[j]
                if (feature instanceof SuperMap.Feature) {
                  geometrys.push(feature.geometry)
                }
              }
            }
          }
        }
      }
    }
    return geometrys
  },
  /**
   * 将要素添加到三维场景中，并设置id=entityId
   *
   * @param {Object} feature 添加的要素对象
   * @param {String Number} entityId 设置实体对象的Id
   */
  addFeature(feature, entityId) {
    if (feature) {
      const geometrys = this.getGeometry(feature)
      if (geometrys && geometrys.length > 0) {
        for (let i = 0; i < geometrys.length; i++) {
          const pointArr = this.GetPolygonPoints(geometrys[i])
          this.removeEntity(entityId)
          this.map.entities.add({
            id: entityId,
            polygon: {
              hierarchy: SuperMap3D.Cartesian3.fromDegreesArray(pointArr),
              material: SuperMap3D.Color.fromBytes(255, 0, 0, 75),
              outline: true,
              outlineWidth: 5,
              outlineColor: SuperMap3D.Color.fromCssColorString('#41cb06')
            }
          })
        }
      }
    }
  },
  /**
   * 根据点数组绘制id = entityId的实体对象
   *
   * @param {Array} pointArr 点集合数据[经度，纬度，经度，纬度]
   * @param {String|Number} entityId 设置实体对象的Id
   */
  addEntityByPoints(pointArr, entityId) {
    this.removeEntity(entityId)
    this.map.entities.add({
      id: entityId,
      // polygon: {
      //   hierarchy: SuperMap3D.Cartesian3.fromDegreesArray(pointArr),
      //   material: SuperMap3D.Color.fromBytes(255, 0, 0, 75),
      //   outline: true,
      //   outlineWidth: 1,
      //   outlineColor: SuperMap3D.Color.fromCssColorString('#41cb06'),
      //   height: 100
      // }
      polyline: {
        positions: SuperMap3D.Cartesian3.fromDegreesArray(pointArr),
        material: SuperMap3D.Color.fromCssColorString('#41cb06'),
        width: 3
      }
    })
  },
  /**
   * 获取面要素的所有点集合
   *
   * @param {Object} geometry 面要素
   * @returns 返回点集合
   */
  GetPolygonPoints(geometry) {
    const pointArr = []
    if (geometry && geometry instanceof SuperMap.Geometry.MultiPolygon) {
      const polygons = excuteMultiPolygon(geometry)
      for (let i = 0; i < polygons.length; i++) {
        const geoPolygon = polygons[i]
        const LinearRings = excutePolygon(geoPolygon)
        for (let j = 0; j < LinearRings.length; j++) {
          const geoLine = LinearRings[j]
          const points = excuteLinearRing(geoLine)
          excutePoints(points)
        }
      }
    }
    if (geometry && geometry instanceof SuperMap.Geometry.Polygon) {
      const LinearRings = excutePolygon(geometry)
      for (let j = 0; j < LinearRings.length; j++) {
        const geoLine = LinearRings[j]
        const points = excuteLinearRing(geoLine)
        excutePoints(points)
      }
    }
    if (geometry && geometry instanceof SuperMap.Geometry.LinearRing) {
      const points = excuteLinearRing(geometry)
      excutePoints(points)
    }
    function excuteMultiPolygon(geometry) {
      const geometrys = geometry.components
      return geometrys
    }
    function excutePolygon(geometry) {
      const geometrys = geometry.components
      return geometrys
    }
    function excuteLinearRing(geometry) {
      const geometrys = geometry.components
      return geometrys
    }
    function excutePoints(geometry) {
      if (geometry) {
        geometry.map(item => {
          pointArr.push(item.x, item.y)
        })
      }
    }
    return pointArr
  },
  /**
   *缩放到指定的要素的中心点,并添加Marker实体，id设置为id
   *
   * @param {Object} feature 要素
   * @param {String|Number} id 设置实体对象的Id
   */
  zoomToFeatureA(feature, id) {
    if (this.map && feature && feature.geometry) {
      const geo = feature.geometry
      let centerPoint
      if (geo.getCentroid) {
        centerPoint = geo.getCentroid()
      } else if (geo.center) {
        centerPoint = feature.geometry.center
      }
      if (centerPoint) {
        this.flyToPoint(centerPoint.x, centerPoint.y)
        this.addMarkEntity(centerPoint.x, centerPoint.y, id)
      }
    }
  },
  /**
   *缩放到指定的要素的矩形范围,并添加Marker实体，id设置为id
   *
   * @param {Object} feature 要素
   * @param {String|Number} id 设置实体对象的Id
   */
  zoomToFeature(feature, id) {
    if (this.map && feature && feature.geometry) {
      const geo = feature.geometry
      let centerPoint
      if (geo.getCentroid) {
        centerPoint = geo.getCentroid()
      } else if (geo.center) {
        centerPoint = feature.geometry.center
      }
      if (centerPoint) {
        this.flyToFeature(feature)
        this.addMarkEntity(centerPoint.x, centerPoint.y, id)
      }
    }
  },
  /**
   *飞行到指定点
   *
   * @param {Number} x 经度
   * @param {Number} y 纬度
   */
  flyToPoint(x, y) {
    // 获取高度
    const height = this.map.scene.getHeight(x, y)
    this.map.scene.camera.flyTo({
      destination: SuperMap3D.Cartesian3.fromDegrees(x, y, height),
      duration: 1.0
    })
  },
  /**
   *飞行到指定要素的矩形范围内
   *
   * @param {Object} feature 要素
   */
  flyToFeature(feature) {
    if (!feature || !feature.data) return
    const result = this.getRectangle(feature)
    const rec = SuperMap3D.Rectangle.fromDegrees(
      result.west,
      result.south,
      result.east,
      result.north
    )
    this.map.scene.camera.flyTo({
      destination: rec,
      duration: 1.0
    })
  },
  /**
   * 根据点对象，定位到图形范围
   *
   * @param {Object} pointArrObj 点对象数组[{x:x1,y:y1}, {x:x2,y:y2}]
   */
  flyToGeometry(pointArrObj) {
    const result = this.getRectByPointArr(pointArrObj)
    const rec = SuperMap3D.Rectangle.fromDegrees(
      result.west,
      result.south,
      result.east,
      result.north
    )
    this.map.scene.camera.flyTo({
      destination: rec,
      duration: 1.0
    })
  },
  /**
   * 根据点对象，定位到图形范围
   *
   * @param {Object} pointArr [经度,纬度，经度，纬度....]
   */
  flyToGeometryByPoints(pointArr) {
    const result = this.getRectByPoints(pointArr)
    const rec = SuperMap3D.Rectangle.fromDegrees(
      result.west,
      result.south,
      result.east,
      result.north
    )
    this.map.scene.camera.flyTo({
      destination: rec,
      duration: 1.0
    })
  },
  /**
   *给地图添加标记 设置id = entityId
   *
   * @param {Number} x 经度
   * @param {Number} y 纬度
   * @param {String|Number} id 设置实体对象的Id
   */
  addMarkEntity(x, y, entityId) {
    this.removeEntity(entityId)
    this.map.entities.add({
      position: SuperMap3D.Cartesian3.fromDegrees(x, y, 30),
      billboard: {
        image: './viewer/earth/js/theme/images/marker.png',
        width: 24,
        height: 18
      },
      id: entityId
    })
  },
  /**
   *移除指定id的实体
   *
   * @param {String|Number} id 删除对象的Id
   */
  removeEntity(id) {
    const entity = this.map.entities.getById(id)
    if (entity) {
      this.map.entities.remove(entity)
    }
  },
  /**
   *删除多个实体对象
   *
   * @param {Array} ids 删除对象的集合
   */
  removeEntities(ids) {
    ids.forEach(p => {
      this.removeEntity(p)
    })
  },
  /**
   * 清除地图中所有的实体对象
   *
   */
  removeAllEntities() {
    if (this.map) {
      this.map.entities.removeAll()
    }
  },
  /**
   * 获取要素的矩形边界
   *
   * @param {Object} feature 要素
   * @returns 返回矩形坐标{ west, north, east, south }
   */
  getRectangle(feature) {
    if (feature && feature.data) {
      const west = feature.data.SMSDRIW
      const north = feature.data.SMSDRIN
      const east = feature.data.SMSDRIE
      const south = feature.data.SMSDRIS
      return { west, north, east, south }
    }
    return null
  },
  /**
   *获取要素的矩形边界
   *
   * @param {Object} pointArr 点对象数组[{x:x1,y:y1}, {x:x2,y:y2}]
   * @returns 返回矩形坐标{ west, north, east, south }
   */
  getRectByPointArr(pointArr) {
    const logArr = []
    const latArr = []
    pointArr.forEach(p => {
      logArr.push(p.x)
      latArr.push(p.y)
    })
    const west = Math.min(...logArr)
    const east = Math.max(...logArr)
    const south = Math.min(...latArr)
    const north = Math.max(...latArr)
    return { west, north, east, south }
  },
  /**
   * 根据点数组获取出矩形的边界
   *
   * @param {*} pointArr [经度,纬度，经度，纬度....]
   * @returns 返回矩形坐标{ west, north, east, south }
   */
  getRectByPoints(pointArr) {
    const logArr = []
    const latArr = []
    pointArr.forEach((p, index) => {
      if (index % 2 === 0) {
        logArr.push(p)
      } else {
        latArr.push(p)
      }
    })
    const west = Math.min(...logArr)
    const east = Math.max(...logArr)
    const south = Math.min(...latArr)
    const north = Math.max(...latArr)
    return { west, north, east, south }
  },
  /**
   *根据ids列表，设置对应模型的颜色
   *
   * @param {String} layerName
   * @param {Array} ids
   * @param {*} color
   */
  setObjsColor(layerName, ids, color) {
    if (this.map) {
      const layer = this.map.scene.layers.find(layerName)
      layer.setObjsColor(ids, color)
    }
  },
  /**
   *根据图元ID列表移除相应图元被设置的颜色。
   *
   * @param {String} layerName 场景中图层的名称
   * @param {Array} ids
   */
  removeObjsColor(layerName, ids) {
    if (this.map) {
      const layer = this.map.scene.layers.find(layerName)
      layer.removeObjsColor(ids)
    }
  },
  /**
   *将点对象数组转换为数组
   *
   * @param  {Array} pointArrObj 点对象数组[{x:x1,y:y1}, {x:x2,y:y2}]
   * @returns 返回[x1,y1,x2,y2.....]
   */
  pointObjToPointArr(pointArrObj) {
    const pointArr = []
    pointArrObj.forEach(p => {
      pointArr.concat(p.x, p.y)
    })
    return pointArr
  }
}
export { cesiumOp }
