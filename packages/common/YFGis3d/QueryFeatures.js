/*global SuperMap*/ // SuperMap
/*eslint new-cap: */
import { singleton } from './Utils/singleton'

/**
 * 封装二三维数据服务查询功能
 * 来源：gaf-ui-map
 */
class QueryFeaturesIns {
  /**
     * 处理字段值数组到对象
     *
     */
  fieldArrayToObject(fieldNames, fieldValues) {
    if (!fieldNames || !fieldValues || !(fieldNames instanceof Array) || !(fieldValues instanceof Array)) return

    const data = {}
    for (let index = 0; index < fieldNames.length; index++) {
      const fieldName = fieldNames[index]
      data[fieldName] = fieldValues[index]
    }
    return data
  }
  /**
     * 空间分析
     * @param {String} dataUrl 数据服务地址
     */
  minDistanceAnalysis(dataUrl) {
    // return new Promise((resolve, reject) => {
    //   const getFeaturesByBufferParameters = new SuperMap.REST.MinDistanceAnalystParameters(
    //     {
    //       datasetNames: [dataSource + ':' + dataset],
    //       fromIndex,
    //       toIndex,
    //       bufferDistance,
    //       geometry: drawGeometryArgs
    //     }
    //   )
    //   const getFeaturesByBufferService = new SuperMap.REST.GetFeaturesByBufferService(
    //     dataUrl,
    //     {
    //       eventListeners: {
    //         processCompleted: queryEventArgs => {
    //           resolve(queryEventArgs)
    //         },
    //         processFailed: error => {
    //           reject(error)
    //         }
    //       }
    //     }
    //   )
    //   getFeaturesByBufferService.processAsync(getFeaturesByBufferParameters)
    // })
  }
  /**
   *空间查询
   *
   * @param {String} dataUrl 数据服务地址
   * @param {String} dataSource 数据源名称
   * @param {String} dataset 数据集名称
   * @param {Object} drawGeometryArgs 绘制的图形
   * @param {String} spatialQueryMode 空间查询模型
   * @returns 返回查询结果
   * @memberof QueryFeatures
   */
  queryMapFeaturesByBuffer(
    dataUrl,
    dataSource,
    dataset,
    drawGeometryArgs,
    bufferDistance,
    fromIndex,
    toIndex = -1
  ) {
    return new Promise((resolve, reject) => {
      const getFeaturesByBufferParameters = new SuperMap.REST.GetFeaturesByBufferParameters(
        {
          datasetNames: [dataSource + ':' + dataset],
          fromIndex,
          toIndex,
          bufferDistance,
          returnContent: true,
          geometry: drawGeometryArgs
        }
      )
      const getFeaturesByBufferService = new SuperMap.REST.GetFeaturesByBufferService(
        dataUrl,
        {
          eventListeners: {
            processCompleted: queryEventArgs => {
              resolve(queryEventArgs)
            },
            processFailed: error => {
              reject(error)
            }
          }
        }
      )
      getFeaturesByBufferService.processAsync(getFeaturesByBufferParameters)
    })
  }
  queryMapFeaturesByGeometry(
    dataUrl,
    dataSource,
    dataset,
    drawGeometryArgs,
    spatialQueryMode,
    fromIndex,
    toIndex = -1
  ) {
    return new Promise((resolve, reject) => {
      const getFeaturesByGeometryParameters = new SuperMap.REST.GetFeaturesByGeometryParameters(
        {
          datasetNames: [dataSource + ':' + dataset],
          fromIndex,
          toIndex,
          spatialQueryMode:
            spatialQueryMode || SuperMap.REST.SpatialQueryMode.INTERSECT,
          geometry: drawGeometryArgs
        }
      )
      const getFeaturesByGeometryService = new SuperMap.REST.GetFeaturesByGeometryService(
        dataUrl,
        {
          eventListeners: {
            processCompleted: queryEventArgs => {
              resolve(queryEventArgs)
            },
            processFailed: error => {
              reject(error)
            }
          }
        }
      )
      getFeaturesByGeometryService.processAsync(getFeaturesByGeometryParameters)
    })
  }
  /**
   *根据SQL语句进行查询数据
   *
   * @param {String} dataUrl 数据服务地址
   * @param {String} dataSourceName 数据源名称
   * @param {String} dataSetName 数据集名称
   * @param {String} sql sql语句
   * @param {Number} maxFeatures 最多返回多少个要素
   * @returns 返回查询结果
   * @memberof QueryFeature3D
   */
  queryMapFeaturesBySQL(
    dataUrl,
    dataSourceName,
    dataSetName,
    sql,
    fromIndex,
    toIndex = -1,
    maxFeatures
  ) {
    return new Promise((resolve, reject) => {
      const getFeatureParam = new SuperMap.REST.FilterParameter({
        attributeFilter: sql
      })
      const getFeatureBySQLParams = new SuperMap.REST.GetFeaturesBySQLParameters(
        {
          queryParameter: getFeatureParam,
          fromIndex,
          toIndex,
          datasetNames: [dataSourceName + ':' + dataSetName],
          maxFeatures
        }
      )
      const getFeatureBySQLService = new SuperMap.REST.GetFeaturesBySQLService(
        dataUrl,
        {
          eventListeners: {
            processCompleted: queryEventArgs => resolve(queryEventArgs),
            processFailed: error => reject(error)
          }
        }
      )
      getFeatureBySQLService.processAsync(getFeatureBySQLParams)
    })
  }

  /**
   *根据SQL语句进行查询数据
   *
   * @param {String} dataUrl 数据服务地址
   * @param {String} dataSourceName 数据源名称
   * @param {String} dataSetName 数据集名称
   * @param {String} sql sql语句
   * @param {Number} maxFeatures 最多返回多少个要素
   * @returns 返回查询结果
   * @memberof QueryFeature3D
   */
  queryRestMapFeaturesBySQL(
    dataUrl,
    dataSourceName,
    dataSetName,
    sql,
    fromIndex = 0,
    toIndex = -1,
    maxFeatures
  ) {
    return new Promise((resolve, reject) => {
      SuperMap.Request.POST({
        method: 'POST',
        url: dataUrl + `/featureResults.rjson?returnContent=true&fromIndex=${fromIndex}&toIndex=${toIndex}`,
        data: JSON.stringify({
          getFeatureMode: 'SQL',
          datasetNames: [dataSourceName + ':' + dataSetName],
          queryParameter: {
            attributeFilter: sql
          }
        }),
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        success: (res) => {
          const rText = res.responseText
          if (!rText) reject
          const _data = JSON.parse(rText)
          resolve(_data)
        },
        failure: (res) => {
          reject
        },
        isInTheSameDomain: false
      })
    })
  }

  /**
   *根据SQL语句进行查询数据
   *
   * @param {String} dataUrl 数据服务地址
   * @param {String} dataSourceName 数据源名称
   * @param {String} dataSetName 数据集名称
   * @returns 返回查询结果
   * @memberof QueryFeature3D
   */
  queryRestFields(
    dataUrl,
    dataSourceName,
    dataSetName
  ) {
    return new Promise((resolve, reject) => {
      SuperMap.Request.GET({
        method: 'GET',
        url: dataUrl + `/datasources/${dataSourceName}/datasets/${dataSetName}/fields.rjson?returnAll=true`,
        data: JSON.stringify({}),
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        success: (res) => {
        //   console.log(res)
          const rText = res.responseText
          if (!rText) reject
          const _data = JSON.parse(rText)
          resolve(_data)
        },
        failure: (res) => {
          reject
        },
        isInTheSameDomain: false
      })
    })
  }
  /**
   *根据要素获取填充table的所有字段
   *
   * @param {Object} feature 要素
   * @param {Boolean} filterSystemField 是否过滤系统字段 默认过滤
   * @returns 返回字段名称数组对象
   * @memberof QueryFeature3D
   */
  getTableField(feature, filterSystemField = true) {
    const fields = feature.attributes
    const columns = []
    for (const field in fields) {
      if (filterSystemField && field.match(/^SM/i)) {
        continue
      }
      columns.push({
        title: field,
        dataIndex: field,
        key: field
      })
    }
    return columns
  }
  getTableField2(feature, filterSystemField = true) {
    const fields = feature.fieldNames
    const fieldsLen = fields.length
    const columns = []
    for (let i = 0; i < fieldsLen; i++) {
      const result = fields[i].match(/^SM/i)
      if (filterSystemField && result) {
        continue
      }
      columns.push({
        title: fields[i],
        dataIndex: fields[i],
        key: fields[i]
      })
    }
    return columns
  }
  /**
   *根据要素获取填充table中的数据
   *
   * @param {Object} features
   * @returns 返回table中的数据数组
   * @memberof QueryFeature3D
   */
  getTableData(features) {
    const dataSource = []
    features.forEach((element, index) => {
      dataSource.push({ key: index, ...element.data, feature: element })
    })
    return dataSource
  }
  /**
   *根据要素获取填充table中的数据
   *
   * @param {Object} features
   * @returns 返回table中的数据数组
   * @memberof QueryFeature3D
   */
  getTableData2(features) {
    const featuresLen = features.length
    const fields = features[0].fieldNames
    const fieldsLen = fields.length
    const data = []
    for (let i = 0; i < featuresLen; i++) {
      const add = {}
      for (let j = 0; j < fieldsLen; j++) {
        add[fields[j].toLocaleUpperCase()] = features[i].fieldValues[j]
      }
      add.key = data.length
      add.feature = features[i]
      data.push(add)
    }
    return data
  }
  /**
   * 根据查询到的要素转换成对应的填充Table数据
   *
   * @param {*} features 查询到的要素结果集合 Array
   * @returns 返回查询到的数据,用于填充Table {columns  dataSource}
   * @memberof QueryFeature3D
   */
  getTableSource(features) {
    const columnsInfo = this.getTableField(features[0])
    const dataInfo = this.getTableData(features)
    const dataSource = {
      dataSource: dataInfo,
      columns: columnsInfo
    }
    return dataSource
  }
  getTableSource2(features) {
    const columnsInfo = this.getTableField2(features[0])
    const dataInfo = this.getTableData2(features)
    const dataSource = {
      dataSource: dataInfo,
      columns: columnsInfo
    }
    return dataSource
  }
  /**
   * 根据空间图形和属性条件进行数据查询
   *
   * @param {*} dataUrl 数据服务地址
   * @param {*} dataSourceName 数据源名称
   * @param {*} dataSetName 数据集名称
   * @param {*} sql 查询语句
   * @param {*} geo 查询范围图形
   * @param {*} queryMode 查询的空间模式
   * @returns 返回查询结果
   * @memberof QueryFeatures
   */
  queryFeaturesByGeometryAndSql(
    dataUrl,
    dataSourceName,
    dataSetName,
    sql,
    geo,
    queryMode,
    fromIndex,
    toIndex = -1
  ) {
    return new Promise((resolve, reject) => {
      const queryByGeometryParameters = new SuperMap.REST.QueryByGeometryParameters(
        {
          datasetNames: [dataSourceName + ':' + dataSetName],
          fromIndex,
          toIndex,
          spatialQueryMode: queryMode,
          geometry: geo,
          attributeFilter: sql
        }
      )
      const getFeaturesByGeometryService = new SuperMap.REST.GetFeaturesByGeometryService(
        dataUrl,
        {
          eventListeners: {
            processCompleted: queryEventArgs => {
              resolve(queryEventArgs)
            },
            processFailed: error => {
              reject(error)
            }
          }
        }
      )
      getFeaturesByGeometryService.processAsync(queryByGeometryParameters)
    })
  }

  // 范围查询的数据查询
  getFeaturesByBounds(
    dataUrl,
    dataSource,
    dataset,
    queryBounds,
    spatialQueryMode,
    attributeFilter,
    fromIndex,
    toIndex = -1
  ) {
    const getFeaturesByBoundsParameters = new SuperMap.REST.GetFeaturesByBoundsParameters(
      {
        datasetNames: [dataSource + ':' + dataset],
        spatialQueryMode:
          spatialQueryMode || SuperMap.REST.SpatialQueryMode.INTERSECT,
        bounds: queryBounds,
        attributeFilter,
        fromIndex,
        toIndex
      }
    )
    return new Promise((resolve, reject) => {
      const getFeaturesByBoundsService = new SuperMap.REST.GetFeaturesByBoundsService(
        dataUrl,
        {
          eventListeners: {
            processCompleted: args => {
              resolve(args)
            },
            processFailed: reject
          }
        }
      )
      getFeaturesByBoundsService.processAsync(getFeaturesByBoundsParameters)
    })
  }

  // 空间分析最近点查询
  getMinDistanceIDsByGeometry(
    analysisUrl,
    dataSource,
    dataset,
    drawGeometryArgs,
    minDistance,
    maxDistance
  ) {
    return new Promise((resolve, reject) => {
      SuperMap.Request.POST({
        method: 'POST',
        url: analysisUrl + '/geometry/mindistance.rjson',
        data: JSON.stringify({
          inputGeometries: drawGeometryArgs,
          referenceDatasetName: dataset + '@' + dataSource,
          createResultDataset: false,
          minDistance: minDistance,
          maxDistance: maxDistance
        }),
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        success: (res) => {
          const rText = res.responseText
          if (!rText) reject
          const _data = JSON.parse(rText)
          SuperMap.Request.GET({
            method: 'GET',
            url: _data.newResourceLocation + '.rjson',
            params: {},
            //   data: JSON.stringify({}),
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
            },
            success: (res) => {
              const rText = res.responseText
              if (!rText) reject
              const _data = JSON.parse(rText)
              const result = _data.distanceResults
              resolve(result)
            },
            failure: (res) => {
              reject
            },
            isInTheSameDomain: false
          })
        },
        failure: (res) => {
          reject
        },
        isInTheSameDomain: false
      })
    })
  }

  getDatasetInfo(
    dataUrl,
    dataSource,
    dataset
  ) {
    return new Promise((resolve, reject) => {
      SuperMap.Request.GET({
        method: 'GET',
        url: dataUrl + `/datasources/name/${dataSource}/datasets/name/${dataset}.rjson`,
        data: JSON.stringify({}),
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        success: (res) => {
          const rText = res.responseText
          if (!rText) reject
          const _data = JSON.parse(rText)
          const result = _data.datasetInfo
          resolve(result)
        },
        failure: (res) => {
          reject
        },
        isInTheSameDomain: false
      })
    })
  }

  /**
   * 路径分析
   */
  getPathService(networkUrl, nodes, weightFieldName) {
    const transportationAnalystResultSetting = new SuperMap.REST.TransportationAnalystResultSetting({
      returnEdgeFeatures: true,
      returnEdgeGeometry: true,
      returnEdgeIDs: true,
      returnNodeFeatures: true,
      returnNodeGeometry: true,
      returnNodeIDs: true,
      returnPathGuides: true,
      returnRoutes: true
    })

    const rransportationAnalystParameter = new SuperMap.REST.TransportationAnalystParameter({
      resultSetting: transportationAnalystResultSetting,
      weightFieldName: weightFieldName || 'SmLength'
    })

    const findPathParameters = new SuperMap.REST.FindPathParameters({
      isAnalyzeById: false,
      nodes: nodes,
      hasLeastEdgeCount: false,
      parameter: rransportationAnalystParameter
    })

    return new Promise((resolve, reject) => {
      const findPathService = new SuperMap.REST.FindPathService(networkUrl,
        {
          eventListeners: {
            processCompleted: args => {
              resolve(args)
            },
            processFailed: reject
          }
        })
      findPathService.processAsync(findPathParameters)
    })
  }
}

const QueryFeatures = singleton(QueryFeaturesIns)

export default QueryFeatures
