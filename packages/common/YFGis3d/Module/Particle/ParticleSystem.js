/*global Cesium, SuperMap3D*/ // SuperMap

import Particle from './Particle'

/**
 * 粒子系统
 */

class ParticleSystem {
    static $inject = ['config']

    constructor(config) {
      if (!window.Cesium) {
        window.Cesium = SuperMap3D
      }
      //   window.Cesium = Cesium || SuperMap3D
      this.viewer = config.viewer
    }

    /**
 * 添加粒子效果
 */
    add(cfg, callback) {
      const viewer = this.viewer
      const primitiveSystemID = cfg.id || this._ids.next()
      const particleSystem = viewer.scene.primitives.add(
        new Particle(viewer, cfg.type, cfg.point)
      )
      particleSystem.id = primitiveSystemID
      if (callback) callback(particleSystem.id)
    }

    /**
 * 添加粒子效果
 */
    addRegion(cfg, callback) {
      const viewer = this.viewer
      const primitiveSystemID = cfg.id || this._ids.next()
      const particleSystem = viewer.scene.primitives.add(
        new Particle(viewer, cfg.type, cfg.hierarchy)
      )
      particleSystem.id = primitiveSystemID
      if (callback) callback(particleSystem.id)
    }

    get(id) {
      const scene = this.viewer.scene
      const length = scene.primitives.length
      for (var i = 0; i < length; ++i) {
        var p = scene.primitives.get(i)
        if (p.id === id) {
          return p
        }
      }
    }

    getByGuid(guid) {
      const scene = this.viewer.scene
      const length = scene.primitives.length
      for (var i = 0; i < length; ++i) {
        var p = scene.primitives.get(i)
        if (p._billboardCollection && p._billboardCollection._textureAtlasGUID === guid) {
          return p
        }
      }
    }

    update(id, data) {
      const p = this.get(id)
      if (data.vm1) {
        p.minimumImageSize = new Cesium.Cartesian2(
          data.vm1,
          data.vm1
        )
      }
      if (data.vm2) { p.startColor = Cesium.Color.fromCssColorString(data.vm2) }
      if (data.vm3) { p.endColor = Cesium.Color.fromCssColorString(data.vm3) }
      if (data.vm4) { p.emissionRate = data.vm4 }
      if (data.vm5) {
        p.minimumSpeed = data.vm5
        p.maximumSpeed = data.vm5
      }
      if (data.vm6) { p.heading = data.vm6 }
      if (data.vm7) { p.pitch = data.vm7 }
    }

    remove(id) {
      const scene = this.viewer.scene
      const p = this.get(id)
      scene.primitives.remove(p)
    }

    destroy() {
      const scene = this.viewer.scene
      // scene.primitives.removeAll();
      const length = scene.primitives.length
      for (let i = 0; i < length; ++i) {
        const p = scene.primitives.get(i)
        if (p && p.id) scene.primitives.remove(p)
      }
    }
}

export default ParticleSystem
