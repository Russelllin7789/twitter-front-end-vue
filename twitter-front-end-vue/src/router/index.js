import Vue from 'vue'
import VueRouter from 'vue-router'
import NotFound from '../views/NotFound'
import SignIn from '../views/SignIn'
import Main from '../views/MainTweets'
import store from '../store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/tweet/:id/reply-list',
    name: 'reply-list',
    component: () => import('../views/MainTweetsReplyList.vue')
  },
  {
    path: '/admin/users',
    name: 'admin-users',
    component: () => import('../views/AdminUsers.vue')
  },
  {
    path: '/admin/main',
    name: 'admin-main',
    component: () => import('../views/AdminMain.vue')
  },
  {
    path: '/admin/login',
    name: 'admin',
    component: () => import('../views/Admin.vue')
  },
  {
    path: '/admin',
    exact: true,
    redirect: '/admin/login'
  },
  {
    path: '/',
    name: 'root',
    redirect: '/signin'
  },
  {
    path: '/signin',
    name: 'sign-in',
    component: SignIn
  },
  {
    path: '/signup',
    name: 'sign-up',
    component: () => import('../views/SignUp.vue')
  },
  {
    path: '/main',
    name: 'main-tweets',
    component: Main
  },
  {
    path: '/user/setting',
    name: 'user-setting',
    component: () => import('../views/UserSetting.vue')

  },
  {
    path: '/user/chatting/public',
    name: 'public-chat',
    component: () => import('../views/PublicChat.vue')

  },
  {
    path: '/user/chatting/:id',
    name: 'private-chat',
    component: () => import('../views/PrivateChat.vue')

  },
  {
    path: '/user/profile/:id/:category?',
    name: 'user-profile',
    component: () => import('../views/UserProfile.vue')

  },
  {
    path: '/user/:id/:followship',
    exact: true,
    name: 'user-followlist',
    component: () => import('../views/UserFollowList.vue')
  },
  {
    path: '/chatroom',
    name: 'chatroom',
    component: () => import('../views/Chatroom')

  },
  {
    path: '/test',
    name: 'test',
    component: () => import('../views/Test')

  },
  {
    path: '*',
    name: 'not-found',
    component: NotFound
  }
]

const router = new VueRouter({
  linkExactActiveClass: 'active',
  routes
})

router.beforeEach(async (to, from, next) => {
  // 從 localStorage 取出 token
  const tokenInLocalStorage = localStorage.getItem('token')
  const tokenInStore = store.state.token
  let isAuthenticated = store.state.isAuthenticated

  // 比較 localStorage 和 store 中的 token 是否一樣
  if (tokenInLocalStorage && tokenInLocalStorage !== tokenInStore) {
    isAuthenticated = await store.dispatch('fetchCurrentUser')
  }

  // 如果 token 有效則轉址到推特首頁
  if (isAuthenticated && to.name === 'sign-in') {
    next('/main/')
    return
  }

  // 對於不需要驗證 token 的頁面
  const pathsWithoutAuthentication = ['sign-up', 'sign-in', 'admin']

  // 如果 token 無效且進入需要驗證的頁面則轉址到登入頁
  if (!isAuthenticated && !pathsWithoutAuthentication.includes(to.name)) {
    next('/signin')
    return
  }

  // 如果 token 有效且進入不需要驗證到頁面則轉址到首頁
  if (isAuthenticated && pathsWithoutAuthentication.includes(to.name)) {
    next('/main')
    return
  }

  next()
})

export default router
