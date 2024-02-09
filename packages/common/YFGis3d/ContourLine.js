/*global SuperMap3D,*/ // SuperMap
/*eslint new-cap: */
import DrawFeature from './DrawFeature'

export default class ContourLine {
  constructor(viewer) {
    this.viewer = viewer
    this.drawFeature = new DrawFeature(this.viewer)
    this.param = {}
  }

  setHyp(posArr) {
    const hyp = new SuperMap3D.HypsometricSetting()
    // 设置分层设色的显示模式为线
    hyp.DisplayMode = SuperMap3D.HypsometricSettingEnum.DisplayMode.LINE
    // 设置线颜色为红色
    hyp._lineColor = new SuperMap3D.Color.fromCssColorString(this.param.color)
    // 等高线间隔为100m
    hyp.LineInterval = this.param.interval
    // 设置分层设色的最大/最小可见高度
    hyp.MaxVisibleValue = this.param.max
    hyp.MinVisibleValue = this.param.min
    // 新建颜色表
    var colorTable = new SuperMap3D.ColorTable()
    // 设置分层设色的颜色表
    hyp.ColorTable = colorTable
    hyp.CoverageArea = posArr
    this.viewer.scene.globe.HypsometricSetting = {
      hypsometricSetting: hyp,
      analysisMode: SuperMap3D.HypsometricSettingEnum.AnalysisRegionMode.ARM_REGION
    }
  }

  startAnalysis(param) {
    this.param = param
    this.drawFeature.startDrawPolygon(res => {
      const posArr = []
      res.cartographicArr.forEach(pos => posArr.push(pos.longitude, pos.latitude, pos.height))
      this.setHyp(posArr)

      this.drawFeature.clear()
    })
  }

  clear() {
    this.viewer.scene.globe.HypsometricSetting = undefined
    this.drawFeature.clear()
  }
}
