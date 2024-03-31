import Layout from '@/layout'

const routes = [
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import(/* webpackChunkName: "" */ '@/pages/home.vue')
      },
      {
        path: '/editor',
        name: 'editor',
        component: () => import(/* webpackChunkName: "" */ '@/pages/editor.vue')
      }
    ]
  }
]

export default routes
