import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Home.vue'
import ProfileView from '../views/Profile.vue'
import NotFound from '../views/NotFound.vue'

import Politicas_y_condiciones from '../views/Politicas_y_condiciones.vue'



const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/NotFound',
      name: 'NotFound',
      component: NotFound
    },
    {
      path: '/log', 
      redirect: '/NotFound',
      children: [
        {
          path: 'login',
          name: 'login',
          component: () => import('../components/Login.vue')
        },
        {
          path: 'register',
          name: 'register',
          component: () => import('../components/Register.vue')
        }
      ]
    },
    {
      path: '/account',
      name: 'account',
      component: () => import('../views/Account.vue')
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView
    },
    // Ruta comodín para manejar rutas no encontradas
    {
      path: '/:catchAll(.*)',
      redirect: '/NotFound'
    }
    // {
    //   path: '/politicas_y_condiciones',
    //   name: 'politicas_y_condiciones',
    //   component: Politicas_y_condiciones
    // }
  ]
})

export default router
