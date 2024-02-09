// 创建数据源
/*global SuperMap3D*/

class DataSource {
  constructor(viewer) {
    this.viewer = viewer
  }

  create(id, unclear, tempLayer = false) {
    let dataSource = this.find(id)
    if (dataSource) {
      return dataSource
    }
    dataSource = new SuperMap3D.CustomDataSource(id)
    dataSource.id = id
    if (dataSource) {
      dataSource.unClear = tempLayer ? true : unclear // 临时图层不可清除
    }
    return dataSource
  }

  find(id) {
    return this.viewer.dataSources._dataSources.find((ds) => ds.name === id)
  }
}

export default DataSource

