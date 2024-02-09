/*global SuperMap3D, SuperMap*/ // SuperMap Cesium
/*eslint new-cap: */
import { superMap3DToSuperMap } from './Utils/convert'

import Style from './Utils/style'
import Event from './Utils/event'
import { DrawType, DrawTypeStyle } from './Utils/constant'
import DataSource from './Common/DataSource'
import { singleton } from './Utils/singleton'

/**
 * 绘制几何图形类
 *
 * @class DrawFeature3D
 */
class DrawFeatureIns {
  constructor(viewer, dsName = 'temp-layer') {
    this.viewer = viewer
    this.screenSpaceHandler = new SuperMap3D.ScreenSpaceEventHandler(viewer.canvas)
    this.pickGlobe = true
    this.activeShapePoints = []
    this.activeShape = null
    this.type = DrawType.POLYGON
    this.styleType = DrawTypeStyle[this.type]
    this.isDeactivate = true

    const DataSourceFa = new DataSource(viewer)

    // 创建数据源
    // this.dataSource = DataSourceFa.create('sysDrawLayer')
    this.dataSource = DataSourceFa.create(dsName)
    this.viewer.dataSources.add(this.dataSource)

    // 初始化事件
    this._initInputAction()
  }

  _initInputAction() {
    const screenSpaceHandler = this.screenSpaceHandler
    // 移动事件
    screenSpaceHandler.setInputAction((mvEvt) => {
      if (this.isDeactivate) return
      const activeShapePoints = this.activeShapePoints
      const newPosition = this.viewer.scene.pickPosition(mvEvt.endPosition)
      if (SuperMap3D.defined(activeShapePoints)) {
        if (SuperMap3D.defined(newPosition)) {
          activeShapePoints.pop()
          activeShapePoints.push(newPosition)
        }
      }
    }, SuperMap3D.ScreenSpaceEventType.MOUSE_MOVE)
    // 点击事件
    screenSpaceHandler.setInputAction((event) => {
      if (this.isDeactivate) return
      const earthPosition = this.viewer.scene.pickPosition(event.position)

      if (SuperMap3D.defined(earthPosition)) {
        this._drawing(earthPosition)
        this.activeShapePoints.push(earthPosition)

        if (this.type === DrawType.POINT) {
          this._drawCompleted()
        } else if (this.activeShapePoints.length === 3 && (this.type === DrawType.CIRCLE || this.type === DrawType.RECTANGLE)) {
          this._drawCompleted()
        }
      }
    }, SuperMap3D.ScreenSpaceEventType.LEFT_CLICK)
    // 双击事件
    screenSpaceHandler.setInputAction((event) => {
      if (this.isDeactivate) return
      const earthPosition = this.viewer.scene.pickPosition(event.position)
      if (SuperMap3D.defined(earthPosition)) {
        this.activeShapePoints.pop()
        this.activeShapePoints.push(earthPosition)
      }
      this._drawCompleted()
    }, SuperMap3D.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
  }

  // 绘制点
  drawPoint(worldPosition, dstyle, dynamicFlag = false) {
    if (worldPosition && Array.isArray(worldPosition)) {
      worldPosition = worldPosition[0]
    }

    const _style = dstyle
    const opt = {
      position: worldPosition,
      point: {
        ..._style.style3D(),
        pixelSize: 10,
        // heightReference: SuperMap3D.HeightReference.CLAMP_TO_GROUND,
        disableDepthTestDistance: 50000
      }
    }
    const point = this.dataSource.entities.add(opt)
    return point
  }

  // 绘制线
  drawLine(positionData, dstyle, dynamicFlag = false) {
    const _style = dstyle
    var clampToGround = true
    const opt = {
      polyline: {
        ..._style.style3D(),
        positions: positionData,
        clampToGround: clampToGround, // 是否贴地
        disableDepthTestDistance: 50000
      }
    }
    const shape = this.dataSource.entities.add(opt)
    return shape
  }

  // 绘制图形
  drawShape(positionData, dstyle, dynamicFlag = false) {
    const _style = dstyle
    let shape = null
    const style2 = _style.style3D()
    style2.outlineWidth = 0
    const opt1 = {
      polygon: {
        ...style2,
        // material: SuperMap3D.Color.BLUE.withAlpha(0.5),
        perPositionHeight: false,
        hierarchy: positionData,
        fill: true,
        disableDepthTestDistance: 50000
        // clampToS3M: true // 设置贴对象(s3m)
      }
    }
    shape = this.dataSource.entities.add(opt1)
    shape.sysStyle = _style
    return shape
  }

  // 绘制过程
  _drawing(earthPosition) {
    const activeShapePoints = this.activeShapePoints

    if (activeShapePoints.length === 0 && this.type !== DrawType.POINT) {
      const dstyle = Style.drawing(DrawTypeStyle[DrawType.POINT])
      this.activeShape = this.drawPoint(earthPosition, dstyle, true)
    }
    if (activeShapePoints.length === 1) {
      this.dataSource.entities.remove(this.activeShape) // 去除点图形
      if (this.type === DrawType.POLYGON) {
        const dynamicPositions = new SuperMap3D.CallbackProperty(() => {
          return activeShapePoints
        }, false)
        const dstyle = Style.drawing(DrawTypeStyle[DrawType.POLYLINE])
        this.activeShape = this.drawLine(dynamicPositions, dstyle, true)
      } else if (this.type !== DrawType.POINT) {
        const dynamicPositions = new SuperMap3D.CallbackProperty(() => {
          return activeShapePoints
        }, false)
        const dstyle = Style.drawing(DrawTypeStyle[DrawType.POLYLINE])
        this.activeShape = this.drawLine(dynamicPositions, dstyle, true) // 绘制动态图
      }
    }
    if (activeShapePoints.length === 2) {
      if (this.type === DrawType.POLYGON) {
        this.dataSource.entities.remove(this.activeShape) // 去除线图形
        const dynamicPositions = new SuperMap3D.CallbackProperty(() => {
          if (this.type === DrawType.POLYGON) {
            const pots = JSON.parse(JSON.stringify(activeShapePoints))
            return new SuperMap3D.PolygonHierarchy(pots)
          }
        }, false)
        const dstyle = Style.drawing(DrawTypeStyle[DrawType.POLYGON])
        this.activeShape = this.drawShape(dynamicPositions, dstyle, true) // 绘制动态图
      }
    }
  }

  // 绘制结束
  _drawCompleted() {
    // this.activeShapePoints = [...this.activeShapePoints]
    // console.log(this.activeShapePoints, this.activeShapePoints.length)
    // console.log(this.activeShapePoints, this.activeShapePoints.length)
    this.activeShapePoints.pop() // 去除最后一个动态点
    // 去除动态图形
    this.dataSource.entities.removeAll()
    if (this.activeShapePoints.length > 0) {
      this.drawActive = false
      if (this.type !== DrawType.POINT) this.activeShapePoints.pop()
      const dstyle = Style.draw(this.styleType)
      const entity = this.completedDrawShape(this.activeShapePoints, dstyle) // 绘制最终图

      entity.symbolName = 'draw'
      const cartographicArr = this.activeShapePoints.map((cartesian3) => {
        const cartograhphic = SuperMap3D.Cartographic.fromCartesian(cartesian3)
        return {
          longitude: SuperMap3D.Math.toDegrees(cartograhphic.longitude),
          latitude: SuperMap3D.Math.toDegrees(cartograhphic.latitude),
          height: cartograhphic.height
        }
      })
      const positions = this.type === DrawType.POINT ? this.activeShapePoints[0] : { positions: this.activeShapePoints }
      const geometry = superMap3DToSuperMap.convertGeometry(SuperMap3D, SuperMap, positions)
      this.drawCompleted({ geometry, cartographicArr })

      this.drawActive = true
    }
    this.activeShape = undefined
    this.activeShapePoints = []
  }

  startDrawPolygon(drawCompleted, isDeactivate = false) {
    Event.drawStart.dispatch()
    superMap3DToSuperMap.convertGeometry = superMap3DToSuperMap.convertPolygon
    this.drawCompleted = drawCompleted
    this.type = DrawType.POLYGON
    this.styleType = DrawTypeStyle[this.type]
    this.isDeactivate = isDeactivate
    this.viewer.enableCursorStyle = false
    this.viewer._element.style.cursor = ''
    this.completedDrawShape = this.drawShape
  }

  startDrawLine(drawCompleted, isDeactivate = false) {
    Event.drawStart.dispatch()
    superMap3DToSuperMap.convertGeometry = superMap3DToSuperMap.convertPolyline
    this.drawCompleted = drawCompleted
    this.type = DrawType.POLYLINE
    this.styleType = DrawTypeStyle[this.type]
    this.isDeactivate = isDeactivate
    this.viewer.enableCursorStyle = false
    this.viewer._element.style.cursor = ''
    this.completedDrawShape = this.drawLine
  }

  startDrawPoint(drawCompleted, isDeactivate = false) {
    Event.drawStart.dispatch()
    superMap3DToSuperMap.convertGeometry = superMap3DToSuperMap.convertPoint
    this.drawCompleted = drawCompleted
    this.type = DrawType.POINT
    this.styleType = DrawTypeStyle[this.type]
    this.isDeactivate = isDeactivate
    this.viewer.enableCursorStyle = false
    this.viewer._element.style.cursor = ''
    this.completedDrawShape = this.drawPoint
  }

  deactivate() {
    this.viewer.enableCursorStyle = true
    this.isDeactivate = true
    Event.drawEnd.dispatch()
    // this.screenSpaceHandler && this.screenSpaceHandler.destroy()
  }

  clear() {
    this.deactivate()
    this.dataSource.entities.removeAll()
  }
}

const DrawFeature = singleton(DrawFeatureIns)
export default DrawFeature
