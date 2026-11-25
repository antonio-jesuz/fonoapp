<script setup>
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useClinic } from '../stores/clinic'

const clinic = useClinic(); const router = useRouter()
const q = ref(''); const open = ref(false)
const f = reactive({ name: '', birth: '', guardian: '', phone: '', complaint: '' })
const lista = computed(() => clinic.patients.filter((p) => p.name.toLowerCase().includes(q.value.toLowerCase())).sort((a, b) => a.name.localeCompare(b.name)))

function salvar() {
  const p = clinic.add('patients', { ...f, active: true, anamnese: {} })
  Object.assign(f, { name: '', birth: '', guardian: '', phone: '', complaint: '' })
  open.value = false
  router.push(`/pacientes/${p.id}`)
}
function remover(p) { if (confirm(`Excluir ${p.name} e todo o histórico? Esta ação não pode ser desfeita.`)) clinic.remove('patients', p.id) }
</script>

<template>
  <div class="row" style="justify-content:space-between"><h2>Pacientes</h2><button @click="open = !open">{{ open ? 'Fechar' : 'Novo paciente' }}</button></div>
  <form v-if="open" class="card" @submit.prevent="salvar">
    <div class="cols">
      <label>Nome<input v-model="f.name" required /></label>
      <label>Data de nascimento<input v-model="f.birth" type="date" required /></label>
      <label>Responsável<input v-model="f.guardian" /></label>
      <label>Telefone<input v-model="f.phone" type="tel" /></label>
    </div>
    <label>Queixa principal<textarea v-model="f.complaint"></textarea></label>
    <button type="submit">Salvar paciente</button>
  </form>
  <label class="noprint">Buscar por nome<input v-model="q" type="search" /></label>
  <div class="card">
    <p v-if="!lista.length" class="muted">Nenhum paciente encontrado.</p>
    <ul class="list">
      <li v-for="p in lista" :key="p.id">
        <RouterLink :to="`/pacientes/${p.id}`"><strong>{{ p.name }}</strong></RouterLink>
        <span class="muted">{{ p.complaint }}</span>
        <span class="badge" :class="p.active === false ? 'off' : 'on'">{{ p.active === false ? 'alta/pausa' : 'em atendimento' }}</span>
        <button class="danger" @click="remover(p)">Excluir</button>
      </li>
    </ul>
  </div>
</template>
