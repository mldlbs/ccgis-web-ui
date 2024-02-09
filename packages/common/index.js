
import DrawFeature from './YFGis3d/DrawFeature'
import OrbitFeature from './YFGis3d/OrbitFeature'
import EntityFeature from './YFGis3d/EntityFeature'
import HeatmapFeature from './YFGis3d/HeatmapFeature'
import PopupFeature from './YFGis3d/PopupFeature'
import ContourLine from './YFGis3d/ContourLine'
import Gradient from './YFGis3d/Gradient'
import VideoShed from './YFGis3d/VideoShed'
import QueryFeatures from './YFGis3d/QueryFeatures'
import DynamicBuffer from './YFGis3d/DynamicBuffer'
import BufferAnalyst from './YFGis3d/BufferAnalyst'

import Event from './YFGis3d/Utils/event'
import UUID from './YFGis3d/Utils/uuid'
import Layer from './YFGis3d/Common/LayerHelper'
import Scene from './YFGis3d/Common/SceneHelper'
import { StaticParam } from './YFGis3d/Utils/config'

const YFGis = {
  DrawFeature,
  EntityFeature,
  PopupFeature,
  HeatmapFeature,
  OrbitFeature,
  ContourLine,
  Gradient,
  VideoShed,
  QueryFeatures,
  DynamicBuffer,
  BufferAnalyst,
  UUID, Event, Scene, Layer
}

StaticParam(YFGis)

// module.exports = YFGis

export { YFGis }

