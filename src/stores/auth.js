import { defineStore } from 'pinia'

const USERS = 'fono:users'
const SESSION = 'fono:session'
const read = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d } catch { return d } }

async function hash(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

export const useAuth = defineStore('auth', {
  state: () => ({ user: read(SESSION, null) }),
  getters: { logged: (s) => !!s.user },
  actions: {
    async register({ name, email, crfa, clinicName = '', password }) {
      const users = read(USERS, [])
      email = email.trim().toLowerCase()
      if (users.some((u) => u.email === email)) throw new Error('Este e-mail já está cadastrado.')
      const u = { id: crypto.randomUUID(), name: name.trim(), email, crfa: crfa.trim(), clinic: { name: clinicName.trim(), phone: '', address: '' }, pass: await hash(password) }
      localStorage.setItem(USERS, JSON.stringify([...users, u]))
      this.start(u)
    },
    async login(email, password) {
      const u = read(USERS, []).find((x) => x.email === email.trim().toLowerCase())
      if (!u || u.pass !== (await hash(password))) throw new Error('E-mail ou senha incorretos.')
      this.start(u)
    },
    start(u) {
      this.user = { id: u.id, name: u.name, email: u.email, crfa: u.crfa, clinic: u.clinic || {} }
      localStorage.setItem(SESSION, JSON.stringify(this.user))
    },
    updateProfile({ name, crfa, clinic }) {
      const users = read(USERS, []).map((u) => (u.id === this.user.id ? { ...u, name, crfa, clinic } : u))
      localStorage.setItem(USERS, JSON.stringify(users))
      this.user = { ...this.user, name, crfa, clinic }
      localStorage.setItem(SESSION, JSON.stringify(this.user))
    },
    logout() { this.user = null; localStorage.removeItem(SESSION) }
  }
})
