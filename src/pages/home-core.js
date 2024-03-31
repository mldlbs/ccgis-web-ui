const initPanel = function() {
  const panelData = [
    {
      title: '工具栏',
      name: 'GisTest',
      show: true,
      data: {},
      conf: {
        type: 'tp2'
      },
      style: {
        width: 800,
        height: 350,
        top: 100,
        left: 100,
        margin: '0px',
        border: 'none',
        borderRadius: 0,
        background: '#0e0e1499'
      },
      drag: {
        enabled: true
      }
    }
  ]
  this.$Panel.createPanel(panelData)
}

export { initPanel }
