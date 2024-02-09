// 弹框模式
import { Event } from '../../../../utils/bus'

const DialogType = {
  methods: {
    initType() {
      const conf = this.compData.conf
      if (!conf) return

      const type = conf.type

      switch (type) {
        case Event.Dialog.type1: {
          this.tp.header = true
          this.tp.title = true
          this.tp.close = true
          break
        }

        case Event.Dialog.type2: {
          this.tp.header = false
          break
        }

        case Event.Dialog.type3: {
          this.tp.header = true
          this.tp.title = true
          this.tp.close = false
          break
        }

        case Event.Dialog.type4: {
          this.tp.header = false
          break
        }

        default:
          break
      }
    }
  }
}

export default DialogType
