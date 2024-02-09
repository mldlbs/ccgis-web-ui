(context => context.keys().map(context))(require.context('@/assets/icons/svg', false, /\.svg$/))

// // import fs from 'fs'
// import path from 'path'

// // 定义一个函数，用于获取指定目录下的所有SVG文件路径
// async function readdirSync(directoryPath) {
//   try {
//     // 发起一个请求，获取指定目录下的内容
//     const response = await fetch(directoryPath)
//     const html = await response.text()

//     // 创建一个虚拟的 DOM 元素
//     const parser = new DOMParser()
//     const doc = parser.parseFromString(html, 'text/html')

//     // 选择所有 <a> 元素
//     const links = doc.querySelectorAll('a')
//     const svgPaths = []

//     console.log(response, html, links)
//     // 遍历每个链接，获取 SVG 文件路径
//     links.forEach(link => {
//       const href = link.getAttribute('href')
//       // 如果链接以 .svg 结尾，将其添加到路径数组中
//       if (href.endsWith('.svg')) {
//         // 拼接目录路径和文件名，形成完整的 SVG 文件路径
//         svgPaths.push(`${directoryPath}/${href}`)
//       }
//     })

//     return svgPaths
//   } catch (error) {
//     console.error('Error fetching directory:', error)
//     return []
//   }
// }

// (dir => dir.map(file => path.join(dir, file)))(readdirSync('@/assets/icons/svg').filter(file => file.endsWith('.svg')))
// directoryPath => fs.readdirSync('@/assets/icons/svg').filter(file => file.endsWith('.svg')).map()

// import 'virtual:svg-icons-register'
