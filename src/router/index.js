import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

const routes = [{
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login')
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/home'),
    redirect: '/welcome',
    children:[
      {
        path:'/welcome',
        name:'Welcome',
        component: () => import('@/views/home/welcome.vue')
      },

    ]
    
  }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next();
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  // 没有获得token,跳转到、/login页面
  if (!tokenStr) {
    return next('/login')
  }
  next();
})

export default router