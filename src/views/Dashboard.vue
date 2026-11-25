<script setup>
import { computed } from 'vue'
import { useClinic } from '../stores/clinic'
import { useAuth } from '../stores/auth'
import Therapist from '../components/Therapist.vue'

const clinic = useClinic(); const auth = useAuth()
const hoje = new Date().toISOString().slice(0, 10)
const h = new Date().getHours()
const saudacao = h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite'
const data = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })
const deHoje = computed(() => clinic.appointments.filter((a) => a.when.startsWith(hoje) && a.status !== 'cancelada').sort((a, b) => a.when.localeCompare(b.when)))
const recentes = computed(() => [...clinic.sessions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5))
const ativos = computed(() => clinic.patients.filter((p) => p.active !== false).length)
</script>

<template>
  <section class="hero">
    <div>
      <p style="text-transform:capitalize">{{ data }}</p>
      <h2>{{ saudacao }}, {{ auth.user.name.split(' ')[0] }}</h2>
      <p>{{ deHoje.length ? `Você tem ${deHoje.length} consulta(s) hoje.` : 'Nenhuma consulta marcada para hoje.' }}</p>
      <div class="row"><RouterLink class="btn" to="/agenda">Agendar consulta</RouterLink><RouterLink class="btn alt" to="/pacientes">Novo paciente</RouterLink></div>
    </div>
    <Therapist class="art" />
  </section>
  <div class="grid">
    <div class="card stat"><b>{{ ativos }}</b>pacientes em atendimento</div>
    <div class="card stat"><b>{{ deHoje.length }}</b>consultas hoje</div>
    <div class="card stat"><b>{{ clinic.sessions.length }}</b>sessões registradas</div>
  </div>
  <div class="card">
    <h3>Atendimentos de hoje</h3>
    <p v-if="!deHoje.length" class="muted">Sem atendimentos hoje.</p>
    <ul class="list"><li v-for="a in deHoje" :key="a.id"><span><strong>{{ a.when.slice(11, 16) }}</strong> · {{ clinic.patientName(a.patientId) }} <small class="muted">{{ a.tipo }}</small></span><span class="badge" :class="a.status">{{ a.status }}</span></li></ul>
  </div>
  <div class="card">
    <h3>Últimas sessões</h3>
    <p v-if="!recentes.length" class="muted">Nenhuma sessão ainda. Abra a ficha de um paciente para registrar a primeira.</p>
    <ul class="list"><li v-for="s in recentes" :key="s.id"><RouterLink :to="`/pacientes/${s.patientId}`">{{ clinic.patientName(s.patientId) }}</RouterLink><small>{{ s.date }} · nota {{ s.score }}/10</small></li></ul>
  </div>
</template>
