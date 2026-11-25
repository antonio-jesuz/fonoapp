<script setup>
import { computed, reactive, ref } from 'vue'
import { useClinic } from '../stores/clinic'
import { useAuth } from '../stores/auth'

const props = defineProps({ id: String })
const clinic = useClinic(); const auth = useAuth()
const p = computed(() => clinic.patients.find((x) => x.id === props.id))
const tab = ref('anamnese')
const sessoes = computed(() => clinic.sessionsOf(props.id))
const s = reactive({ date: new Date().toISOString().slice(0, 10), goal: '', activities: '', notes: '', score: 5 })
const campos = [
  ['gestacao', 'Gestação, parto e desenvolvimento'], ['audicao', 'Audição'],
  ['alimentacao', 'Alimentação e mastigação'], ['linguagem', 'Linguagem e fala (história)'],
  ['escola', 'Escola e convívio'], ['objetivos', 'Objetivos terapêuticos']
]
const idade = computed(() => {
  if (!p.value?.birth) return ''
  const m = Math.floor((Date.now() - new Date(p.value.birth)) / 2629800000)
  return m >= 24 ? `${Math.floor(m / 12)} anos` : `${m} meses`
})
function setAnamnese(k, v) { clinic.update('patients', props.id, { anamnese: { ...p.value.anamnese, [k]: v } }) }
function addSessao() {
  clinic.add('sessions', { patientId: props.id, ...s, score: Number(s.score) })
  Object.assign(s, { goal: '', activities: '', notes: '', score: 5 })
}
function imprimir() { window.print() }
const pontos = computed(() => {
  const n = sessoes.value.length
  return sessoes.value.map((x, i) => `${n === 1 ? 150 : 20 + (i * 260) / (n - 1)},${110 - x.score * 10}`).join(' ')
})
</script>

<template>
  <p v-if="!p">Paciente não encontrado. <RouterLink to="/pacientes">Voltar</RouterLink></p>
  <template v-else>
    <div class="card">
      <h2>{{ p.name }}</h2>
      <p class="muted">{{ idade }} · Responsável: {{ p.guardian || '—' }} · {{ p.phone || 'sem telefone' }}</p>
      <p>{{ p.complaint }}</p>
      <label class="row"><input type="checkbox" style="width:auto;margin:0" :checked="p.active !== false" @change="clinic.update('patients', id, { active: $event.target.checked })" /> Em atendimento</label>
    </div>
    <div class="tabs noprint">
      <button :class="{ on: tab === 'anamnese' }" @click="tab = 'anamnese'">Anamnese</button>
      <button :class="{ on: tab === 'sessoes' }" @click="tab = 'sessoes'">Sessões</button>
      <button :class="{ on: tab === 'evolucao' }" @click="tab = 'evolucao'">Evolução e relatório</button>
    </div>

    <div v-if="tab === 'anamnese'" class="card">
      <label v-for="[k, rotulo] in campos" :key="k">{{ rotulo }}
        <textarea :value="p.anamnese?.[k]" @change="setAnamnese(k, $event.target.value)"></textarea>
      </label>
      <small class="muted">As alterações são salvas ao sair do campo.</small>
    </div>

    <div v-if="tab === 'sessoes'">
      <form class="card" @submit.prevent="addSessao">
        <div class="cols">
          <label>Data<input v-model="s.date" type="date" required /></label>
          <label>Objetivo da sessão<input v-model="s.goal" required /></label>
          <label>Desempenho (0 a 10)<input v-model="s.score" type="number" min="0" max="10" required /></label>
        </div>
        <label>Atividades realizadas<textarea v-model="s.activities"></textarea></label>
        <label>Observações e orientações à família<textarea v-model="s.notes"></textarea></label>
        <button type="submit">Registrar sessão</button>
      </form>
      <div class="card">
        <p v-if="!sessoes.length" class="muted">Nenhuma sessão registrada.</p>
        <ul class="list">
          <li v-for="x in [...sessoes].reverse()" :key="x.id">
            <span><strong>{{ x.date }}</strong> · {{ x.goal }} · nota {{ x.score }}/10<br /><small class="muted">{{ x.activities }} {{ x.notes }}</small></span>
            <button class="danger" @click="clinic.remove('sessions', x.id)">Excluir</button>
          </li>
        </ul>
      </div>
    </div>

    <div v-if="tab === 'evolucao'" class="card">
      <div class="report-head">
        <div><strong>{{ auth.user.clinic?.name || 'Clínica de Fonoaudiologia' }}</strong><br /><small class="muted">{{ auth.user.clinic?.address }} {{ auth.user.clinic?.phone }}</small></div>
        <div style="text-align:right"><h3 style="margin:0">Relatório de evolução</h3><small class="muted">Emitido em {{ new Date().toLocaleDateString('pt-BR') }}</small></div>
      </div>
      <p><strong>Paciente:</strong> {{ p.name }} ({{ idade }}) · <strong>Sessões:</strong> {{ sessoes.length }}</p>
      <p v-if="!sessoes.length" class="muted">Registre sessões para ver o gráfico.</p>
      <svg v-else viewBox="0 0 300 120" role="img" aria-label="Gráfico de desempenho por sessão" style="width:100%;max-width:520px">
        <line x1="20" y1="10" x2="20" y2="110" stroke="#d5e2e4" /><line x1="20" y1="110" x2="290" y2="110" stroke="#d5e2e4" />
        <polyline :points="pontos" fill="none" stroke="#2f8f9d" stroke-width="2.5" />
        <circle v-for="(pt, i) in pontos.split(' ')" :key="i" :cx="pt.split(',')[0]" :cy="pt.split(',')[1]" r="3.5" fill="#f2b84b" />
      </svg>
      <ul class="list"><li v-for="x in sessoes" :key="x.id"><span>{{ x.date }} · {{ x.goal }}</span><span>{{ x.score }}/10</span></li></ul>
      <div class="sign">{{ auth.user.name }}<br />Fonoaudióloga<span v-if="auth.user.crfa"> · CRFa {{ auth.user.crfa }}</span></div>
      <button class="noprint" style="margin-top:1rem" @click="imprimir">Imprimir ou salvar em PDF</button>
    </div>
  </template>
</template>
