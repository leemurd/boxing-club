import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '@/infrastructure/firebase/firebaseConfig'
import { getUserId } from '@/presentation/utils/getUserId'

export const useThemeStore = defineStore('theme', () => {
  const isDarkTheme = ref(false)

  // Попытка загрузить из Firebase сразу при старте
  loadThemeFromFirebase()

  // Инициализация из localStorage или системных настроек
  const stored = localStorage.getItem('darkTheme')
  if (stored !== null) {
    // Ресторе из localStorage (приоритет)
    isDarkTheme.value = stored === 'true'
  } else {
    // Инициализация на основе системной схемы
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)')
    applyTheme(prefersDark.matches)
    isDarkTheme.value = prefersDark.matches
    // Слушаем изменения системной схемы
    prefersDark.addEventListener('change', ({ matches }) => {
      isDarkTheme.value = matches
    })
  }

  // Apply CSS-классы и синхронизация при любом изменении
  watch(
    isDarkTheme,
    (newVal) => {
      applyTheme(newVal)
      localStorage.setItem('darkTheme', String(newVal))
      // bootstrap
      saveThemeToFirebase(newVal)
    },
    { immediate: true }
  )

  function applyTheme(dark: boolean) {
    // ionic
    document.body.classList.toggle('dark', dark)
    document.documentElement.classList.toggle('ion-palette-dark', dark)
    // bootstrap
    document.documentElement.setAttribute('data-bs-theme', dark ? 'dark' : 'light')
  }

  function toggleTheme() {
    isDarkTheme.value = !isDarkTheme.value
  }

  async function loadThemeFromFirebase() {
    const userId = await getUserId()
    const userDoc = doc(db, 'users', userId)
    const snap = await getDoc(userDoc)
    if (!snap.exists()) return
    const prefs = snap.data().preferences
    if (prefs?.darkTheme != null) {
      isDarkTheme.value = prefs.darkTheme
    }
  }

  async function saveThemeToFirebase(theme: boolean) {
    const userId = await getUserId()
    const userDoc = doc(db, 'users', userId)
    await setDoc(userDoc, { preferences: { darkTheme: theme } }, { merge: true })
  }

  return {
    isDarkTheme,
    toggleTheme,
    loadThemeFromFirebase
  }
})
