import { createRouter, createWebHistory } from 'vue-router'
import { userActive } from '../clients/supabase'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("@/views/Home.vue"),
    },
    {
      path: "/NotFound",
      name: "NotFound",
      component: () => import("@/views/NotFound.vue"),
    },
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/Login.vue"),
      meta: { requiresAuth: false }
    },
    {
      path: "/register",
      name: "register",
      component: () => import("@/views/Register.vue"),
      meta: { requiresAuth: false }
    },
    {
      path: "/policies",
      name: "policies",
      component: () => import("@/views/Policies.vue"),
    },
    {
      path: "/account",
      name: "account",
      component: () => import("@/views/Account.vue"),
      meta: { requiresAuth: true }
    },
    {
      path: "/search",
      name: "search",
      component: () => import("@/views/Search.vue"),
      meta: { requiresAuth: true }
    },
    {
      path: "/waiting-verification",
      name: "waiting-verification",
      component: () => import("@/views/Verification.vue"),
      meta: { requiresAuth: false }
    },
    {
      path: "/profile",
      name: "profile",
      component: () => import("@/views/Profile.vue"),
      meta: { requiresAuth: true },
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
      component: () => import("@/views/Post.vue"),
      meta: { requiresAuth: true }
    },
    /*Ruta comodín para manejar rutas no encontradas*/
    {
      path: "/:catchAll(.*)",
      redirect: "/NotFound",
    },
  ],
});
/*Antes de redirrigir a una ruta, comprobamos si el usuario puede acceder a dicha ruta y si existe.*/
router.beforeEach(async (to, from, next) => {
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    const userToken = userActive.value;
    if (requiresAuth && !userToken) {
      next({ name: 'login' });
    } else if (!requiresAuth && userToken && (to.name === 'login' || to.name === 'register')) {
      next({ name: 'home' });
    } else {
      next();
    }
  });

export default router;
