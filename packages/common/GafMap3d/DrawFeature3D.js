/*global Cesium,SuperMap*/
import { createTooltip } from '../YFGis3d/Utils/tooltip'
import { cesiumToSuperMap } from '../YFGis3d/Utils/convert'
/**
 *绘制几何图形类
 *
 * @class DrawFeature3D
 */
class DrawFeature3D {
  constructor(map) {
    this.map = map
    this.drawPolygon = null
    this.drawPoint = null
    this.drawLine = null
    this.drawPolygonByGround = null
    this.drawPointByGround = null
    this.drawLineByGround = null
  }
  /**
   * 获取单击cesium获取的经纬度点
   *
   * @param {Object} 单击的位置
   * @memberof DrawFeature3D
   */
  selectCanvasPoint(e) {
    const mousePosition = this.map.scene.pickPosition(e.position)
    // 将笛卡尔坐标转化为经纬度坐标
    const cartographic = Cesium.Cartographic.fromCartesian(mousePosition)
    const longitude = Cesium.Math.toDegrees(cartographic.longitude)
    const latitude = Cesium.Math.toDegrees(cartographic.latitude)
    let height = cartographic.height
    if (height < 0) {
      height = 0
    }
    return new SuperMap.Geometry.Point(longitude, latitude)
  }
  /**
   *多边形绘制
   *
   * @param {Function} 绘制完成后的回调函数 回调函数的参数是多边形对象及其点数组
   * @param {boolean} [isDeactivate=true]
   * @memberof DrawFeature3D
   */
  startDrawPolygon(drawCompleted, isDeactivate = true) {
    const that = this
    const drawPolygon = this.drawPolygon
    function featureAdded(drawEventArgs) {
      isDeactivate && that.drawPolygon.deactivate()
      if (typeof drawCompleted === 'function') {
        drawCompleted(drawEventArgs)
      }
    }
    that.deactivate()
    // that._clearDrawedLayer();
    if (drawPolygon !== null) {
      drawPolygon.activate()
    } else {
      that._addDrawPolygon()
      that.drawPolygon.activeEvt.addEventListener(function(isActive) {
        if (isActive === true) {
          that.map.enableCursorStyle = false
          that.map._element.style.cursor = 'crosshair'
        } else {
          that.map.enableCursorStyle = true
          that.map._element.style.cursor = ''
        }
      })
      // 获取当前地图的窗口div
      const tooltip = createTooltip(document.body)
      that.drawPolygon.movingEvt.addEventListener(function(windowPosition) {
        if (windowPosition.x < 210 && windowPosition.y < 120) {
          tooltip.setVisible(false)
          return
        }
        if (that.drawPolygon.isDrawing) {
          tooltip.showAt(windowPosition, '<p>点击绘制中间点</p><p>右键单击结束绘制</p>')
        } else {
          tooltip.showAt(windowPosition, '<p>点击绘制第一个点</p>')
        }
      })
      that.drawPolygon.drawEvt.addEventListener(function(result) {
        const cartographicArr = result.object.positions.map((item) => {
          const cartograhphic = Cesium.Cartographic.fromCartesian(item)
          return {
            lon: Cesium.Math.toDegrees(cartograhphic.longitude),
            lat: Cesium.Math.toDegrees(cartograhphic.latitude),
            height: cartograhphic.height
          }
        })
        tooltip.setVisible(false)
        that.drawPolygon.polygon.show = false
        that.drawPolygon.polyline.show = true
        const geometry = cesiumToSuperMap.convertPolygon(Cesium, SuperMap, result.object.positions)
        // const pointArr = cesiumToSuperMap.getPointArr(
        //   Cesium,
        //   SuperMap,
        //   result.object
        // )
        // featureAdded({ geometry, pointArr })
        featureAdded({ geometry, cartographicArr })
      })
      that.drawPolygon.activate()
    }
  }
  /**
   *多边形绘制,贴地模式
   *
   * @param {Function} 绘制完成后的回调函数 回调函数的参数是多边形对象及其点数组
   * @param {boolean} [isDeactivate=true]
   * @memberof DrawFeature3D
   */
  startDrawPolygonByGround(drawCompleted, isDeactivate = true) {
    const that = this
    const drawPolygonByGround = this.drawPolygonByGround
    function featureAdded(drawEventArgs) {
      isDeactivate && that.drawPolygonByGround.deactivate()
      if (typeof drawCompleted === 'function') {
        drawCompleted(drawEventArgs)
      }
    }
    that.deactivate()
    // that._clearDrawedLayer();
    if (drawPolygonByGround !== null) {
      drawPolygonByGround.activate()
    } else {
      that._addDrawPolygonByGround()
      that.drawPolygonByGround.activeEvt.addEventListener(function(isActive) {
        if (isActive === true) {
          that.map.enableCursorStyle = false
          that.map._element.style.cursor = 'crosshair'
        } else {
          that.map.enableCursorStyle = true
          that.map._element.style.cursor = ''
        }
      })
      // 获取当前地图的窗口div
      const tooltip = createTooltip(document.body)
      that.drawPolygonByGround.movingEvt.addEventListener(function(windowPosition) {
        if (windowPosition.x < 210 && windowPosition.y < 120) {
          tooltip.setVisible(false)
          return
        }
        if (that.drawPolygonByGround.isDrawing) {
          tooltip.showAt(windowPosition, '<p>点击绘制中间点</p><p>右键单击结束绘制</p>')
        } else {
          tooltip.showAt(windowPosition, '<p>点击绘制第一个点</p>')
        }
      })
      that.drawPolygonByGround.drawEvt.addEventListener(function(result) {
        const cartographicArr = result.object.map((item) => {
          const cartograhphic = Cesium.Cartographic.fromCartesian(item)
          return {
            lon: Cesium.Math.toDegrees(cartograhphic.longitude),
            lat: Cesium.Math.toDegrees(cartograhphic.latitude),
            height: cartograhphic.height
          }
        })
        tooltip.setVisible(false)
        // that.drawPolygonByGround.polygon.show = false;
        // that.drawPolygonByGround.polyline.show = true;
        const geometry = cesiumToSuperMap.convertPolygon(Cesium, SuperMap, result.object)
        // const pointArr = cesiumToSuperMap.getPointArr(
        //   Cesium,
        //   SuperMap,
        //   result.object
        // )
        // featureAdded({ geometry, pointArr })
        featureAdded({ geometry, cartographicArr })
      })
      that.drawPolygonByGround.activate()
    }
  }
  /**
   *多边形绘制
   *
   * @param {Function} drawCompleted 绘制完成后的回调函数 回调函数的参数绘制后的默认多边形对象result
   * @param {boolean} [isDeactivate=true]
   * @memberof DrawFeature3D
   */
  startDrawPolygonEx(drawCompleted, isDeactivate = true) {
    const that = this
    const drawPolygon = this.drawPolygon
    function featureAdded(drawEventArgs) {
      isDeactivate && that.drawPolygon.deactivate()
      if (typeof drawCompleted === 'function') {
        drawCompleted(drawEventArgs)
      }
    }
    that.deactivate()
    that._clearDrawedLayer()
    if (drawPolygon !== null) {
      drawPolygon.activate()
    } else {
      that._addDrawPolygon()
      that.drawPolygon.activeEvt.addEventListener(function(isActive) {
        if (isActive === true) {
          that.map.enableCursorStyle = false
          that.map._element.style.cursor = ''
        } else {
          that.map.enableCursorStyle = true
        }
      })
      // 获取当前地图的窗口div
      const tooltip = createTooltip(document.body)
      that.drawPolygon.movingEvt.addEventListener(function(windowPosition) {
        if (windowPosition.x < 210 && windowPosition.y < 120) {
          tooltip.setVisible(false)
          return
        }
        if (that.drawPolygon.isDrawing) {
          tooltip.showAt(windowPosition, '<p>点击确定查询区域中间点</p><p>右键单击结束绘制</p>')
        } else {
          tooltip.showAt(windowPosition, '<p>点击绘制查询区域第一个点</p>')
        }
      })
      that.drawPolygon.drawEvt.addEventListener(function(result) {
        that.map.enableCursorStyle = true
        tooltip.setVisible(false)
        featureAdded(result)
      })
      that.drawPolygon.activate()
    }
  }
  /**
   *绘制线
   *
   * @param {Function} 绘制完成后的回调函数
   * @param {boolean} [isDeactivate=true]
   * @memberof DrawFeature3D
   */
  startDrawLine(drawCompleted, isDeactivate = true) {
    const that = this
    const drawLine = this.drawLine
    function featureAdded(drawEventArgs) {
      isDeactivate && that.drawLine.deactivate()
      if (typeof drawCompleted === 'function') {
        drawCompleted(drawEventArgs)
      }
    }
    that.deactivate()
    // that._clearDrawedLayer();
    if (drawLine !== null) {
      drawLine.activate()
    } else {
      that._addDrawLine()
      that.drawLine.activeEvt.addEventListener(function(isActive) {
        if (isActive === true) {
          that.map.enableCursorStyle = false
          that.map._element.style.cursor = 'crosshair'
        } else {
          that.map.enableCursorStyle = true
          that.map._element.style.cursor = ''
        }
      })
      // 获取当前地图的窗口div
      const tooltip = createTooltip(document.body)
      that.drawLine.movingEvt.addEventListener(function(windowPosition) {
        if (windowPosition.x < 210 && windowPosition.y < 120) {
          tooltip.setVisible(false)
          return
        }
        if (that.drawLine.isDrawing) {
          tooltip.showAt(windowPosition, '<p>点击绘制中间点</p><p>右键单击结束绘制</p>')
        } else {
          tooltip.showAt(windowPosition, '<p>点击绘制第一个点</p>')
        }
      })
      that.drawLine.drawEvt.addEventListener(function(result) {
        tooltip.setVisible(false)
        // that.drawLine.polyline.show = false;
        const geometry = cesiumToSuperMap.convertPolyline(Cesium, SuperMap, result.object)
        featureAdded({ geometry })
      })
      that.drawLine.activate()
    }
  }
  /**
   *绘制线,贴地模式
   *
   * @param {Function} 绘制完成后的回调函数
   * @param {boolean} [isDeactivate=true]
   * @memberof DrawFeature3D
   */
  startDrawLineByGround(drawCompleted, isDeactivate = true) {
    const that = this
    const drawLineByGround = this.drawLineByGround
    function featureAdded(drawEventArgs) {
      isDeactivate && that.drawLineByGround.deactivate()
      if (typeof drawCompleted === 'function') {
        drawCompleted(drawEventArgs)
      }
    }
    that.deactivate()
    // that._clearDrawedLayer();
    if (drawLineByGround !== null) {
      drawLineByGround.activate()
    } else {
      that._addDrawLineByGround()
      that.drawLineByGround.activeEvt.addEventListener(function(isActive) {
        if (isActive === true) {
          that.map.enableCursorStyle = false
          that.map._element.style.cursor = 'crosshair'
        } else {
          that.map.enableCursorStyle = true
          that.map._element.style.cursor = ''
        }
      })
      // 获取当前地图的窗口div
      const tooltip = createTooltip(document.body)
      that.drawLineByGround.movingEvt.addEventListener(function(windowPosition) {
        if (windowPosition.x < 210 && windowPosition.y < 120) {
          tooltip.setVisible(false)
          return
        }
        if (that.drawLineByGround.isDrawing) {
          tooltip.showAt(windowPosition, '<p>点击绘制中间点</p><p>右键单击结束绘制</p>')
        } else {
          tooltip.showAt(windowPosition, '<p>点击绘制第一个点</p>')
        }
      })
      that.drawLineByGround.drawEvt.addEventListener(function(result) {
        tooltip.setVisible(false)
        // that.drawLine.polyline.show = false;
        const geometry = cesiumToSuperMap.convertPolyline(Cesium, SuperMap, result.object)
        featureAdded({ geometry })
      })
      that.drawLineByGround.activate()
    }
  }
  /**
   *矩形绘制
   *
   * @param {Function} 绘制完成后的回调函数
   * @param {boolean} [isDeactivate=true]
   * @memberof DrawFeature3D
   */
  createRectangle(leftBottom, rightTop) {
    const rectangle = new SuperMap.Geometry.Rectangle(leftBottom.x, leftBottom.y, rightTop.x, rightTop.y)
    return rectangle
  }
  /**
   * 启动点绘制
   * @param drawCompleted 绘制完成后的回调函数
   * @param isDeactivate 绘制完成后是否禁用绘制，默认为true
   */
  startDrawPoint(drawCompleted, isDeactivate = true) {
    const that = this
    const drawPoint = this.drawPoint
    function featureAdded(drawEventArgs) {
      isDeactivate && that.drawPoint.deactivate()
      if (typeof drawCompleted === 'function') {
        drawCompleted(drawEventArgs)
      }
    }
    this.deactivate()
    if (drawPoint !== null) {
      drawPoint.activate()
    } else {
      this._addDrawPoint()
      that.drawPoint.drawEvt.addEventListener(function(result) {
        const geometry = cesiumToSuperMap.convertPoint(Cesium, SuperMap, result.object.position)
        featureAdded(geometry)
        // featureAdded(result);
      })
      that.drawPoint.activate()
    }
  }
  /**
   * 启动点绘制，贴地模式
   * @param drawCompleted 绘制完成后的回调函数
   * @param isDeactivate 绘制完成后是否禁用绘制，默认为true
   */
  startDrawPointByGround(drawCompleted, isDeactivate = true) {
    const that = this
    const drawPoint = this.drawPointByGround
    function featureAdded(drawEventArgs) {
      isDeactivate && that.drawPointByGround.deactivate()
      if (typeof drawCompleted === 'function') {
        drawCompleted(drawEventArgs)
      }
    }
    this.deactivate()
    if (drawPoint !== null) {
      drawPoint.activate()
    } else {
      this._addDrawPointByGround()
      that.drawPointByGround.drawEvt.addEventListener(function(result) {
        const geometry = cesiumToSuperMap.convertPoint(Cesium, SuperMap, result.object.position)
        featureAdded(geometry)
        // featureAdded(result);
      })
      that.drawPointByGround.activate()
    }
  }
  /**
   * 停止绘制点
   *
   * @memberof DrawFeature3D
   */
  stopDrawPoint() {
    this.drawPoint && this.drawPoint.clear() && this.drawPoint.deactivate()
  }
  /**
   * 停止绘制点,贴地模式
   *
   * @memberof DrawFeature3D
   */
  stopDrawPointByGround() {
    this.drawPointByGround && this.drawPointByGround.clear() && this.drawPointByGround.deactivate()
  }
  /**
   * 将当前场景中添加的图层都清空删除
   */
  _clearDrawedLayer() {
    if (this.map && this.map.entities) {
      this.map.entities.removeAll()
    }
  }
  // 添加绘制多边形工具
  _addDrawPolygon() {
    if (this.drawPolygon === null) {
      const drawPolygon = new Cesium.DrawHandler(this.map, Cesium.DrawMode.Polygon)
      this.drawPolygon = drawPolygon
    }
  }
  // 添加绘制多边形工具，贴地模式
  _addDrawPolygonByGround() {
    if (this.drawPolygonByGround === null) {
      const drawPolygonByGround = new Cesium.DrawHandler(this.map, Cesium.DrawMode.Polygon, 3)
      this.drawPolygonByGround = drawPolygonByGround
    }
  }
  // 停止绘制多边形
  stopDrawPolygon() {
    this.drawPolygon && this.drawPolygon.clear() && this.drawPolygon.deactivate()
  }
  // 停止绘制多边形,贴地模式
  stopDrawPolygonByGround() {
    this.drawPolygonByGround && this.drawPolygonByGround.clear() && this.drawPolygonByGround.deactivate()
  }
  // 添加绘制点工具
  _addDrawPoint() {
    if (this.drawPoint === null) {
      const drawPoint = new Cesium.DrawHandler(this.map, Cesium.DrawMode.Point)
      this.drawPoint = drawPoint
    }
  }
  // 添加绘制点工具,贴地模式
  _addDrawPointByGround() {
    if (this.drawPointByGround === null) {
      const drawPointByGround = new Cesium.DrawHandler(this.map, Cesium.DrawMode.Point, 1)
      this.drawPointByGround = drawPointByGround
    }
  }
  // 添加绘制线工具
  _addDrawLine() {
    if (this.drawLine === null) {
      const drawLine = new Cesium.DrawHandler(this.map, Cesium.DrawMode.Line)
      this.drawLine = drawLine
    }
  }
  // 添加绘制线工具,贴地模式
  _addDrawLineByGround() {
    if (this.drawLineByGround === null) {
      const drawLineByGround = new Cesium.DrawHandler(this.map, Cesium.DrawMode.Line, 1)
      this.drawLineByGround = drawLineByGround
    }
  }
  // 停止绘制线
  stopDrawLine() {
    this.drawLine && this.drawLine.clear() && this.drawLine.deactivate()
  }
  // 停止绘制线,贴地模式
  stopDrawLineByGround() {
    this.drawLineByGround && this.drawLineByGround.clear() && this.drawLineByGround.deactivate()
  }
  convertPoint(Cesium, SuperMap, point) {
    if (!Cesium || !SuperMap || !point) {
      return undefined
    }
    const lonlatPoint = Cesium.Cartographic.fromCartesian(point)
    const x = Cesium.Math.toDegrees(lonlatPoint.longitude)
    const y = Cesium.Math.toDegrees(lonlatPoint.latitude)
    if (x && y) {
      return new SuperMap.Geometry.Point(x, y)
    }
    return undefined
  }
  // 根据点坐标几何,转换成点
  getGeoPoint(x, y) {
    if (x && y) {
      return new SuperMap.Geometry.Point(x, y)
    }
    return undefined
  }
  // 根据点集合{x,y}转成多边形
  getGeoPolygon(pointsArr) {
    const geoPoints = pointsArr.map((p) => {
      return this.getGeoPoint(p.x, p.y)
    })
    if (geoPoints.length > 3) {
      const linearRings = new SuperMap.Geometry.LinearRing(geoPoints)
      const region = new SuperMap.Geometry.Polygon([linearRings])
      return region
    }
    return undefined
  }
  /**
   * 释放已创建的对象
   */
  dispose() {
    this.deactivate()
    this.drawPolygon = null
    this.drawPoint = null
    this.drawLine = null
    this.drawPolygonByGround = null
    this.drawPointByGround = null
    this.drawLineByGround = null
  }
  deactivate() {
    this.stopDrawPolygon()
    this.stopDrawPoint()
    this.stopDrawLine()
    this.stopDrawPolygonByGround()
    this.stopDrawPointByGround()
    this.stopDrawLineByGround()

    // this._clearDrawedLayer()
  }
}
export default DrawFeature3D
