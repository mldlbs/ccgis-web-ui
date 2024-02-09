/*global SuperMap3D,*/ // SuperMap
/*eslint new-cap: */
import DrawFeature from './DrawFeature'

export default class Gradient {
  constructor(viewer) {
    this.viewer = viewer
    this.drawFeature = new DrawFeature(this.viewer)
    this.param = {}
  }

  setSlopeSetting(posArr) {
    // SlopeSetting
    const gradientObj = new SuperMap3D.SlopeSetting()
    gradientObj.DisplayMode = SuperMap3D.SlopeSettingEnum.DisplayMode.FACE_AND_ARROW
    gradientObj.MaxVisibleValue = this.param.gradientRange[1]
    gradientObj.MinVisibleValue = this.param.gradientRange[0]
    gradientObj.Opacity = 0.5

    // ColorTable
    const colorTable = new SuperMap3D.ColorTable()
    colorTable.insert(0, new SuperMap3D.Color(9 / 255, 9 / 255, 255 / 255))
    colorTable.insert(20, new SuperMap3D.Color(0, 161 / 255, 1))
    colorTable.insert(30, new SuperMap3D.Color(20 / 255, 187 / 255, 18 / 255))
    colorTable.insert(50, new SuperMap3D.Color(221 / 255, 224 / 255, 7 / 255))
    colorTable.insert(80, new SuperMap3D.Color(255 / 255, 0 / 255, 0 / 255))
    gradientObj.ColorTable = colorTable

    // const gradientOfMode = SuperMap3D.HypsometricSettingEnum.AnalysisRegionMode.ARM_REGION
    // gradientOfMode = SuperMap3D.HypsometricSettingEnum.AnalysisRegionMode.ARM_ALL;

    // self.drawGradientArea()

    gradientObj.CoverageArea = posArr

    this.gradientObj = gradientObj
    // this.viewer.scene.globe.SlopeSetting = {
    //   slopeSetting: gradientObj,
    //   analysisMode: SuperMap3D.HypsometricSettingEnum.AnalysisRegionMode.ARM_REGION
    // }
  }

  startAnalysis(param) {
    this.param = param
    this.viewer.scene.globe.SlopeSetting = {
      slopeSetting: this.gradientObj,
      analysisMode: SuperMap3D.HypsometricSettingEnum.AnalysisRegionMode.ARM_REGION
    }
    this.drawFeature.startDrawPolygon(res => {
      const posArr = []
      res.cartographicArr.forEach(pos => posArr.push(pos.longitude, pos.latitude, pos.height))
      this.setSlopeSetting(posArr)

      this.drawFeature.clear()
    })
  }

  clear() {
    this.viewer.scene.globe.SlopeSetting = {
      slopeSetting: this.gradientObj,
      analysisMode: SuperMap3D.HypsometricSettingEnum.AnalysisRegionMode.ARM_NONE
    }
    this.drawFeature.clear()
  }
}
