import { createRouter, createWebHistory } from 'vue-router'
import IndexView from '@/components/IndexView.vue'
import store from '../store'
import { ElMessage } from 'element-plus'
import axios from '../server'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/school',
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/admin/AdminView.vue'),
    },
    {
      path: '/admin/index',
      name: 'adminindex',
      component: () => import('@/admin/AdminIndex.vue'),
      beforeEnter: (to, from) => {
        if (from.name && from.name === 'admin') return true
        return { name: 'admin' }
      },
    },
    {
      path: '/chat',
      name: 'chat',
      component: () => import('@/views/chat/ChatView.vue'),
      children: [
        {
          path: 'chats',
          name: 'chats',
          component: () => import('@/components/FriendsMessage.vue'),
        },
      ],
    },
    {
      path: '/school',
      name: 'school',
      component: () => import('@/views/user/UserView.vue'),
      redirect: '/school/index',
      children: [
        {
          path: 'index',
          name: 'index',
          component: IndexView,
        },
        {
          path: 'notice',
          name: 'notice',
          component: () => import('@/views/user/NoticeView.vue'),
        },
        {
          path: 'socials',
          name: 'socials',
          component: () => import('@/views/user/MakeFriend.vue'),
        },
        {
          path: 'personal',
          name: 'personal',
          component: () => import('@/views/user/Personal.vue'),
        },
        {
          path: 'sets',
          name: 'sets',
          component: () => import('@/views/set/Sets.vue'),
        },
      ],
    },
    {
      path: '/comment',
      name: 'comment',
      component: () => import('@/views/comment/CommentView.vue'),
      redirect: '/comment/detail',
      children: [
        {
          path: 'detail',
          name: 'detail',
          component: () => import('@/components/Comment/DetailView.vue'),
        },
        {
          path: 'publish',
          name: 'publish',
          component: () => import('@/components/Comment/PublishView.vue'),
        },
      ],
    },

    {
      path: '/sign',
      name: 'sign',
      component: () => import('@/views/sign/SignView.vue'),
      redirect: '/sign/regist',
      children: [
        {
          path: 'regist',
          name: 'regist',
          component: () => import('@/components/RegistView.vue'),
        },
        {
          path: 'login',
          name: 'login',
          component: () => import('@/components/LoginView.vue'),
        },
      ],
    },
  ],
})

router.beforeEach((to, from) => {
  if (to.fullPath === '/admin' || to.fullPath === '/admin/index') {
    return true
  } else if (to.fullPath === '/sign/login' || to.fullPath === '/sign/regist') {
    return true
  } else if (localStorage.getItem('token') && store.state.userinfo.susername) {
    // 判断token是否有效
    return true
  } else {
    ElMessage.error('请先登录！')
    return { name: 'login' }
  }
})

export default router
