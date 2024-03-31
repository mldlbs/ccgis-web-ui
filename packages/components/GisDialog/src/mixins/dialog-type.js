// 弹框模式
import { Event } from '../../../../utils/bus'

const DialogType = {
  data() {
    return {
      tp: {}
    }
  },
  mounted() {
    this.initType()
    this.$forceUpdate()
  },
  methods: {
    initType() {
      const conf = this.config.conf
      if (!conf) return

      const type = conf.type

      switch (type) {
        // 默认模式
        case Event.Dialog.type1: {
          this.tp.header = true
          this.tp.title = true
          this.tp.close = true
          break
        }
        // 无标题模式
        case Event.Dialog.type2: {
          this.tp.header = false
          break
        }
        // 无关闭按钮模式
        case Event.Dialog.type3: {
          this.tp.header = true
          this.tp.title = true
          this.tp.close = false
          break
        }
        // 无标题模式
        case Event.Dialog.type4: {
          this.tp.header = false
          break
        }
        default:
          this.tp.header = true
          this.tp.title = true
          this.tp.close = true
          break
      }
    }
  }
}

export default DialogType
