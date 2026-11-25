import { defineStore } from 'pinia'
import { useAuth } from './auth'

const key = () => `fono:data:${useAuth().user?.id}`
const empty = () => ({ patients: [], sessions: [], appointments: [] })

export const useClinic = defineStore('clinic', {
  state: () => empty(),
  getters: {
    patientName: (s) => (id) => s.patients.find((p) => p.id === id)?.name ?? 'Paciente removido',
    sessionsOf: (s) => (id) => s.sessions.filter((x) => x.patientId === id).sort((a, b) => a.date.localeCompare(b.date))
  },
  actions: {
    load() { Object.assign(this, empty(), JSON.parse(localStorage.getItem(key()) || 'null') || {}) },
    save() {
      const { patients, sessions, appointments } = this
      localStorage.setItem(key(), JSON.stringify({ patients, sessions, appointments }))
    },
    add(list, item) { const o = { id: crypto.randomUUID(), ...item }; this[list].push(o); this.save(); return o },
    update(list, id, patch) { Object.assign(this[list].find((x) => x.id === id), patch); this.save() },
    remove(list, id) {
      this[list] = this[list].filter((x) => x.id !== id)
      if (list === 'patients') {
        this.sessions = this.sessions.filter((s) => s.patientId !== id)
        this.appointments = this.appointments.filter((a) => a.patientId !== id)
      }
      this.save()
    },
    exportJson() { return JSON.stringify({ patients: this.patients, sessions: this.sessions, appointments: this.appointments }, null, 2) },
    importJson(text) {
      const d = JSON.parse(text)
      Object.assign(this, empty(), { patients: d.patients || [], sessions: d.sessions || [], appointments: d.appointments || [] })
      this.save()
    }
  }
})
