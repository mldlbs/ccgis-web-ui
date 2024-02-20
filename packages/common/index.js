import { createInjector } from './injector'

// import DrawFeature from './YFGis3d/DrawFeature'
// import OrbitFeature from './YFGis3d/OrbitFeature'
// import EntityFeature from './YFGis3d/EntityFeature'
// import HeatmapFeature from './YFGis3d/HeatmapFeature'
// import PopupFeature from './YFGis3d/PopupFeature'
// import ContourLine from './YFGis3d/ContourLine'
// import Gradient from './YFGis3d/Gradient'
// import VideoShed from './YFGis3d/VideoShed'
// import QueryFeatures from './YFGis3d/QueryFeatures'
// import DynamicBuffer from './YFGis3d/DynamicBuffer'
// import BufferAnalyst from './YFGis3d/BufferAnalyst'
// import PlanAction from './YFGis3d/PlanAction'

class CCGis {
  constructor(options, injector) {
    // console.log('\n\n %c web3d %c version \n',
    //   'color:#fff;border-radius:5px;background:#41b883;padding:5px 0;',
    //   'color:#fff;border-radius:5px;background:#35495e;padding:5px 0;margin:0 2px')
    this.injector = injector = injector || createInjector(options)
    // API
    this.get = injector.get
    this.invoke = injector.invoke
    // init
    // indicate via event
    // this.get('eventBus').fire('CCGIS.init')
  }

  destroy() {
    // this.get('eventBus').fire('ccgis.destroy')
  }

    clear = function() {
      // this.get('eventBus').fire('ccgis.clear')
    }
}

export { CCGis }
