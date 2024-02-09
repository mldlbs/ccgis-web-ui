/*global SuperMap3D*/
export class Material {
  constructor() {
    if (!Material.instance) {
      this.addPolylineTrailLinkMaterial()
      Material.instance = this
    }
    return Material.instance
  }
  addPolylineTrailLinkMaterial() {
    class PolylineTrailLinkMaterialProperty {
      constructor(options) {
        this._definitionChanged = new SuperMap3D.Event()
        this._color = undefined
        this._colorSubscription = undefined
        this.url = options.color
        this.color = options.color
        this.duration = options.duration
        this.trailImage = options.trailImage
        this._time = new Date().getTime()
      }
      getType(time) {
        return 'PolylineTrailLink'
      }
      getValue(time, result) {
        if (!SuperMap3D.defined(result)) {
          result = {}
        }
        result.color = SuperMap3D.Property.getValueOrClonedDefault(this._color, time, SuperMap3D.Color.WHITE, result
          .color)

        if (this.trailImage) {
          result.image = this.trailImage
        } else {
          result.image = SuperMap3D.Material.PolylineTrailLinkImage
        }
        if (this.duration) {
          result.time =
                      ((new Date().getTime() - this._time) % this.duration) / this.duration
        }
        return result
      }
      equals(other) {
        return this === other || (other instanceof PolylineTrailLinkMaterialProperty && SuperMap3D.Property.equals(this
          ._color, other._color))
      }
    }

    Object.defineProperties(PolylineTrailLinkMaterialProperty.prototype, {
      isConstant: {
        get: function() {
          return false
        }
      },
      definitionChanged: {
        get: function() {
          return this._definitionChanged
        }
      },
      color: SuperMap3D.createPropertyDescriptor('color')
    })

    SuperMap3D.PolylineTrailLinkMaterialProperty = PolylineTrailLinkMaterialProperty
    SuperMap3D.Material.PolylineTrailLinkType = 'PolylineTrailLink'
    SuperMap3D.Material.PolylineTrailLinkImage = this.url || '/img/marker/color.png'
    SuperMap3D.Material.PolylineTrailLinkSource = ` czm_material czm_getMaterial(czm_materialInput 
                                                          materialInput)\n\
                                                          {\n\
                                                          czm_material material = 
                                                          czm_getDefaultMaterial(materialInput);\n\
                                                          vec2 st = materialInput.st;\n\
                                                          vec4 colorImage = texture2D(image, 
                                                          vec2(fract(st.t - time), st.t));\n\
                                                          vec4 fragColor;\n\
                                                          fragColor.rgb = color.rgb / 1.0;\n\
                                                          fragColor = czm_gammaCorrect(fragColor);\n\
                                                          material.alpha = colorImage.a * color.a;\n\
                                                          material.diffuse = color.rgb;\n\
                                                          material.emission = fragColor.rgb;\n\
                                                          return material;\n\}`

    SuperMap3D.Material._materialCache.addMaterial(SuperMap3D.Material.PolylineTrailLinkType, {
      fabric: {
        type: SuperMap3D.Material.PolylineTrailLinkType,
        uniforms: {
          color: new SuperMap3D.Color(1.0, 1.0, 1.0, 1),
          image: SuperMap3D.Material.PolylineTrailLinkImage,
          time: 0
        },
        source: SuperMap3D.Material.PolylineTrailLinkSource
      },
      translucent: function(_material) {
        return true
      }
    })
  }
}
