<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../stores/auth'
import Therapist from '../components/Therapist.vue'

const auth = useAuth(); const router = useRouter()
const f = reactive({ name: '', email: '', crfa: '', clinicName: '', password: '', confirm: '' })
const error = ref('')
async function criar() {
  error.value = ''
  if (f.password.length < 8) return (error.value = 'A senha precisa ter pelo menos 8 caracteres.')
  if (f.password !== f.confirm) return (error.value = 'As senhas não conferem.')
  try { await auth.register(f); router.push('/') } catch (e) { error.value = e.message }
}
</script>

<template>
  <div class="auth">
    <section class="auth-hero">
      <h1>Bem-vinda ao FonoApp</h1>
      <p>Crie seu acesso e comece a registrar pacientes, sessões e a evolução de cada um.</p>
      <Therapist class="art" />
    </section>
    <section class="auth-form">
      <form class="card" @submit.prevent="criar">
        <h2>Cadastrar fonoaudióloga</h2>
        <p v-if="error" class="err" role="alert">{{ error }}</p>
        <label>Nome completo<input v-model="f.name" required /></label>
        <label>E-mail<input v-model="f.email" type="email" required /></label>
        <label>Número do CRFa<input v-model="f.crfa" placeholder="Ex.: 2-12345" /></label>
        <label>Nome da clínica<input v-model="f.clinicName" placeholder="Ex.: Clínica Fala Viva" /></label>
        <label>Senha<input v-model="f.password" type="password" autocomplete="new-password" required /></label>
        <label>Confirmar senha<input v-model="f.confirm" type="password" autocomplete="new-password" required /></label>
        <button type="submit">Criar acesso</button>
        <p>Já tem acesso? <RouterLink to="/login">Entrar</RouterLink></p>
      </form>
    </section>
  </div>
</template>
