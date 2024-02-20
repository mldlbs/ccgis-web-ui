/*global Cesium, SuperMap3D*/ // SuperMap
import ParticleData from './ParticleData'
/**
 * 定义粒子参数
 */

let param = {
  emitterModelMatrix: {},
  translation: {},
  rotation: {},
  hpr: {},
  trs: {},
  gravityScratch: {},
  vm: {}
}

class Particle {
  constructor(config) {
    this.viewer = config.viewer
    if (!window.Cesium) {
      window.Cesium = SuperMap3D
    }
    param = {
      emitterModelMatrix: new Cesium.Matrix4(),
      translation: new Cesium.Cartesian3(),
      rotation: new Cesium.Quaternion(),
      hpr: new Cesium.HeadingPitchRoll(),
      trs: new Cesium.TranslationRotationScale(),
      gravityScratch: new Cesium.Cartesian3(),
      vm: {}
    }
  }

  getParticle(type, point) {
    const vmIn = `vm${type.replace('particle_', '')}`
    param.vm = ParticleData[vmIn]
    if (vmIn === 'vm9' || vmIn === 'vm10') {
      return this.initMutiParticle(param, point)
    }
    return this.initParticle(param, point)
  }

  /**
 * 初始化粒子, 区域粒子如流淌火，分区烟等
 */
  initMutiParticle(param, hierarchy) {
    const vm = param.vm
    const particle = new Cesium.ParticleSystem({
      image: vm.url,
      startColor: vm.startColor,
      endColor: vm.endColor,
      startScale: vm.startScale,
      endScale: vm.endScale,
      minimumParticleLife: vm.minimumParticleLife,
      maximumParticleLife: vm.maximumParticleLife,
      minimumSpeed: vm.minimumSpeed,
      maximumSpeed: vm.maximumSpeed,
      imageSize: new Cesium.Cartesian2(
        vm.particleSize,
        vm.particleSize
      ),
      emissionRate: 2000,
      lifetime: vm.lifetime,
      // minimumRotationSpeed: vm.minimumRotationSpeed,
      // maximumRotationSpeed: vm.maximumRotationSpeed,
      loop: true,
      emitter: new Cesium.PolygonEmitter(hierarchy),
      // emitterModelMatrix: computeEmitterModelMatrix(vm.headingPitchRoll),
      updateCallback: this.applyGravity,
      sizeInMeters: true
    })
    particle.emitter.density = 10
    particle.lodRangeScale = vm.lodRangeScale
    particle.centerPosition = hierarchy
    particle.heading = vm.headingPitchRoll.heading
    particle.pitch = vm.headingPitchRoll.pitch
    particle.roll = vm.headingPitchRoll.roll
    particle.gravity = vm.gravity
    // viewer.scene.preUpdate.addEventListener((scene, time) => {
    //     // particle.modelMatrix = computeModelMatrix(entity, time, point);
    //     particle.emitterModelMatrix = computeEmitterModelMatrix(particle);
    // });
    return particle
  }

  /**
 * 初始化粒子
 */
  initParticle(param, point) {
    const vm = param.vm
    const entity = this.viewer.entities.add(
      new Cesium.Entity({
        billboard: {
          image: vm.url,
          width: 30,
          height: 50
        },
        position: point,
        show: false
      })
    )
    const particle = new Cesium.ParticleSystem({
      image: vm.url,
      startColor: vm.startColor,
      endColor: vm.endColor,
      startScale: vm.startScale,
      endScale: vm.endScale,
      minimumParticleLife: vm.minimumParticleLife,
      maximumParticleLife: vm.maximumParticleLife,
      minimumSpeed: vm.minimumSpeed,
      maximumSpeed: vm.maximumSpeed,
      imageSize: new Cesium.Cartesian2(
        vm.particleSize,
        vm.particleSize
      ),
      emissionRate: vm.emissionRate,
      lifetime: vm.lifetime,
      minimumRotationSpeed: vm.minimumRotationSpeed,
      maximumRotationSpeed: vm.maximumRotationSpeed,
      loop: true,
      emitter: vm.emitter,
      emitterModelMatrix: this.computeEmitterModelMatrix(vm.headingPitchRoll),
      updateCallback: this.applyGravity,
      sizeInMeters: true,
      performance: false
    })
    particle.lodRangeScale = vm.lodRangeScale
    particle.centerPosition = point
    particle.heading = vm.headingPitchRoll.heading
    particle.pitch = vm.headingPitchRoll.pitch
    particle.roll = vm.headingPitchRoll.roll
    particle.gravity = vm.gravity
    this.viewer.scene.preUpdate.addEventListener((scene, time) => {
      particle.modelMatrix = this.computeModelMatrix(entity, time, point)
      particle.emitterModelMatrix = this.computeEmitterModelMatrix(particle)
    })
    return particle
  }

  applyGravity(p, dt) {
    const { vm, gravityScratch } = param
    const position = p.position
    Cesium.Cartesian3.normalize(position, gravityScratch)
    Cesium.Cartesian3.multiplyByScalar(
      gravityScratch,
      vm.gravity * dt,
      gravityScratch
    )
    p.velocity = Cesium.Cartesian3.add(
      p.velocity,
      gravityScratch,
      p.velocity
    )
  }

  computeModelMatrix(entity, time, point) {
    entity.position = point
    return entity.computeModelMatrix(time, new Cesium.Matrix4())
  }
  // 改变粒子系统的位置
  computeEmitterModelMatrix(particle) {
    const { trs, translation, rotation, emitterModelMatrix } = param
    let hpr = param.hpr
    hpr = Cesium.HeadingPitchRoll.fromDegrees(
      particle.heading,
      particle.pitch,
      particle.roll,
      hpr
    )
    trs.translation = Cesium.Cartesian3.fromElements(0, 0, 0, translation)
    trs.rotation = Cesium.Quaternion.fromHeadingPitchRoll(hpr, rotation)
    return Cesium.Matrix4.fromTranslationRotationScale(
      trs,
      emitterModelMatrix
    )
  }
}

export default Particle
