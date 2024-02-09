/*global SuperMap3D*/
const createStyle = function(style, geo, gradientFlag, param) {
  let _style = {}
  const defaultColor = '#FF4500'
  if (geo) {
    let className
    if (typeof geo === 'string') {
      className = geo
    } else if (geo.CLASS_NAME) {
      className = geo.CLASS_NAME
    } else if (geo.type) {
      className = geo.type
    }
    switch (className) {
      case 'POINT3D':
      case 'SuperMap.Geometry.Point':
      case 'SuperMap.Geometry.MultiPoint': {
        _style = style.Point ? style.Point : style
        _style = JSON.parse(JSON.stringify(_style))
        if (param) {
          _style = Object.assign(_style, param)
        }
        _style.style3D = function() {
          const fc = SuperMap3D.Color.fromCssColorString(this.fillColor || defaultColor)
          fc.alpha = this.fillOpacity || 1
          const oc = SuperMap3D.Color.fromCssColorString(this.strokeColor || defaultColor)
          oc.alpha = this.strokeOpacity || 1
          const outline = this.outline || false
          return {
            color: fc,
            outline,
            outlineColor: oc,
            outlineWidth: this.strokeWidth,
            pixelSize: this.pointRadius || 1
          }
        }
        break
      }
      case 'SuperMap.Geometry.LineString':
      case 'SuperMap.Geometry.LinearRing':
      case 'SuperMap.Geometry.MultiLineString': {
        _style = style.Polyline ? style.Polyline : style
        _style = JSON.parse(JSON.stringify(_style))
        if (param) {
          _style = Object.assign(_style, param)
        }
        _style.style3D = function() {
          const oc = SuperMap3D.Color.fromCssColorString(this.strokeColor || defaultColor)
          oc.alpha = this.strokeOpacity || 1
          return {
            material: oc,
            width: this.strokeWidth || 1
          }
        }
        break
      }
      case 'SuperMap.Geometry.Polygon':
      case 'SuperMap.Geometry.Rectangle':
      case 'SuperMap.Geometry.MultiPolygon': {
        _style = style.Polygon ? style.Polygon : style
        _style = JSON.parse(JSON.stringify(_style))
        if (param) {
          _style = Object.assign(_style, param)
        }
        _style.style3D = function() {
          let fc
          if (gradientFlag) {
            // fc = gradient3D(this.fillColor)
          } else {
            fc = SuperMap3D.Color.fromCssColorString(this.fillColor || defaultColor)
            fc.alpha = this.fillOpacity === undefined ? 1 : this.fillOpacity
          }
          const oc = SuperMap3D.Color.fromCssColorString(this.strokeColor || defaultColor)
          oc.alpha = this.strokeOpacity
          const outline = this.outline || false
          let fill = true
          if (this.fill !== undefined) {
            fill = this.fill
          }
          const outlineWidth = this.strokeWidth !== undefined ? this.strokeWidth : 1
          return {
            material: fc,
            outlineColor: oc,
            outline,
            fill,
            outlineWidth: outlineWidth,
            width: outlineWidth
          }
        }
        break
      }
      default:
        break
    }
  } else {
    _style = style
  }
  if (_style.strokeColor) {
    // _style.strokeColor = gradient(_style.strokeColor)
  }
  if (_style.fillColor) {
    // _style.fillColor = gradient(_style.fillColor)
  }
  if (_style && _style.picUrl) {
    // return createPictureStyle(_style)
  } else {
    return _style
  }
}

const Style = {
  buffer: function(geo) {
    return createStyle(
      {
        Point: {
          strokeColor: '#66cccc',
          strokeWidth: 1,
          strokeOpacity: 1,
          fillColor: '#66cccc',
          fillOpacity: 0.5,
          pointRadius: 5
        },
        Polyline: { strokeColor: '#66cccc', strokeWidth: 2, strokeOpacity: 1 },
        Polygon: {
          strokeColor: '#66cccc',
          strokeWidth: 2,
          strokeOpacity: 1,
          fillColor: '#66cccc',
          fillOpacity: 0.3,
          outline: true
        }
      },
      geo
    )
  },
  orbit: function(geo) {
    return createStyle(
      {
        Point: {
          strokeColor: '#66cccc',
          strokeWidth: 1,
          strokeOpacity: 1,
          fillColor: '#66cccc',
          fillOpacity: 0.5,
          pointRadius: 5
        },
        Polyline: { strokeColor: '#D8C70A', strokeWidth: 6, strokeOpacity: 1 },
        Polygon: {
          strokeColor: '#66cccc',
          strokeWidth: 2,
          strokeOpacity: 1,
          fillColor: '#66cccc',
          fillOpacity: 0.5,
          outline: true
        }
      },
      geo
    )
  },
  drawing: function(geo) {
    return createStyle(
      {
        Point: {
          strokeColor: '#66cccc',
          strokeWidth: 1,
          strokeOpacity: 1,
          fillColor: '#66cccc',
          fillOpacity: 0.5,
          pointRadius: 5
        },
        Polyline: { strokeColor: '#66cccc', strokeWidth: 2, strokeOpacity: 1 },
        Polygon: {
          strokeColor: '#66cccc',
          strokeWidth: 2,
          strokeOpacity: 1,
          fillColor: '#66cccc',
          fillOpacity: 0.5,
          outline: true
        }
      },
      geo
    )
  },
  draw: function(geo) {
    return createStyle(
      {
        Point: {
          strokeColor: '#51ff00',
          strokeWidth: 1,
          strokeOpacity: 1,
          outline: true,
          fillColor: '#e1b960',
          fillOpacity: 0.8,
          pointRadius: 5
        },
        Polyline: {
          strokeColor: '#ff0000',
          strokeWidth: 2,
          strokeOpacity: 1
        },
        Polygon: {
          strokeColor: '#51ff00',
          strokeWidth: 1,
          strokeOpacity: 1,
          fillColor: '#e1b960',
          fillOpacity: 0.8,
          outline: true
        }
      },
      geo
    )
  }
}

export default Style
