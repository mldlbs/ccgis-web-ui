/*global SuperMap3D, turf*/ // SuperMap
/*eslint new-cap: */
/**
 * 实体类
 */
import DataSource from './Common/DataSource'

// import Event from './Utils/event'
import { Material } from './Utils/material'
import { singleton } from './Utils/singleton'

class EntityFeatureIns {
  constructor(viewer) {
    this.viewer = viewer
    // 创建数据源
    const DataSourceFa = new DataSource(viewer)
    this.dataSource = DataSourceFa.create('entity-layer')
    this.dataClusterSource = DataSourceFa.create('cluster-entity-layer')
    this.dataClusterSource.clustering.enabled = true
    this.dataClusterSource.clustering.pixelRange = 15
    this.dataClusterSource.clustering.minimumClusterSize = 2

    if (this.viewer.selectionIndicator && !this.viewer.selectionIndicator.isDestroyed()) this.viewer.selectionIndicator.destroy()
    if (!SuperMap3D.PolylineTrailLinkMaterialProperty) new Material()
    viewer.Widget.screenSpaceEventHandler.removeInputAction(SuperMap3D.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)

    this.addClusterEventListener()
  }

  /**
   * data: [
        {
            position: {
                longitude: 108,
                latitude: 34,
                height: 100
            },
            data: {},
            style: {
                url: '',
                width: 30,
                height: 40
            }
        }
    ]
   * @param {*} data
   */
  createFeatures(data, fly = true) {
    this.viewer.dataSources.remove(this.dataSource)
    this.viewer.dataSources.add(this.dataSource)
    this.viewer.dataSources.remove(this.dataClusterSource)
    this.viewer.dataSources.add(this.dataClusterSource)
    data.forEach((_data) => {
      this._createFeature(_data)
    })
    if (fly && data.length > 0) {
      this.flyToPoints(data)
    }
  }

  addClusterEventListener() {
    const that = this
    // 添加监听函数
    this.dataClusterSource.clustering.clusterEvent.addEventListener((entities, cluster) => {
      cluster.label.show = false
      cluster.billboard.show = true
      cluster.billboard.verticalOrigin = SuperMap3D.VerticalOrigin.CENTER
      cluster.billboard.disableDepthTestDistance = 5000000 // 返回正无穷大 去掉地形遮挡
      const clusterConfig = {
        thresholds: [
          { imagePath: '/static/images/marker/cluster_4.png', width: 72, height: 72, threshold: 0.6 },
          { imagePath: '/static/images/marker/cluster_3.png', width: 64, height: 64, threshold: 0.3 },
          { imagePath: '/static/images/marker/cluster_2.png', width: 56, height: 56, threshold: 0.1 },
          { imagePath: '/static/images/marker/cluster_1.png', width: 48, height: 48, threshold: 0 }
        ],
        lsize: 32
      }

      function setClusterProperties(imagePath, width, height) {
        const offX = (width - (entities.length + '').length * 8) / 2
        const canvas = that._combineIconAndLabel(imagePath, entities.length, width, height, offX, offX, 16)
        cluster.billboard.image = canvas
        cluster.billboard.width = width
        cluster.billboard.height = height
      }

      const entitiesLength = entities.length
      const ffListLength = 55
      //   const cluster = { billboard: {} }; // Assuming cluster object exists

      for (const config of clusterConfig.thresholds) {
        if (entitiesLength >= ffListLength * config.threshold || (entitiesLength > 1 && config.threshold === 0)) {
          setClusterProperties(config.imagePath, config.width, config.height)
          break
        }
      }
    })
  }

  updateFeatures(data1, data2) {
    for (let index = 0; index < data1.length; index++) {
      const _data = data1[index]
      const _it = data2.find((it) => _data.id === it.id)
      if (!_it) {
        this._removeFeature(_data)
      }
    }
    this.viewer.dataSources.remove(this.dataSource)
    this.viewer.dataSources.add(this.dataSource)

    for (let index = 0; index < data2.length; index++) {
      const _data = data2[index]
      this._createFeature(_data)
    }
  }

  removeFeatures(data) {
    data.forEach((_data) => {
      this._removeFeature(_data)
    })
    this.viewer.dataSources.remove(this.dataSource)
    this.viewer.dataSources.add(this.dataSource)
    this.viewer.dataSources.remove(this.dataClusterSource)
    this.viewer.dataSources.add(this.dataClusterSource)
  }

  _removeFeature(_data) {
    const entity = this.findFeature(_data.id)
    if (entity) this.dataSource.entities.remove(entity)

    const cluster = this.findClusterFeature(_data.id)
    if (cluster) this.dataClusterSource.entities.remove(entity)
  }

  _createFeature(_data) {
    let entity
    if (this.findFeature(_data.id)) return
    switch (_data.type) {
      case '1': {
        entity = this._addFeature(_data)
        if (entity) this.dataSource.entities.add(entity)
        break
      }
      case '2': {
        entity = this._addFeatureWithCanvas(_data)
        if (entity) this.dataSource.entities.add(entity)
        break
      }
      case '3': {
        entity = this._addFeatureWithCanvas(_data)
        if (entity) this.dataClusterSource.entities.add(entity)
        return
      }
      default: {
        entity = this._addFeature(_data)
        if (entity) this.dataSource.entities.add(entity)
        break
      }
    }

    // if (_data.style.clamp === 1) {
    //   const cartographic = SuperMap3D.Cartographic.fromCartesian(entity.position._value)
    //   const _lon = SuperMap3D.Math.toDegrees(cartographic.longitude)
    //   const _lat = SuperMap3D.Math.toDegrees(cartographic.latitude)
    //   const _height = cartographic.height + 100
    //   entity.position = SuperMap3D.Cartesian3.fromDegrees(_lon, _lat, _height)
    // }

    return entity
  }

  _addFeatureWithCanvas(_data) {
    const s = _data.style || { url: './images/location4.png', width: 30, height: 40 }
    return this._addFeature(_data, this._combineIconAndLabel(s.url, _data.label, s.width, s.height, s.lx, s.ly, s.lsize))
  }

  _addFeature(_data, canvas) {
    const _entity = this.findFeature(_data.id)
    if (_entity) return
    const p = _data.position
    const s = _data.style || { url: './images/location4.png', width: 30, height: 40 }

    const lon = parseFloat(p.longitude)
    const lat = parseFloat(p.latitude)
    const height = parseFloat(p.height)

    try {
      //   if (s.clamp) {
      //     height = this.viewer.scene.getHeight(lon, lat)
      //   }
      const opt = {
        id: _data.id,
        position: SuperMap3D.Cartesian3.fromDegrees(lon, lat, height),
        billboard: {
          image: canvas || s.url,
          width: s.width || 30,
          height: s.height || 40,
          pixelOffset: new SuperMap3D.Cartesian2(s.px || 0, s.py || 0),
          heightReference: s.clamp || 0,
          scaleByDistance: new SuperMap3D.NearFarScalar(5.5e4, 1.0, 8.5e5, 0),
          disableDepthTestDistance: 50000
        },

        userData: _data.data
      }
      const entity = new SuperMap3D.Entity(opt)
      if (entity && _data.label && typeof _data.label !== 'string') {
        const labelOpt = {
          text: _data.label.text,
          font: `${s.lsize}px Alibaba PuHuiTi`,
          pixelOffset: new SuperMap3D.Cartesian2(s.lx || 0, s.ly || 0),
          showBackground: _data.label.showBackground,
          fillColor: SuperMap3D.Color.fromCssColorString(_data.label.fillColor || '#FFFFFF'),
          style: _data.label.style || 0,
          outlineColor: SuperMap3D.Color.fromCssColorString(_data.label.outlineColor || '#FFFFFF'),
          outlineWidth: 1.5,
          backgroundColor: SuperMap3D.Color.fromCssColorString(_data.label.backgroundColor || '#CCCCCC'),
          backgroundPadding: new SuperMap3D.Cartesian2(7, 5),
          horizontalOrigin: _data.label.horizontalOrigin || 0,
          scaleByDistance: new SuperMap3D.NearFarScalar(5.5e4, 1.0, 8.5e5, 0),
          disableDepthTestDistance: 50000
        }
        entity.label = labelOpt
      }
      return entity
    } catch (error) {
      console.log(error)
    }
  }

  _combineIconAndLabel(url, label, dw, dh, lw, lh, ls = 16) {
    // 创建画布对象
    const canvas = document.createElement('canvas')
    canvas.width = dw
    canvas.height = dh
    const ctx = canvas.getContext('2d')

    const promise = new SuperMap3D.Resource.fetchImage(url).then((image) => {
      // 异常判断
      try {
        ctx.drawImage(image, 0, 0, dw, dh)
      } catch (error) {
        console.log(error)
      }
      // 渲染字体
      // font属性设置顺序：font-style, font-variant, font-weight, font-size, line-height, font-family
      ctx.fillStyle = SuperMap3D.Color.WHITE.toCssColorString()
      ctx.font = `normal normal 400 ${ls}px Microsoft YaHei`
      ctx.textAlign = 'left'
      ctx.textBaseline = 'top'
      ctx.fillText(label, lw, lh)
      return canvas
    })
    return promise
  }

  //   polyline: {
  //     positions: arr,
  //     width: 4,
  //     material: new Cesium.PolylineGlowMaterialProperty({ //设置Glow材质
  //         glowPower: 0.1,
  //         color: Cesium.Color.fromCssColorString(item.pullLine.lineColor || "#FFA500")
  //     })
  // }

  createLines(data) {
    this.viewer.dataSources.remove(this.dataSource)
    this.viewer.dataSources.add(this.dataSource)
    data.forEach((_data) => {
      this._createLines(_data)
    })
  }

  _createLines(data) {
    let entity
    if (this.findFeature(data.id)) return
    switch (data.type) {
      case '1': {
        if (this.findFeature(data.id)) return
        const pArr = []
        data.positions.forEach((p) => {
          pArr.push(parseFloat(p.longitude), parseFloat(p.latitude), parseFloat(p.height) || 200)
        })

        const pos = SuperMap3D.Cartesian3.fromDegreesArrayHeights(pArr)
        const opt = {
          id: data.id,
          polyline: {
            material: SuperMap3D.Color.fromCssColorString(data.style.color || '#66cccc'),
            width: data.style.width || 5,
            positions: pos,
            clampToGround: data.style.clamp, // 是否贴地
            disableDepthTestDistance: 50000
          },
          stay: true,
          userData: data.data
        }
        entity = new SuperMap3D.Entity(opt)
        break
      }
      case '2': {
        const pArr = []
        data.positions.forEach((p) => {
          pArr.push(parseFloat(p.longitude), parseFloat(p.latitude), parseFloat(p.height) || 200)
        })
        const material = new SuperMap3D.PolylineDashMaterialProperty({
          color: SuperMap3D.Color.fromCssColorString(data.style.color || '#66cccc')
        })
        const pos = SuperMap3D.Cartesian3.fromDegreesArrayHeights(pArr)
        const opt = {
          id: data.id,
          polyline: {
            positions: pos,
            width: data.style.width || 20,
            material: material,
            clampToGround: data.style.clamp // 是否贴地
          },
          stay: false,
          userData: data.data
        }
        entity = new SuperMap3D.Entity(opt)
        break
      }
      default: {
        if (this.findFeature(data.id)) return
        const ps = data.positions
        const pArr = []
        ps.forEach((p) => {
          pArr.push(parseFloat(p.longitude), parseFloat(p.latitude), parseFloat(p.height) || 200)
        })
        const material = new SuperMap3D.PolylineGlowMaterialProperty({
          // 设置Glow材质
          glowPower: data.style.glowPower || 0.1,
          color: SuperMap3D.Color.fromCssColorString(data.style.color || '#66cccc')
        })

        const pos = SuperMap3D.Cartesian3.fromDegreesArrayHeights(pArr)
        const opt = {
          id: data.id,
          polyline: {
            positions: pos,
            width: data.style.width || 20,
            material: material,
            clampToGround: data.style.clamp // 是否贴地
          },
          stay: true,
          userData: data.data
        }
        entity = new SuperMap3D.Entity(opt)
        break
      }
    }
    if (entity) this.dataSource.entities.add(entity)
  }

  createWalls(data, type = 1) {
    this.viewer.dataSources.remove(this.dataSource)
    this.viewer.dataSources.add(this.dataSource)
    switch (type) {
      case 1: {
        data.forEach((_data) => {
          if (this.findFeature(_data.id)) return
          const ps = _data.positions
          ps.push(ps[0])
          const pArr = []
          ps.forEach((p) => {
            pArr.push(parseFloat(p.longitude), parseFloat(p.latitude), (parseFloat(p.height) || 200) + 500)
          })
          const material = new SuperMap3D.PolylineTrailLinkMaterialProperty({
            url: _data.style.url,
            color: SuperMap3D.Color.AQUAMARINE.withAlpha(0.5),
            duration: 2500
          })

          const pos = SuperMap3D.Cartesian3.fromDegreesArrayHeights(pArr)
          const opt = {
            id: _data.id,
            wall: {
              positions: pos,
              material: material
              //   distanceDisplayCondition: new SuperMap3D.DistanceDisplayCondition(10.0, 3000)
            },
            stay: true,
            userData: _data.data
          }

          this.dataSource.entities.add(opt)
        })
        break
      }
    }
  }

  findFeature(id) {
    const entities = this.dataSource.entities
    return entities._entities._array.find((e) => e.id === id)
  }

  findClusterFeature(id) {
    const entities = this.dataClusterSource.entities
    return entities._entities._array.find((e) => e.id === id)
  }

  flyToPoints(data) {
    if (data.length > 1) {
      const lineArr = data.map((_p) => [parseFloat(_p.position.longitude), parseFloat(_p.position.latitude)])
      const line = turf.lineString(lineArr)
      const bbox = turf.bbox(line)
      const bboxPolygon = turf.bboxPolygon(bbox)
      const buffered = (this.buffer = turf.buffer(bboxPolygon, 3000, {
        units: 'meters'
      }))
      const bbox2 = turf.bbox(buffered)
      const rectangle = new SuperMap3D.Rectangle.fromDegrees(...bbox2)
      this.viewer.scene.camera.flyTo({
        destination: rectangle,
        duration: 3
      })
    } else {
      const _p = data[0]
      const lon = parseFloat(_p.position.longitude)
      const lat = parseFloat(_p.position.latitude)
      const height = parseFloat(_p.position.height)
      this.viewer.scene.camera.flyTo({
        destination: SuperMap3D.Cartesian3.fromDegrees(lon, lat, height + 1550),
        duration: 3
      })
    }
  }

  removeById(id) {
    this._removeFeature({ id: id })
  }

  clearNotStay() {
    const entities = this.dataSource.entities
    const entityArr = entities._entities._array
    for (let index = entityArr.length - 1; index > -1; index--) {
      const entity = entityArr[index]
      if (!entity.stay) {
        this.dataSource.entities.remove(entity)
      }
    }
    const clusters = this.dataClusterSource.entities
    const clusterArr = clusters._entities._array
    for (let index = clusterArr.length - 1; index > -1; index--) {
      const entity = clusterArr[index]
      if (!entity.stay) {
        this.dataClusterSource.entities.remove(entity)
      }
    }
  }

  clear() {
    this.dataSource.entities.removeAll()
    this.dataClusterSource.entities.removeAll()
  }
}

const EntityFeature = singleton(EntityFeatureIns)

export default EntityFeature
