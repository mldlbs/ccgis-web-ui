import { GisDialog } from '@gis'
const initPanel = function() {
  const panelData = [
    {
      title: '工具栏',
      name: 'GisFeature',
      data: {},
      conf: {
        type: 'tp1'
      },
      style: {
        width: 400,
        height: 310,
        top: 0,
        left: 0,
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
  GisDialog.createFromJson(panelData)
}

export { initPanel }
