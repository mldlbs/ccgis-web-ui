/*global Cesium, SuperMap3D*/ // SuperMap
// 预案执行动作
const particles = []
class PlanAction {
  static $inject = ['config', 'particle', 'move', 'alertmarker']
  constructor(config, particle, move, alertmarker) {
    if (!window.Cesium) {
      window.Cesium = SuperMap3D
    }
    this.viewer = config.viewer
    this.particle = particle
    this.move = move
    this.alertmarker = alertmarker
  }
  // 灾情
  addXFEventPoint(action) {
    const particle = this.particle
    const features = action.features
    let position
    features.forEach(item => {
      position = item.coordinates[0]
      if (particle.get(item.props.id)) { return }
      const centerPosition1 = Cesium.Cartesian3.fromDegrees(position.longitude, position.latitude, position.height + 0.1)
      particle.add({
        id: item.props.id,
        type: item.props.p_type || 'particle_6',
        point: centerPosition1
      }, id => {
        particles.push(id)
        particle.update(id, item.props)
      })
    })
    if (position) { this.flyToPoint(position, 60) }
  }

  // 疏散路线
  addXFEvacuateRoute(action) {
    const cc3dcesium = this.cc3dcesium
    const move = this.move
    const features = action.features
    features.forEach((item) => {
      const _positions = item.coordinates[0]
      const positions = []
      _positions.forEach(item => {
        positions.push(item.longitude)
        positions.push(item.latitude)
        positions.push(item.height + 0.3 || 0)
      })
      const hierarchy = Cesium.Cartesian3.fromDegreesArrayHeights(positions)
      const lineEntity = cc3dcesium.viewer.entities.add({
        name: '疏散路线',
        polyline: {
          positions: new Cesium.CallbackProperty(() => {
            return hierarchy
          }, false),
          width: 20,
          // clampToGround: true, // 贴地
          material: new Cesium.ImageMaterialProperty({
            image: item.props.uri,
            transparent: true,
            repeat: new Cesium.Cartesian2(50 * 1, 1 * 1)
          }),
          depthFailMaterial: new Cesium.PolylineDashMaterialProperty({
            color: Cesium.Color.YELLOW
          }),
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 4000)
        }
      })
      const position = Cesium.Cartesian3.fromDegrees(108, 34, 24)
      const entity = cc3dcesium.viewer.entities.add({
        position: position,
        model: {
          uri: './static/models/shibing.gltf',
          maximumScale: '1'
        }
      })
      cc3dcesium.viewer.flyTo(lineEntity).then(() => {
        if (entity) {
          setTimeout(() => {
            move.create(hierarchy, entity, 20, 50)
          }, 1000)
        }
      })
    })
  }

  // 消防接警
  addXFReceiveAlarm(action) {
    const alertmarker = this.alertmarker
    const features = action.features
    features.forEach(item => {
      const position = item.coordinates[0][0]
      const entity = alertmarker.create({
        position: Cesium.Cartesian3.fromDegrees(position.longitude, position.latitude, position.height + 1),
        iconUrl: 'static/images/entity/pos_red.png',
        color: Cesium.Color.RED
      })
      this.flyToEntity(entity, 90)
    })
  }

  // 撤退区域
  addXFRetreatArea(action) {
    const cc3dcesium = this.cc3dcesium
    const features = action.features
    features.forEach((item) => {
      if (this.getEntity(item.props.id)) { return }
      const _positions = item.coordinates[0]
      const positions = []
      _positions.forEach(item => {
        positions.push(item.longitude)
        positions.push(item.latitude)
        positions.push(item.height || 0)
      })
      const hierarchy = Cesium.Cartesian3.fromDegreesArrayHeights(positions)
      let polyCenter = Cesium.BoundingSphere.fromPoints(hierarchy).center
      polyCenter = Cesium.Ellipsoid.WGS84.scaleToGeodeticSurface(polyCenter)
      const lineEntity = cc3dcesium.viewer.entities.add({
        id: item.props.id,
        polygon: {
          hierarchy: hierarchy,
          material: Cesium.Color.RED.withAlpha(0.3),
          clampToGround: true// 贴地
        },
        clampToS3M: true
      })
      const polyPositions = lineEntity.polygon.hierarchy.getValue(Cesium.JulianDate.now()).positions
      polyCenter = Cesium.BoundingSphere.fromPoints(polyPositions).center
      polyCenter = Cesium.Ellipsoid.WGS84.scaleToGeodeticSurface(polyCenter)
      const cartographic = Cesium.Cartographic.fromCartesian(polyCenter)
      const longitude = Cesium.Math.toDegrees(cartographic.longitude)
      const latitude = Cesium.Math.toDegrees(cartographic.latitude)
      lineEntity.position = Cesium.Cartesian3.fromDegrees(longitude, latitude, _positions[0].height + 1)
      lineEntity.label = {
        text: '安全区域',
        color: Cesium.Color.fromCssColorString('#fff'),
        font: 'normal 32px MicroSoft YaHei',
        showBackground: true,
        scale: 0.5,
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(10.0, 100000.0),
        disableDepthTestDistance: 10000.0
      }
      this.flyToPoint({ longitude: longitude, latitude: latitude, height: _positions[0].height + 1 }, 210)
    })
  }

  // 行动路线
  addXFCarMove(action) {
    const cc3dcesium = this.cc3dcesium
    const move = this.move
    const features = action.features
    features.forEach((item) => {
      if (this.getEntity(item.props.id)) { return }
      const _positions = item.coordinates[0]
      const positions = []
      _positions.forEach(item => {
        positions.push(item.longitude)
        positions.push(item.latitude)
        positions.push(item.height || 0)
      })
      const hierarchy = Cesium.Cartesian3.fromDegreesArrayHeights(positions)
      const lineEntity = cc3dcesium.viewer.entities.add({
        id: item.props.id,
        polyline: {
          positions: new Cesium.CallbackProperty(() => {
            return hierarchy
          }, false),
          width: 3,
          clampToGround: true, // 贴地
          material: new Cesium.PolylineDashMaterialProperty({
            color: Cesium.Color.fromCssColorString('#feff27')
          }),
          depthFailMaterial: new Cesium.PolylineDashMaterialProperty({
            color: Cesium.Color.YELLOW
          })
        }
      })
      const position = Cesium.Cartesian3.fromDegrees(108, 34, 0)
      const entities = []
      for (let i = 0; i < 3; i++) {
        const entity = cc3dcesium.viewer.entities.add({
          position: position,
          model: {
            uri: './static/models/xfc.gltf',
            maximumScale: '1'
          },
          label: {
            text: '消防车',
            font: '12px sans-serif',
            showBackground: true,
            fillColor: Cesium.Color.WHITE,
            backgroundColor: Cesium.Color.CORAL,
            backgroundPadding: new Cesium.Cartesian2(8, 4),
            style: Cesium.LabelStyle.FILL,
            pixelOffset: new Cesium.Cartesian2(0.0, -40),
            translucencyByDistance: new Cesium.NearFarScalar(500, 1.0, 3000, 0.1),
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 800)
          }
        })
        entities.push(entity)
      }
      move.clear()
      cc3dcesium.viewer.flyTo(lineEntity).then(() => {
        setTimeout(() => {
          move.createMutiFeature(hierarchy, entities, 50, 420)
          // move.create(hierarchy, entities[0], 50, 420)
        }, 1000)
      })
    })
  }

  // 室外力量部署
  addXFOutDeploy(action) {
    const cc3dcesium = this.cc3dcesium
    const features = action.features
    const entities = []
    features.forEach((item) => {
      if (this.getEntity(item.props.id)) { return }
      position = item.coordinates[0]
      const headingPitchRoll = new Cesium.HeadingPitchRoll(
        Cesium.Math.toRadians(item.props.vm11 || 0),
        Cesium.Math.toRadians(0),
        Cesium.Math.toRadians(0)
      )
      let position = Cesium.Cartesian3.fromDegrees(position.longitude, position.latitude, position.height + 1)
      const orientation = Cesium.Transforms.headingPitchRollQuaternion(position, headingPitchRoll)
      const entity = cc3dcesium.viewer.entities.add({
        id: item.props.id,
        position: position,
        orientation: orientation,
        model: {
          uri: item.props.uri,
          colorBlendMode: Cesium.ColorBlendMode.HIGHLIGHT,
          color: Cesium.Color.WHITE, // .withAlpha(0.5),
          scale: 1,
          maximumScale: 1
        }
      })
      entities.push(entity)
    })
    this.flyToEntity(entities, 120)
  }

  // 消防员部署
  addXFFMDeploy(action) {
    const cc3dcesium = this.cc3dcesium
    const features = action.features
    const entities = []
    features.forEach((item) => {
      if (this.getEntity(item.props.id)) { return }
      position = item.coordinates[0]
      const headingPitchRoll = new Cesium.HeadingPitchRoll(
        Cesium.Math.toRadians(item.props.vm11 || 0),
        Cesium.Math.toRadians(0),
        Cesium.Math.toRadians(0)
      )
      let position = Cesium.Cartesian3.fromDegrees(position.longitude, position.latitude, position.height + 0.1)
      const orientation = Cesium.Transforms.headingPitchRollQuaternion(position, headingPitchRoll)
      const entity = cc3dcesium.viewer.entities.add({
        id: item.props.id,
        position: position,
        orientation: orientation,
        model: {
          uri: item.props.uri,
          colorBlendMode: Cesium.ColorBlendMode.HIGHLIGHT,
          color: Cesium.Color.WHITE, // .withAlpha(0.5),
          scale: 1,
          maximumScale: 1
        }
      })
      entities.push(entity)
    })
    this.flyToEntity(entities, 90)
  }

  // 连接水带
  addXFFireCock(action) {
    const cc3dcesium = this.cc3dcesium
    const features = action.features
    let _position
    features.forEach((item) => {
      if (this.getEntity(item.props.id)) { return }
      let dis = 0
      const _positions = item.coordinates[0]
      const positions = []
      _positions.forEach(item => {
        positions.push(item.longitude)
        positions.push(item.latitude)
        positions.push(item.height || 0)
        if (_position) {
          const p1 = Cesium.Cartesian3.fromDegrees(_position.longitude, _position.latitude, _position.height)
          const p2 = Cesium.Cartesian3.fromDegrees(item.longitude, item.latitude, item.height)
          dis += Cesium.Cartesian3.distance(p1, p2)
        }
        _position = item
      })
      const hierarchy = Cesium.Cartesian3.fromDegreesArrayHeights(positions)
      // 绘制三维管线
      cc3dcesium.viewer.entities.add({
        id: item.props.id,
        name: '消防水带',
        width: 0.1,
        polylineVolume: {
          positions: hierarchy,
          shape: computeCircle(0.08),
          material: new Cesium.ImageMaterialProperty({
            image: item.props.uri,
            repeat: new Cesium.Cartesian2(5 * dis, 4.0)
          })
        }
      })
    })
    // this.flyToEntity(entity, 30)
  }

  // 室内力量部署
  addXFInDeploy(action) {
    const alertmarker = this.alertmarker
    const pts = action.feature.coordinates
    const entities = []
    pts.forEach((item) => {
      const entity = alertmarker.create({
        position: Cesium.Cartesian3.fromDegrees(item.longitude, item.latitude, item.height),
        iconUrl: 'static/image/entity/pos_red.png',
        color: Cesium.Color.RED
      })
      entities.push(entity)
    })
    this.flyToEntity(entities, 90)
  }

  // 喷水
  addXFSprayWater(action) {
    const particle = this.particle
    const features = action.features
    let position
    features.forEach(item => {
      position = item.coordinates[0]
      if (particle.get(item.props.id)) { return }
      const centerPosition1 = Cesium.Cartesian3.fromDegrees(position.longitude, position.latitude, position.height + 0.1)
      particle.add({
        id: item.props.id,
        type: item.props.p_type || 'particle_6',
        point: centerPosition1
      }, id => {
        particles.push(id)
        particle.update(id, item.props)
      })
    })
    if (position) { this.flyToPoint(position, 60) }
  }

  // 设置分层
  setXFFenCeng(action, layer) {
    const cc3dcesium = this.cc3dcesium
    cc3dcesium.viewer.scene.layers.find(layer).setObjsVisible(action.features[0].props.ids, true)
  }

  // 定位到实体
  flyToEntity(entity, range) {
    const cc3dcesium = this.cc3dcesium
    if (entity) {
      cc3dcesium.viewer.flyTo(entity, {
        offset: {
          heading: Cesium.Math.toRadians(25), // 左右方向
          pitch: Cesium.Math.toRadians(-25), // 上下方向
          range: range || 30 // 镜头（屏幕）到定位目标点（实体）的距离
        }
      })
    }
  }

  // 定位到点
  flyToPoint(position, range) {
    const cc3dcesium = this.cc3dcesium
    const bs = new Cesium.BoundingSphere(Cesium.Cartesian3.fromDegrees(position.longitude, position.latitude, position.height + 1))
    cc3dcesium.viewer.scene.camera.flyToBoundingSphere(bs, {
      offset: {
        heading: Cesium.Math.toRadians(10), // 左右方向
        pitch: Cesium.Math.toRadians(-25), // 上下方向
        range: range || 30 // 镜头（屏幕）到定位目标点（实体）的距离
      }
    })
  }

  // 根据id 获取选中entity
  getEntity(id) {
    const cc3dcesium = this.cc3dcesium
    let entity
    const entities = cc3dcesium.viewer.entities._entities._array
    for (let i = 0; i < entities.length; i++) {
      if (entities[i]._id === id) {
        entity = entities[i]
        break
      }
    }
    return entity
  }

  // 灭火成功
  outfire() {
    // 先取得火粒子
    const particles = getParticle.call(this, 'particle-f')
    const wParticles = getParticle.call(this, 'particle-w')
    const f_args = [1.5 / 100, 1.8 / 100, 3.0 / 100, 1.5 / 100]
    const w_args = [1.2 / 100, 1.8 / 100, 0.5 / 100, 4 / 100]
    miniParticle({ particles: particles, f_args: f_args })
      .then(toPromiseWait(addFumeParticle, 5 * 1000, { particle: this.particle, particles: particles }))
      .then(toPromiseWait(miniParticle, 3 * 1000, { particles: wParticles, f_args: w_args }))
      .then(toPromiseWait(removeLine, 3 * 1000, { viewer: this.cc3dcesium.viewer }))
  }
}

function removeLine(res) {
  const viewer = res.viewer
  const entities = viewer.entities._entities._array
  for (let i = 0; i < entities.length; i++) {
    console.log(entities[i]._id)
    if (entities[i]._id.indexOf('line') > -1) {
      viewer.entities.remove(entities[i])
    }
  }
}

// 添加烟
function addFumeParticle(res) {
  const f_args = [2 / 100, 2.5 / 100, 3.0 / 100, 2 / 100]
  const particle = res.particle
  const yParticle = []
  res.particles.forEach(item => {
    particle.add({
      type: 'particle_8',
      point: item.centerPosition
    }, id => {
      particles.push(id)
      const p = particle.get(id)
      yParticle.push(p)
      p._minimumParticleLife = f_args[0] * 10
      p._maximumParticleLife = f_args[1] * 10
      p._startScale = f_args[2] * 10
      p._endScale = f_args[3] * 10
    })
  })
  let i = 0
  const int = self.setInterval(() => {
    yParticle.forEach(item => {
      if (i++ > 50) {
        item._minimumParticleLife -= f_args[0]
        item._maximumParticleLife -= f_args[1]
        item._startScale -= f_args[2]
        item._endScale -= f_args[3]
      } else {
        item._minimumParticleLife += f_args[0]
        item._maximumParticleLife += f_args[1]
        item._startScale += f_args[2]
        item._endScale += f_args[3]
      }
      if (item._minimumParticleLife < 0) {
        clearInterval(int)
        res.particles.forEach(item => {
          particle.viewer.scene.primitives.remove(item)
        })
        yParticle.forEach(item => {
          particle.viewer.scene.primitives.remove(item)
        })
      }
    })
  }, 100)
}

// 粒子变小
function miniParticle(res) {
  const int = self.setInterval(() => {
    res.particles.forEach(item => {
      item._minimumParticleLife -= res.f_args[0]
      item._maximumParticleLife -= res.f_args[1]
      item._startScale -= res.f_args[2]
      item._endScale -= res.f_args[3]
      if (item._minimumParticleLife < 0) {
        clearInterval(int)
      }
    })
  }, 100)
  return new Promise((r, j) => {
    r()
  })
}

// 获取粒子
function getParticle(type) {
  const particles = []
  const scene = this.cc3dcesium.viewer.scene
  const length = scene.primitives.length
  for (let i = 0; i < length; ++i) {
    const p = scene.primitives.get(i)
    if (p.id && typeof p.id === 'string' && p.id.indexOf(type) > -1) {
      particles.push(p)
    }
  }
  return particles
}

// 修改为promise
function toPromiseWait(cb, timer, data) {
  return () =>
    new Promise((r, j) => {
      const clr = setTimeout(() => {
        cb(data)
        r()
        clearTimeout(clr)
      }, timer)
    })
}

// 计算 shape
function computeCircle(radius) {
  const positions = []
  for (let i = 0; i < 360; i++) {
    const radians = Cesium.Math.toRadians(i)
    positions.push(
      new Cesium.Cartesian2(
        radius * Math.cos(radians),
        radius * Math.sin(radians)
      )
    )
  }
  return positions
}

export default PlanAction

