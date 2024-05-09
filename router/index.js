import { createRouter, createWebHistory } from 'vue-router'

// import Politicas_y_condiciones from '../views/Politicas_y_condiciones.vue'

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
      path: "/politicas-y-condiciones",
      name: "politicas-y-condiciones",
      component: () => import("@/views/Politicas_y_condiciones.vue"),
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
      path: "/tabla",
      name: "tabla",
      component: () => import("@/components/Tabla.vue"),
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

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const usuarioActivo = localStorage.getItem('sb-subcejpmaueqsiypcyzt-auth-token');

  if (to.name === 'home' && usuarioActivo) {
    return next();
  }

  if (!requiresAuth && usuarioActivo) {
    next({ name: 'home' });
  } else if (!requiresAuth && !usuarioActivo) {
    next();
  } else if (requiresAuth && !usuarioActivo) {
    next({ name: 'login' });
  } else {
    next();
  }
});

export default router;
