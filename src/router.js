import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuth } from './stores/auth'

const routes = [
  { path: '/login', component: () => import('./views/Login.vue'), meta: { public: true } },
  { path: '/cadastro', component: () => import('./views/Register.vue'), meta: { public: true } },
  { path: '/', component: () => import('./views/Dashboard.vue') },
  { path: '/pacientes', component: () => import('./views/Patients.vue') },
  { path: '/pacientes/:id', component: () => import('./views/PatientDetail.vue'), props: true },
  { path: '/agenda', component: () => import('./views/Agenda.vue') },
  { path: '/exercicios', component: () => import('./views/Exercises.vue') },
  { path: '/perfil', component: () => import('./views/Profile.vue') },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({ history: createWebHashHistory(), routes })

router.beforeEach((to) => {
  const auth = useAuth()
  if (!to.meta.public && !auth.logged) return '/login'
  if (to.meta.public && auth.logged) return '/'
})

export default router
