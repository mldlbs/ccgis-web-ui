/*global SuperMap3D*/ // SuperMap
/*eslint new-cap: */
import { singleton } from './Utils/singleton'
import Event from './Utils/event'

let popups = []

class PopupFeatureIns {
  constructor(viewer) {
    this.viewer = viewer
    this.isDrawing = false
    this.isWheeling = false
    this._renderListener()

    Event.drawStart.add(() => {
      this.isDrawing = true
    })
    Event.drawEnd.add(() => {
      this.isDrawing = false
    })
  }

  createPopup(config) {
    const popup = this._findPopup(config.id)
    if (popup) return popup.el

    const popupEl = document.createElement('div')
    popupEl.setAttribute('class', 'yf-popup')
    popupEl.style.position = 'fixed'
    popupEl.style.zIndex = config.zIndex || '1'
    this._setPosition(popupEl, config)

    document.body.appendChild(popupEl)

    popups.push({
      id: config.id,
      el: popupEl,
      config: config
    })
    popupEl.appendChild(config.el)

    return popupEl
  }

  updatePopup(config) {
    popups.forEach(pop => {
      if (pop.id === config.id) {
        pop.el.style.display = 'block'
        pop.el.innerHTML = ''
        pop.el.appendChild(config.el)
        pop.config = config
      }
    })
  }

  _setPosition(el, config) {
    if (config.clamp === 1) {
      const cartesian3 = this.viewer.scene.clampToHeight(config.cartesian3)
      if (cartesian3) config.cartesian3 = cartesian3
    }
    const position = SuperMap3D.SceneTransforms.wgs84ToWindowCoordinates(this.viewer.scene, config.cartesian3)
    const left = parseInt(position.x) - config.offsetX
    const top = parseInt(position.y) - config.offsetY

    el.style.left = left + 'px'
    el.style.top = top + 'px'
  }

  /**
 * 拖动场景时，改变气泡位置随场景一起移动
 */
  _renderListener() {
    this.viewer.scene.postRender.removeEventListener(this._listener.bind(this))
    this.viewer.scene.postRender.addEventListener(this._listener.bind(this))
    this.viewer.camera.changed.addEventListener(() => {
      if (this.isWheeling) {
        clearTimeout(this.isWheeling)
      }

      this.isWheeling = setTimeout(() => {
        this.isWheeling = null
      }, 300)
    })

    // window.addEventListener('wheel', (event) => {
    //   if (this.isWheeling) {
    //     clearTimeout(this.isWheeling)
    //   }

    //   this.isWheeling = setTimeout(() => {
    //     this.isWheeling = null
    //   }, 300)
    // })
  }

  _listener() {
    for (let index = 0; index < popups.length; index++) {
      this._changePosition(popups[index])
    }
  }
  _findPopup(id) {
    return popups.find(pop => pop.id === id)
  }

  _changePosition(popup) {
    const el = popup.el
    const config = popup.config

    const position = SuperMap3D.SceneTransforms.wgs84ToWindowCoordinates(this.viewer.scene, config.cartesian3)
    if (position !== undefined && position.x !== undefined) {
      const left = parseInt(position.x) - config.offsetX
      const top = parseInt(position.y) - config.offsetY
      el.style.left = left + 'px'
      el.style.top = top + 'px'
    }

    if (this.isDrawing || this.isWheeling) {
      el.style.pointerEvents = 'none'
    } else {
      el.style.pointerEvents = 'fill'
    }
  }

  close(id) {
    if (id) {
      const crps = popups.filter((item) => item.id.indexOf(id) > -1)
      if (crps.length > 0) {
        crps.forEach(crp => {
          const crpp = crp.el.parentNode
          if (!crpp) return
          const config = crp.config
          if (config.stay) {
            crp.el.style.display = 'none'
          } else {
            crpp.removeChild(crp.el)
            popups = popups.filter(item => item.id !== id)
          }
        })
      }
    //   const crp = popups.find(item => item.id === id)
    //   if (!crp) return
    //   const crpp = crp.el.parentNode
    //   const config = crp.config
    //   if (config.stay) {
    //     crp.el.style.display = 'none'
    //   } else {
    //     crpp.removeChild(crp.el)
    //     popups = popups.filter(item => item.id !== id)
    //   }
    } else {
      popups.forEach(crp => {
        const crpp = crp.el.parentNode
        const config = crp.config
        if (config.stay) {
          crp.el.style.display = 'none'
        } else {
          crpp.removeChild(crp.el)
          popups = []
        }
      })
    }
  }

  clear() {
    popups.forEach(item => {
      var crpp = item.el.parentNode
      crpp.removeChild(item.el)
    })
    popups = []
  }
}

const PopupFeature = singleton(PopupFeatureIns)

export default PopupFeature
