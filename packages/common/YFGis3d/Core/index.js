
import Event from '../Utils/event'
import UUID from '../Utils/uuid'
import Layer from '../Common/LayerHelper'
import Scene from '../Common/SceneHelper'

// import { StaticParam } from './YFGis3d/Utils/config'
export default {
  __depends__: ['event', 'uuid'],
  __init__: ['layer', 'scene', 'particle', 'move'],
  event: ['type', Event],
  uuid: ['type', UUID],
  layer: ['type', Layer],
  scene: ['type', Scene]
}
