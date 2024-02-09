/*global SuperMap3D, SuperMap*/ // SuperMap
import { superMap3DToSuperMap } from '../Utils/convert'
import debounce from '../Utils/debounce'
import Event from '../Utils/event'

class EventHelper {
  constructor(viewer) {
    this.viewer = viewer
    this.viewer.scene.globe.depthTestAgainstTerrain = false
    this.screenSpaceHandler = new SuperMap3D.ScreenSpaceEventHandler(viewer.canvas)
    this.drawing = false
    this.addSelectedListener()
  }

  _selectedlistener(evt) {
    const viewer = this.viewer
    const self = this
    if (self.drawing) return
    const obj = viewer.scene.pick(evt.position)
    const entity = obj && obj.id

    function getGeometry() {
      const earthPosition = viewer.scene.pickPosition(evt.position)
      if (!earthPosition) return {}
      const cartograhphic = SuperMap3D.Cartographic.fromCartesian(earthPosition)
      const point = {
        longitude: SuperMap3D.Math.toDegrees(cartograhphic.longitude),
        latitude: SuperMap3D.Math.toDegrees(cartograhphic.latitude),
        height: cartograhphic.height
      }
      const cartographicArr = [point]
      const geometry = superMap3DToSuperMap.convertPoint(SuperMap3D, SuperMap, earthPosition)
      return { cartographicArr, geometry }
    }

    if (!entity && evt.position) {
      const { geometry, cartographicArr } = getGeometry()
      if (!cartographicArr) return
      Event.picked.dispatch({ geometry, cartographicArr })
    }

    if (entity && entity._billboard) {
      Event.selected.dispatch({
        ...entity.userData,
        cartesian3: entity.position._value,
        entitid: entity.id
      })
    }

    if (entity && !isNaN(parseFloat(entity)) && isFinite(entity)) {
      if (obj.primitive && obj.primitive.layerInfo) {
        const { geometry, cartographicArr } = getGeometry()
        if (!cartographicArr) return
        Event.selected.dispatch({ geometry, cartographicArr, smid: entity, layerInfo: obj.primitive.layerInfo, dataType: 's3mlayer' })
      }
    }
  }

  addSelectedListener() {
    const self = this
    const startHandler = () => {
      self.drawing = true
    }
    const endHandler = () => {
      self.drawing = false
    }
    Event.drawStart.remove(startHandler)
    Event.drawEnd.remove(endHandler)

    Event.drawStart.add(startHandler)
    Event.drawEnd.add(endHandler)
    // 点击事件
    this.screenSpaceHandler.setInputAction(this._selectedlistener.bind(this), SuperMap3D.ScreenSpaceEventType.LEFT_CLICK)
  }

  addEnterListener() {
    const viewer = this.viewer
    const self = this

    const enterFunc = debounce((entity) => {
      Event.enter.dispatch({
        ...entity.userData,
        cartesian3: entity.position._value,
        entitid: entity.id
      })
    }, 300)
    const leaveFunc = debounce(() => {
      Event.leave.dispatch({})
    }, 100)

    // 移动事件
    const _listener = function(evt) {
      if (self.drawing) return
      const obj = viewer.scene.pick(evt.endPosition)
      const entity = obj && obj.id
      if (entity && entity._billboard) {
        if (viewer.enableCursorStyle) {
          viewer.enableCursorStyle = false
          viewer._element.style.cursor = 'pointer'
        }
        enterFunc(entity)
      } else {
        if (!viewer.enableCursorStyle) {
          viewer._element.style.cursor = ''
          viewer.enableCursorStyle = true
        }
        leaveFunc()
      }
    }
    this.screenSpaceHandler.setInputAction(_listener, SuperMap3D.ScreenSpaceEventType.MOUSE_MOVE)
  }
  clear() {
    // Event.enter.removeAll()
    // Event.leave.removeAll()
  }
}

export default EventHelper
