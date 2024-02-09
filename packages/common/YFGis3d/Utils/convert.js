/*global */
const superMap3DToSuperMap = {
  convertPoint(SuperMap3D, SuperMap, point) {
    if (!SuperMap3D || !SuperMap || !point) {
      return undefined
    }
    const lonlatPoint = SuperMap3D.Cartographic.fromCartesian(point)
    const x = SuperMap3D.Math.toDegrees(lonlatPoint.longitude)
    const y = SuperMap3D.Math.toDegrees(lonlatPoint.latitude)
    const z = lonlatPoint.height
    if (x && y) {
      return new SuperMap.Geometry.Point(x, y, z || 0)
    }
    return undefined
  },
  convertPolyline(SuperMap3D, SuperMap, polyline) {
    if (!SuperMap3D || !SuperMap || !polyline) {
      return undefined
    }
    const points = polyline.positions
    if (points && Array.isArray(points) && points.length >= 2) {
      const arr = []
      for (let i = 0, j = points.length; i < j; i++) {
        const point = this.convertPoint(SuperMap3D, SuperMap, points[i])
        if (point) {
          arr.push(point)
        }
      }
      return new SuperMap.Geometry.LineString(arr)
    }
    return undefined
  },
  convertPolygon(SuperMap3D, SuperMap, polygon) {
    if (!SuperMap3D || !SuperMap || !polygon) {
      return undefined
    }
    const points = polygon.positions
    if (points && Array.isArray(points) && points.length >= 3) {
      const arr = []
      for (let i = 0, j = points.length; i < j; i++) {
        const point = this.convertPoint(SuperMap3D, SuperMap, points[i])
        if (point) {
          arr.push(point)
        }
      }
      const linearRing = new SuperMap.Geometry.LinearRing(arr)
      return new SuperMap.Geometry.Polygon(linearRing)
    }
    return undefined
  },
  /**
   * 获取绘制的多边形几何对象和点集合
   *
   * @param {*} SuperMap3D
   * @param {*} SuperMap
   * @param {*} polygon 绘制的多边形
   * @returns {geometry, pointArr}
   */
  convertPolygonEx(SuperMap3D, SuperMap, polygon) {
    if (!SuperMap3D || !SuperMap || !polygon) {
      return undefined
    }
    const points = polygon.positions
    if (points && Array.isArray(points) && points.length >= 3) {
      const pointArr = []
      for (let i = 0, j = points.length; i < j; i++) {
        const point = this.convertPoint(SuperMap3D, SuperMap, points[i])
        if (point) {
          pointArr.push(point)
        }
      }
      const linearRing = new SuperMap.Geometry.LinearRing(pointArr)
      const geometry = new SuperMap.Geometry.Polygon(linearRing)
      return { geometry, pointArr }
    }
    return undefined
  },
  // 获取多边形的点数组
  getPointArr(SuperMap3D, SuperMap, polygon) {
    if (!SuperMap3D || !SuperMap || !polygon) {
      return undefined
    }
    const points = polygon.positions
    if (points && Array.isArray(points) && points.length >= 3) {
      const arr = []
      for (let i = 0, j = points.length; i < j; i++) {
        const lonlatPoint = SuperMap3D.Cartographic.fromCartesian(points[i])
        const x = SuperMap3D.Math.toDegrees(lonlatPoint.longitude)
        const y = SuperMap3D.Math.toDegrees(lonlatPoint.latitude)
        arr.push(x, y)
      }
      return arr
    }
    return undefined
  }
}
const superMapToSuperMap3D = {
  geometryToEntity(SuperMap3D, SuperMap, geometry) {
    const className = geometry.CLASS_NAME
    if (className === 'SuperMap.Geometry.MultiPolygon') {
      return this.multipolygonToEntities(SuperMap3D, SuperMap, geometry)
    } else if (className === 'SuperMap.Geometry.Polygon') {
      return [this.polygonToEntity(SuperMap3D, SuperMap, geometry)]
    }
    return undefined
  },
  polygonToEntity(SuperMap3D, SuperMap, geometry) {
    const hierarchy1 = {}
    for (let i = 0, j = geometry.components.length; i < j; i++) {
      if (i === 0) {
        hierarchy1.positions = this.GeometrytoDegreesArray(
          SuperMap3D,
          SuperMap,
          geometry.components[i]
        )
      } else {
        if (!hierarchy1.holes) {
          hierarchy1.holes = []
        }
        hierarchy1.holes.push({
          positions: this.GeometrytoDegreesArray(
            SuperMap3D,
            SuperMap,
            geometry.components[i]
          )
        })
      }
    }
    return new SuperMap3D.Entity({
      polygon: {
        hierarchy: hierarchy1,
        material: SuperMap3D.Color.BLUE.withAlpha(0.5)
      },
      depthTestEnabled: false
    })
  },
  multipolygonToEntities(SuperMap3D, SuperMap, geometry) {
    const components = geometry.components
    const resultEntities = []
    let entity = null
    for (const item in components) {
      entity = this.polygonToEntity(SuperMap3D, SuperMap, components[item])
      resultEntities.push(entity)
    }
    return resultEntities
  },
  GeometrytoDegreesArray(SuperMap3D, SuperMap, geometry) {
    const vertices = geometry.getVertices()
    const degreesArr = []
    for (const o in vertices) {
      degreesArr.push(vertices[o].x, vertices[o].y)
    }
    return SuperMap3D.Cartesian3.fromDegreesArray(degreesArr)
  }
}
const superMapToSuperMap3DEx = {
  geometryToEntity(SuperMap3D, SuperMap, geometry, symbolStyle) {
    const className = geometry.id
    if (className.includes('SuperMap.Geometry.MultiPolygon')) {
      return this.multipolygonToEntities(
        SuperMap3D,
        SuperMap,
        geometry,
        symbolStyle
      )
    } else if (className.includes('SuperMap.Geometry.Polygon')) {
      return [this.polygonToEntity(SuperMap3D, SuperMap, geometry, symbolStyle)]
    }
    return undefined
  },
  polygonToEntity(SuperMap3D, SuperMap, geometry, symbolStyle) {
    const hierarchy1 = {}
    for (let i = 0, j = geometry.components.length; i < j; i++) {
      if (i === 0) {
        hierarchy1.positions = this.GeometrytoDegreesArray(
          SuperMap3D,
          SuperMap,
          geometry.components[i]
        )
      } else {
        if (!hierarchy1.holes) {
          hierarchy1.holes = []
        }
        hierarchy1.holes.push({
          positions: this.GeometrytoDegreesArray(
            SuperMap3D,
            SuperMap,
            geometry.components[i]
          )
        })
      }
    }
    return new SuperMap3D.Entity({
      polygon: {
        hierarchy: hierarchy1,
        material:
          SuperMap3D.Color.fromCssColorString(symbolStyle.fillColor) ||
          SuperMap3D.Color.BLUE.withAlpha(0.5),
        outline: true,
        outlineWidth: symbolStyle.outlineWidth || 5,
        outlineColor: SuperMap3D.Color.fromCssColorString(symbolStyle.borderColor)
        // height: 100
      },
      depthTestEnabled: false
    })
  },
  multipolygonToEntities(SuperMap3D, SuperMap, geometry, symbolStyle) {
    const components = geometry.components
    const resultEntities = []
    let entity = null
    for (const item in components) {
      entity = this.polygonToEntity(
        SuperMap3D,
        SuperMap,
        components[item],
        symbolStyle
      )
      resultEntities.push(entity)
    }
    return resultEntities
  },
  GeometrytoDegreesArray(SuperMap3D, SuperMap, geometry) {
    const vertices = geometry.getVertices()
    const degreesArr = []
    for (const o in vertices) {
      degreesArr.push(vertices[o].x, vertices[o].y)
    }
    return SuperMap3D.Cartesian3.fromDegreesArray(degreesArr)
  }
}

export { superMap3DToSuperMap, superMapToSuperMap3D, superMapToSuperMap3DEx }
