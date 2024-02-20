/* global */
// 事件执行引擎
class Engine {
  constructor() {
    this.flows = []
    this.step = {
      remaining: false,
      pauseIndex: -1
    }
  }

  // 根据数据生成 流程对象
  fromJson(data) {
    if (data instanceof Array && data.length > 0) {
      this.flows = data
    }
  }

  // 组装对象
  assembly(plan, callback) {
    const new2 = JSON.parse(JSON.stringify(plan))
    new2.forEach((item, i) => {
      if (i === 0) {
        item.delay = 0
      } else {
        item.delay = Number(plan[i - 1].duration)
      }
      item.execute = () => callback(item)
    })
    this.flows = new2
  }

  log(item) {
    console.log(item)
  }

  // 开始流程
  start() {
    this.step.remaining = false
    // this.step.pauseIndex = -1;
    this.excute()
  }
  excute() {
    let p = Promise.resolve()
    this.flows.forEach((item, i) => {
      p = p.then(() => new Promise(resolve => {
        if (!this.step.remaining && this.step.pauseIndex <= i) {
          setTimeout(() => {
            this.doAction(item, i)
            resolve()
          }, item.delay * 1000)
        } else {
          resolve()
        }
      }
      ))
    })
  }

  // 暂停流程
  pause() {
    this.step.remaining = true
    this.step.pauseIndex = this.step.index
  }

  // 停止流程
  stop() {
    this.step.remaining = true
    this.step.pauseIndex = -1
  }

  // 执行动作
  doAction(item, i) {
    if (!this.step.remaining) {
      if (this.step.pauseIndex < i) {
        this.step.index = i
        item.execute()
      }
    }
  }
}

export default Engine
