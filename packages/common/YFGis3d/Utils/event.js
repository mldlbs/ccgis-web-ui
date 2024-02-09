import signals from './signal'

const Event = {
  // 拾取
  selected: new signals.Signal(),
  picked: new signals.Signal(),
  enter: new signals.Signal(),
  leave: new signals.Signal(),
  // 绘制
  drawStart: new signals.Signal(),
  drawEnd: new signals.Signal()
}

export default Event
