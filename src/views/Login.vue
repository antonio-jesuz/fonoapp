<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../stores/auth'
import Therapist from '../components/Therapist.vue'
import Logo from '../components/Logo.vue'

const auth = useAuth(); const router = useRouter()
const email = ref(''); const password = ref(''); const error = ref('')
async function entrar() {
  error.value = ''
  try { await auth.login(email.value, password.value); router.push('/') } catch (e) { error.value = e.message }
}
</script>

<template>
  <div class="auth">
    <section class="auth-hero">
      <div class="row"><Logo /><strong style="font-size:1.3rem">FonoApp</strong></div>
      <h1>Cuidar da comunicação, uma sessão de cada vez.</h1>
      <p>Prontuário, agenda e exercícios de fala para o atendimento da sua clínica.</p>
      <div class="waves" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>
      <Therapist class="art" />
    </section>
    <section class="auth-form">
      <form class="card" @submit.prevent="entrar">
        <h2>Acesso da equipe</h2>
        <p v-if="error" class="err" role="alert">{{ error }}</p>
        <label>E-mail<input v-model="email" type="email" autocomplete="email" required /></label>
        <label>Senha<input v-model="password" type="password" autocomplete="current-password" required /></label>
        <button type="submit">Entrar</button>
        <p>Primeiro acesso? <RouterLink to="/cadastro">Cadastrar fonoaudióloga</RouterLink></p>
      </form>
    </section>
  </div>
</template>
