import Vue from 'vue'
import Router from 'vue-router'
import Overview from './Overview'
import Registration from './Registration'
import Login from './Login'
import LostPassword from './LostPassword'
import ResetPassword from './ResetPassword'
import TaskAdd from './TaskAdd'
import TaskOne from './TaskOne'
import Settings from './Settings'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Overview',
      component: Overview,
      meta: {
        requires_auth: true
      }
    },
    {
      path: '/registration',
      name: 'Registration',
      component: Registration
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/lost-password',
      name: 'Lost Password',
      component: LostPassword
    },
    {
      path: '/reset-password/:id',
      name: 'Reset password',
      component: ResetPassword
    },
    {
      path: '/task/add',
      name: 'Add a task',
      component: TaskAdd,
      meta: {
        requires_auth: true
      }
    },
    {
      path: '/task/one/:task_id',
      name: 'Task one',
      component: TaskOne,
      meta: {
        requires_auth: true
      }
    },
    {
      path: '/task/one/:task_id/:message_id',
      name: 'Task one',
      component: TaskOne,
      meta: {
        requires_auth: true
      }
    },
    {
      path: '/settings',
      name: 'Settings',
      component: Settings,
      meta: {
        requires_auth: true
      }
    }
  ]
})
