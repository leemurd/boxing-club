// src/presentation/stores/themeStore.ts
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '@/infrastructure/firebase/firebaseConfig'
import { getUserId } from '@/presentation/utils/getUserId'

export const useThemeStore = defineStore('theme', () => {
  const isDarkTheme = ref(false)

  const stored = localStorage.getItem('darkTheme')
  if (stored !== null) isDarkTheme.value = stored === 'true'

  watch(
    isDarkTheme,
    (newVal) => {
      document.documentElement.setAttribute('data-bs-theme', newVal ? 'dark' : 'light')
      localStorage.setItem('darkTheme', String(newVal))
      saveThemeToFirebase(newVal)
    },
    { immediate: true }
  )

  function toggleTheme() {
    isDarkTheme.value = !isDarkTheme.value
  }

  /** Загружает из users/{userId}.preferences.darkTheme */
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

  /** Сохраняет в users/{userId}.preferences.darkTheme */
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
