const Directives = {
  directives: {
    drag: {
      bind: function(el, binding, vnode) {
        vnode.context.draging = false
        if (!binding.value) return
        //
        const dragElement = el.querySelector('#ccgis-editor-header')
        if (!dragElement) return

        const original = {
          x: 0,
          y: 0,
          left: 0,
          top: 0
        }

        function setOriginal(evt) {
          original.x = evt.clientX
          original.y = evt.clientY
          original.left = el.offsetLeft || Number(el.style.left.replace('px', ''))
          original.top = el.offsetTop || Number(el.style.top.replace('px', ''))
        }

        function mousedownEvt(evt) {
          vnode.context.draging = true
          evt.stopPropagation()
          setOriginal(evt)
        }

        function mousemoveEvt(evt) {
          evt.stopPropagation()
          if (!vnode.context.draging) return
          el.opacity = '0.8'
          const left = original.left + (evt.clientX - original.x)
          const top = original.top + (evt.clientY - original.y)

          el.style.left = left + 'px'
          el.style.top = top + 'px'

          const winInfo = {
            width: el.style.width,
            height: el.style.height,
            left: el.style.left,
            top: el.style.top
          }
          vnode.context.handleMove(winInfo)
        }

        function mouseupEvt(evt) {
          evt.stopPropagation()
          // if (!draging) return
          vnode.context.draging = false
          //   vnode.context.$parent.$el.style.pointerEvents = 'none'

          setOriginal(evt)
        }

        dragElement.addEventListener('mousedown', mousedownEvt, true)
        window.addEventListener('mousemove', mousemoveEvt, true)
        window.addEventListener('mouseup', mouseupEvt, true)
      }
    },
    resize: {
    }
  }

}

export default Directives
