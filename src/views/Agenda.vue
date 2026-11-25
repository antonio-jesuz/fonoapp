<script setup>
import { computed, reactive } from 'vue'
import { useClinic } from '../stores/clinic'

const clinic = useClinic()
const tipos = ['Avaliação inicial', 'Terapia', 'Retorno', 'Orientação à família']
const f = reactive({ patientId: '', when: '', tipo: 'Terapia', notes: '' })
const lista = computed(() => [...clinic.appointments].sort((a, b) => a.when.localeCompare(b.when)))
const fmt = (w) => new Date(w).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
function agendar() { clinic.add('appointments', { ...f, status: 'agendada' }); f.when = ''; f.notes = '' }
</script>

<template>
  <h2>Agenda da clínica</h2>
  <p v-if="!clinic.patients.length" class="card muted">Cadastre um paciente antes de agendar. <RouterLink to="/pacientes">Ir para pacientes</RouterLink></p>
  <form v-else class="card" @submit.prevent="agendar">
    <div class="cols">
      <label>Paciente<select v-model="f.patientId" required><option value="" disabled>Selecione</option><option v-for="p in clinic.patients" :key="p.id" :value="p.id">{{ p.name }}</option></select></label>
      <label>Data e hora<input v-model="f.when" type="datetime-local" required /></label>
      <label>Tipo de atendimento<select v-model="f.tipo"><option v-for="t in tipos" :key="t">{{ t }}</option></select></label>
      <label>Observação<input v-model="f.notes" /></label>
    </div>
    <button type="submit">Agendar consulta</button>
  </form>
  <div class="card">
    <p v-if="!lista.length" class="muted">Nenhuma consulta agendada.</p>
    <ul class="list">
      <li v-for="a in lista" :key="a.id">
        <span><strong>{{ fmt(a.when) }}</strong> · {{ clinic.patientName(a.patientId) }} <span class="badge" :class="a.status">{{ a.status }}</span><br /><small class="muted">{{ a.tipo }} {{ a.notes }}</small></span>
        <span class="row">
          <select :value="a.status" @change="clinic.update('appointments', a.id, { status: $event.target.value })" aria-label="Status">
            <option>agendada</option><option>realizada</option><option>faltou</option><option>cancelada</option>
          </select>
          <button class="danger" @click="clinic.remove('appointments', a.id)">Excluir</button>
        </span>
      </li>
    </ul>
  </div>
</template>
