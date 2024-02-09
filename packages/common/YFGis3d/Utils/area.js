// 计算多边形面积
export default function getArea(points, Cesium) {
  let res = 0

  // 拆分三角曲面
  for (let i = 0; i < points.length - 2; i++) {
    const j = (i + 1) % points.length
    const k = (i + 2) % points.length
    const totalAngle = Angle(points[i], points[j], points[k])
    const ci = Cesium.Cartesian3.fromDegrees(points[i].longitude, points[i].latitude, points[i].height)
    const cj = Cesium.Cartesian3.fromDegrees(points[j].longitude, points[j].latitude, points[j].height)
    const ck = Cesium.Cartesian3.fromDegrees(points[k].longitude, points[k].latitude, points[k].height)
    const dis_temp1 = Cesium.Cartesian3.distance(ci, cj)
    const dis_temp2 = Cesium.Cartesian3.distance(cj, ck)
    res += dis_temp1 * dis_temp2 * Math.abs(Math.sin(totalAngle))
  }
  return res.toFixed(4)
}
// function distance(point1, point2) {
//   let point1cartographic = Cesium.Cartographic.fromCartesian(point1);
//   let point2cartographic = Cesium.Cartographic.fromCartesian(point2);
//   /**根据经纬度计算出距离**/
//   let geodesic = new Cesium.EllipsoidGeodesic();
//   geodesic.setEndPoints(point1cartographic, point2cartographic);
//   let s = geodesic.surfaceDistance;
//   //返回两点之间的距离
//   s = Math.sqrt(Math.pow(s, 2) + Math.pow(point2cartographic.height - point1cartographic.height, 2));
//   return s;
// }

/* 角度*/
function Angle(p1, p2, p3) {
  const bearing21 = Bearing(p2, p1)
  const bearing23 = Bearing(p2, p3)
  let angle = bearing21 - bearing23
  if (angle < 0) {
    angle += 360
  }
  return angle
}

/* 方向*/
function Bearing(from, to) {
  const radiansPerDegree = Math.PI / 180.0 // 角度转化为弧度(rad)
  const degreesPerRadian = 180.0 / Math.PI // 弧度转化为角度
  const latitude1 = from.latitude * radiansPerDegree
  const longitude1 = from.longitude * radiansPerDegree
  const latitude2 = to.latitude * radiansPerDegree
  const longitude2 = to.longitude * radiansPerDegree
  let angle = -Math.atan2(Math.sin(longitude1 - longitude2) * Math.cos(latitude2), Math.cos(latitude1) * Math.sin(latitude2) - Math.sin(latitude1) * Math.cos(latitude2) * Math.cos(longitude1 - longitude2))
  if (angle < 0) {
    angle += Math.PI * 2.0
  }
  angle = angle * degreesPerRadian // 角度
  return angle
}
