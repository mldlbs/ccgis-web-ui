import Layout from '@/layout'

const routes = [{
  path: '/',
  component: Layout,
  redirect: '/home',
  children: [
    {
      path: '/home',
      name: 'Home',
      component: () => import(/* webpackChunkName: "about" */ '@/pages/Home.vue')
    }]
}]

export default routes
