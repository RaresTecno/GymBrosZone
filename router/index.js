import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Home.vue'
import ProfileView from '../views/Profile.vue'
import Log from '../views/Log.vue'
import Login from '../components/Login.vue';
import Register from '../components/Register.vue';
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
      path: '/profile',
      name: 'profile',
      component: ProfileView
    },
    {
      path: '/log/', 
      component: Log,
      children: [
        {
          path: 'login', 
          component: Login
        },
        {
          path: 'register',
          component: Register
        }
      ]
    }
    // {
    //   path: '/politicas_y_condiciones',
    //   name: 'politicas_y_condiciones',
    //   component: Politicas_y_condiciones
    // }
  ]
})

export default router
