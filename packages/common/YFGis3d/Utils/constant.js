const DrawType = {
  POINT: 'point',
  POLYLINE: 'polyline',
  POLYGON: 'polygon',
  CIRCLE: 'circle',
  RECTANGLE: 'extent',
  RECTANGLE2: 'extent2',
  ELLIPSE: 'ellipse',
  BOX: 'box',
  ELLIPSOID: 'ellipsoid',
  FRUSTUM: 'frustum',
  HEIGHT: 'height'
}

const DrawTypeStyle = {
  [DrawType.POINT]: 'SuperMap.Geometry.Point',
  [DrawType.POLYLINE]: 'SuperMap.Geometry.LineString',
  [DrawType.POLYGON]: 'SuperMap.Geometry.Polygon'
}

export { DrawType, DrawTypeStyle }
