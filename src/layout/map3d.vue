<template>
  <div id="Container" />
</template>

<script>
/*eslint no-undef: */
export default {
  mounted() {
    var viewer = new SuperMap3D.Viewer('Container', {
      infoBox: false,
      selectionIndicator: false
    })
    var scene = viewer.scene

    window.viewer = viewer
    window.scene = scene

    scene.debugShowFramesPerSecond = true
    const dataSource = new SuperMap3D.CustomDataSource('draw-shape')
    viewer.dataSources.add(dataSource)

    try {
      // 打开所发布三维服务下的所有图层
      var promise = scene.open('http://117.176.63.158:31111/iserver/services/realspace-QXSY_JKWD/rest/realspace')
      SuperMap3D.when(promise, function(layers) {
        for (var i = 0; i < layers.length; i++) {
          layers[i].selectEnabled = false
        }

        if (!scene.pickPositionSupported) {
          alert('不支持深度纹理,无法拾取位置！')
        }
      }, function(e) {
        if (widget._showRenderLoopErrors) {
          var title = '加载SCP失败，请检查网络连接状态或者url地址是否正确？'
          widget.showErrorPanel(title, undefined, e)
        }
      })
    } catch (e) {
      if (widget._showRenderLoopErrors) {
        var title = '渲染时发生错误，已停止渲染。'
        widget.showErrorPanel(title, undefined, e)
      }
    }
  }
}
</script>

<style>
#Container {
    position: absolute;
    width: 100vw;
    height: 100vh;
}
</style>
