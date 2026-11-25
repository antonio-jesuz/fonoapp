<script setup>
import { reactive, ref } from 'vue'
import { useAuth } from '../stores/auth'
import { useClinic } from '../stores/clinic'

const auth = useAuth(); const clinic = useClinic()
const c = auth.user.clinic || {}
const f = reactive({ name: auth.user.name, crfa: auth.user.crfa, clinicName: c.name || '', phone: c.phone || '', address: c.address || '' })
const msg = ref('')
function salvar() {
  auth.updateProfile({ name: f.name, crfa: f.crfa, clinic: { name: f.clinicName, phone: f.phone, address: f.address } })
  msg.value = 'Dados salvos.'
}
function exportar() {
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([clinic.exportJson()], { type: 'application/json' }))
  a.download = `fonoapp-backup-${new Date().toISOString().slice(0, 10)}.json`; a.click()
}
async function importar(e) {
  const file = e.target.files[0]; if (!file) return
  try { clinic.importJson(await file.text()); msg.value = 'Backup restaurado.' } catch { msg.value = 'Arquivo inválido.' }
}
</script>

<template>
  <h2>Clínica e perfil</h2>
  <form class="card" @submit.prevent="salvar">
    <h3>Dados da clínica</h3>
    <p class="muted">Aparecem no menu e no cabeçalho dos relatórios impressos.</p>
    <div class="cols">
      <label>Nome da clínica<input v-model="f.clinicName" /></label>
      <label>Telefone<input v-model="f.phone" type="tel" /></label>
    </div>
    <label>Endereço<input v-model="f.address" /></label>
    <h3>Profissional</h3>
    <div class="cols">
      <label>Nome<input v-model="f.name" required /></label>
      <label>CRFa<input v-model="f.crfa" /></label>
    </div>
    <button type="submit">Salvar dados</button>
  </form>
  <div class="card">
    <h3>Backup dos dados</h3>
    <p class="muted">Os dados ficam apenas neste navegador. Exporte um backup com frequência.</p>
    <div class="row"><button @click="exportar">Exportar backup</button><label class="row" style="margin:0">Restaurar backup<input type="file" accept="application/json" @change="importar" /></label></div>
  </div>
  <p v-if="msg" class="ok" role="status">{{ msg }}</p>
</template>
