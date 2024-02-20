/*global Cesium, SuperMap3D*/ // SuperMap

class ParticleData {
  constructor() {
    if (!window.Cesium) {
      window.Cesium = SuperMap3D
    }
    return {
      vm1: { // 水柱
        emissionRate: 150.0,
        gravity: -0.5,
        lodRangeScale: 100,
        startColor: new Cesium.Color(206 / 255, 227 / 255, 250 / 255, 0.6),
        endColor: new Cesium.Color(204 / 255, 219 / 255, 250 / 255, 0.2),
        lifetime: 16.0,
        minimumParticleLife: 1.2,
        maximumParticleLife: 1.8,
        minimumSpeed: 9,
        maximumSpeed: 12,
        minimumRotationSpeed: -0.2,
        maximumRotationSpeed: 0.2,
        emitter: new Cesium.CircleEmitter(0.2, 0.19),
        startScale: 0.5,
        endScale: 4,
        particleSize: 1,
        headingPitchRoll: {
          heading: 0,
          pitch: 30,
          roll: 0
        },
        url: './static/images/particle/water.png'
      },
      vm2: { // 干粉
        emissionRate: 50.0,
        gravity: 0,
        lodRangeScale: 100,
        startColor: new Cesium.Color(1, 1, 1, 0.6),
        endColor: new Cesium.Color(1, 1, 1, 0.0),
        lifetime: 6.0,
        minimumParticleLife: 1.2,
        maximumParticleLife: 1.8,
        minimumSpeed: 12,
        maximumSpeed: 12,
        minimumRotationSpeed: -10,
        maximumRotationSpeed: 10,
        emitter: new Cesium.CircleEmitter(0.2),
        startScale: 0.1,
        endScale: 12,
        particleSize: 1,
        headingPitchRoll: {
          heading: 0,
          pitch: 30,
          roll: 0
        },
        url: './static/images/particle/dryPowder.png'
      },
      vm3: { // 水雾
        emissionRate: 150.0,
        gravity: -0.5,
        lodRangeScale: 100,
        startColor: new Cesium.Color(206 / 255, 227 / 255, 250 / 255, 0.3),
        endColor: new Cesium.Color(206 / 255, 227 / 255, 250 / 255, 0.0),
        lifetime: 6.0,
        minimumParticleLife: 1.2,
        maximumParticleLife: 1.8,
        minimumSpeed: 9,
        maximumSpeed: 12,
        minimumRotationSpeed: -10,
        maximumRotationSpeed: 10,
        emitter: new Cesium.CircleEmitter(0.2, 0.19),
        startScale: 0.1,
        endScale: 12,
        particleSize: 1,
        headingPitchRoll: {
          heading: 0,
          pitch: 30,
          roll: 0
        },
        url: './static/images/particle/waterMist.png'
      },
      vm4: { // 环形火焰
        emissionRate: 2000.0,
        gravity: 0.0,
        lodRangeScale: 100,
        startColor: new Cesium.Color(1, 1, 1, 1),
        endColor: new Cesium.Color(0.0, 0.0, 0, 0.0),
        lifetime: 6.0,
        minimumParticleLife: 0.5,
        maximumParticleLife: 1.7,
        minimumSpeed: 8,
        maximumSpeed: 20,
        minimumRotationSpeed: -10,
        maximumRotationSpeed: 10,
        emitter: new Cesium.CircleEmitter(34, 33.5),
        startScale: 1,
        endScale: 2,
        particleSize: 5,
        headingPitchRoll: {
          heading: 0,
          pitch: 0,
          roll: 0
        },
        url: './static/images/particle/ringFire.png'
      },
      vm5: { // 环形烟
        emissionRate: 150.0,
        gravity: 1,
        lodRangeScale: 100,
        startColor: new Cesium.Color(0.22, 0.2, 0.2, 0.4),
        endColor: new Cesium.Color(0.2, 0.2, 0.2, 0.0),
        lifetime: 6.0,
        minimumParticleLife: 6,
        maximumParticleLife: 9,
        minimumSpeed: 1,
        maximumSpeed: 2,
        minimumRotationSpeed: -10,
        maximumRotationSpeed: 10,
        emitter: new Cesium.CircleEmitter(34, 33.5),
        startScale: 1.5,
        endScale: 8,
        particleSize: 6,
        headingPitchRoll: {
          heading: 0,
          pitch: 0,
          roll: 0
        },
        url: './static/images/particle/ringSmoke.png'
      },
      vm6: { // 建筑火焰
        emissionRate: 200.0,
        gravity: 0.0,
        lodRangeScale: 100,
        startColor: new Cesium.Color(1, 1, 1, 1),
        endColor: new Cesium.Color(0.5, 0, 0, 0),
        lifetime: 6.0,
        minimumParticleLife: 1.5,
        maximumParticleLife: 1.8,
        minimumSpeed: 7.0,
        maximumSpeed: 9.0,
        minimumRotationSpeed: -10,
        maximumRotationSpeed: 10,
        emitter: new Cesium.ConeEmitter(Cesium.Math.toRadians(45.0)),
        startScale: 3.0,
        endScale: 1.5,
        particleSize: 2,
        headingPitchRoll: {
          heading: 0,
          pitch: 0,
          roll: 0
        },
        url: './static/images/particle/fire4.png'
      },
      vm7: { // 爆炸火焰
        emissionRate: 30.0,
        gravity: 0.5,
        lodRangeScale: 100,
        startColor: new Cesium.Color(1, 1, 1, 1),
        endColor: new Cesium.Color(0.2, 0.2, 0.2, 0.0),
        lifetime: 5.0,
        minimumParticleLife: 1.6,
        maximumParticleLife: 2.2,
        minimumSpeed: 3.0,
        maximumSpeed: 4.0,
        minimumRotationSpeed: -10,
        maximumRotationSpeed: 10,
        emitter: new Cesium.ConeEmitter(Cesium.Math.toRadians(65.0)),
        startScale: 3.0,
        endScale: 1.5,
        particleSize: 2,
        headingPitchRoll: {
          heading: 0,
          pitch: 0,
          roll: 0
        },
        url: './static/images/particle/bomFire.png'
      },
      vm8: { // 烟熏火
        emissionRate: 30.0,
        gravity: 1.0,
        lodRangeScale: 100,
        startColor: new Cesium.Color(0.3, 0.3, 0.4, 1),
        endColor: new Cesium.Color(0.3, 0.3, 0.3, 0.0),
        lifetime: 5.0,
        minimumParticleLife: 2,
        maximumParticleLife: 2.5,
        minimumSpeed: 3.0,
        maximumSpeed: 5.0,
        minimumRotationSpeed: -10,
        maximumRotationSpeed: 10,
        emitter: new Cesium.ConeEmitter(Cesium.Math.toRadians(50.0)),
        startScale: 3.0,
        endScale: 2,
        particleSize: 2,
        headingPitchRoll: {
          heading: 0,
          pitch: 0,
          roll: 0
        },
        url: './static/images/particle/smokeFire.png'
      },
      vm9: { // 分区烟
        gravity: 0,
        lodRangeScale: 150,
        startColor: new Cesium.Color(0.1, 0.1, 0.1, 0.1),
        endColor: new Cesium.Color(0, 0, 0, 0.0),
        lifetime: 16,
        minimumParticleLife: 1,
        maximumParticleLife: 9,
        minimumSpeed: 1,
        maximumSpeed: 3,
        startScale: 1.5,
        endScale: 4,
        particleSize: 6,
        headingPitchRoll: {
          heading: 0,
          pitch: 0,
          roll: 0
        },
        url: './static/images/particle/ringSmoke.png'
      },
      vm10: { // 流淌火
        gravity: 0,
        lodRangeScale: 150,
        startColor: new Cesium.Color(1, 1, 1, 0.8),
        endColor: new Cesium.Color(0.0, 0.0, 0, 0.0),
        lifetime: 8,
        minimumParticleLife: 1.5,
        maximumParticleLife: 3,
        minimumSpeed: 6,
        maximumSpeed: 7,
        startScale: 2,
        endScale: 4,
        particleSize: 6,
        headingPitchRoll: {
          heading: 0,
          pitch: 0,
          roll: 0
        },
        url: './static/images/particle/flowFire.png'
      }
    }
  }
}

export default ParticleData

