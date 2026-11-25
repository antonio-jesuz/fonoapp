<script setup>
import { computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from './stores/auth'
import { useClinic } from './stores/clinic'
import Logo from './components/Logo.vue'

const auth = useAuth(); const clinic = useClinic(); const router = useRouter()
watch(() => auth.user, (u) => { if (u) clinic.load() }, { immediate: true })
const clinicName = computed(() => auth.user?.clinic?.name || 'Clínica de Fonoaudiologia')
function sair() { auth.logout(); router.push('/login') }
const links = [['/', 'Painel'], ['/pacientes', 'Pacientes'], ['/agenda', 'Agenda'], ['/exercicios', 'Exercícios e jogos'], ['/perfil', 'Clínica e perfil']]
</script>

<template>
  <div v-if="auth.logged" class="shell">
    <aside class="side">
      <div class="brandbox"><Logo /><div><strong>FonoApp</strong><small>{{ clinicName }}</small></div></div>
      <nav><RouterLink v-for="[to, label] in links" :key="to" :to="to" exact-active-class="on">{{ label }}</RouterLink></nav>
      <div class="who"><strong>{{ auth.user.name }}</strong><small v-if="auth.user.crfa">Fonoaudióloga · CRFa {{ auth.user.crfa }}</small><button class="ghost" @click="sair">Sair</button></div>
    </aside>
    <main class="main"><RouterView /></main>
  </div>
  <RouterView v-else />
</template>
