<script setup>
import { computed, ref } from 'vue'
import { useClinic } from '../stores/clinic'

const clinic = useClinic()
const banco = {
  'Sons /p/ e /b/': [['🦆', 'pato'], ['⚽', 'bola'], ['👶', 'bebê'], ['🦶', 'pé'], ['🐷', 'porco']],
  'Som /r/': [['🐀', 'rato'], ['🌹', 'rosa'], ['🚗', 'carro'], ['🐰', 'coelho'], ['🪞', 'espelho']],
  'Som /l/': [['🌙', 'lua'], ['🦁', 'leão'], ['🍋', 'limão'], ['🪔', 'lâmpada'], ['📚', 'livro']],
  'Sons /s/ e /z/': [['🐸', 'sapo'], ['☀️', 'sol'], ['👟', 'sapato'], ['🦓', 'zebra'], ['🏺', 'vaso']],
  'Sons /f/ e /v/': [['🦭', 'foca'], ['🐄', 'vaca'], ['🔥', 'fogo'], ['🍇', 'uva'], ['🪟', 'vidro']],
  'Encontros consonantais': [['💪', 'braço'], ['🍽️', 'prato'], ['🌴', 'palmeira'], ['🪙', 'cruz'], ['🧊', 'gelo']]
}
const tema = ref(''); const i = ref(0); const acertos = ref(0); const fim = ref(false); const paciente = ref(''); const salvo = ref(false)
const lista = computed(() => banco[tema.value] || [])
const atual = computed(() => lista.value[i.value])

function iniciar(t) { tema.value = t; i.value = 0; acertos.value = 0; fim.value = false; salvo.value = false }
function ouvir() {
  if (!('speechSynthesis' in window)) return alert('Seu navegador não tem síntese de voz. Fale a palavra em voz alta.')
  const u = new SpeechSynthesisUtterance(atual.value[1]); u.lang = 'pt-BR'; u.rate = 0.8
  speechSynthesis.cancel(); speechSynthesis.speak(u)
}
function responder(acertou) {
  if (acertou) acertos.value++
  if (i.value + 1 >= lista.value.length) fim.value = true; else i.value++
}
function salvar() {
  clinic.add('sessions', {
    patientId: paciente.value, date: new Date().toISOString().slice(0, 10),
    goal: `Jogo de repetição: ${tema.value}`, activities: `${acertos.value} de ${lista.value.length} palavras repetidas corretamente`,
    notes: '', score: Math.round((acertos.value / lista.value.length) * 10)
  })
  salvo.value = true
}
</script>

<template>
  <h2>Exercícios e jogos</h2>
  <div v-if="!tema" class="card">
    <h3>Repita a palavra</h3>
    <p class="muted">A figura aparece, o app fala a palavra e o paciente repete. A fonoaudióloga marca o resultado.</p>
    <div class="row"><button v-for="(_, t) in banco" :key="t" @click="iniciar(t)">{{ t }}</button></div>
  </div>

  <div v-else-if="!fim" class="card flash">
    <div class="bar"><i :style="{ width: (i / lista.length) * 100 + '%' }"></i></div>
    <div class="fig" aria-hidden="true">{{ atual[0] }}</div>
    <div class="word">{{ atual[1] }}</div>
    <div class="row" style="justify-content:center">
      <button class="sun" @click="ouvir">Ouvir a palavra</button>
      <button @click="responder(true)">Repetiu certo</button>
      <button class="ghost" style="color:var(--ink)" @click="responder(false)">Tentar depois</button>
    </div>
    <p class="muted">{{ tema }} · figura {{ i + 1 }} de {{ lista.length }}</p>
  </div>

  <div v-else class="card flash">
    <h3>{{ acertos }} de {{ lista.length }} palavras repetidas corretamente</h3>
    <div v-if="clinic.patients.length && !salvo" class="row" style="justify-content:center">
      <select v-model="paciente" aria-label="Paciente"><option value="" disabled>Salvar no histórico de…</option><option v-for="p in clinic.patients" :key="p.id" :value="p.id">{{ p.name }}</option></select>
      <button :disabled="!paciente" @click="salvar">Salvar como sessão</button>
    </div>
    <p v-if="salvo" class="ok">Resultado salvo no histórico do paciente.</p>
    <button class="ghost" style="color:var(--ink)" @click="tema = ''">Escolher outro tema</button>
  </div>
</template>
