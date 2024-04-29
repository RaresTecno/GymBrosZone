import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Home.vue'
import ProfileView from '../views/Profile.vue'
import NotFound from '../views/NotFound.vue'
import Post from '../views/Post.vue';

// import Politicas_y_condiciones from '../views/Politicas_y_condiciones.vue'
import MiCuenta from '../views/Account.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/NotFound",
      name: "NotFound",
      component: NotFound,
    },
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/Login.vue"),
    },
    {
      path: "/register",
      name: "register",
      component: () => import("@/views/Register.vue"),
    },
    {
      path: "/account",
      name: "account",
      component: () => import("@/views/Account.vue"),
    },
    {
      path: "/search",
      name: "search",
      component: () => import("@/views/Search.vue"),
    },
    {
      path: "/tabla",
      name: "tabla",
      component: () => import("@/components/Tabla.vue"),
    },
    {
      path: "/waiting-verification",
      name: "waiting-verification",
      component: () => import("@/views/Verification.vue"),
    },
    {
      path: "/profile",
      name: "profile",
      component: ProfileView,
      children: [
        {
          path: "editProfile",
          name: "editProfile",
          component: () => import("@/components/EditProfile.vue"),
        },
      ],
    },
    {
      path: '/post',
      name: 'post',
      component: Post
    },
    // Ruta comodín para manejar rutas no encontradas
    {
      path: "/:catchAll(.*)",
      redirect: "/NotFound",
    },
    // {
    //   path: '/politicas_y_condiciones',
    //   name: 'politicas_y_condiciones',
    //   component: Politicas_y_condiciones
    // }
  ],
});

export default router;
