// src/stores/themeStore.ts
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { getAuth } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '@/infrastructure/firebase/firebaseConfig'

export const useThemeStore = defineStore('theme', () => {
  const isDarkTheme = ref(false)
  // Загрузка из localStorage при инициализации
  const storedTheme = localStorage.getItem('darkTheme')
  if (storedTheme !== null) {
    isDarkTheme.value = storedTheme === 'true'
  }

  // Следим за изменениями и обновляем атрибут, localStorage и Firebase
  watch(
    isDarkTheme,
    (newVal) => {
      document.documentElement.setAttribute('data-bs-theme', newVal ? 'dark' : 'light')
      localStorage.setItem('darkTheme', newVal.toString())
      saveThemeToFirebase(newVal)
    },
    { immediate: true }
  )

  function toggleTheme() {
    isDarkTheme.value = !isDarkTheme.value
  }

  async function loadThemeFromFirebase() {
    const auth = getAuth()
    const user = auth.currentUser
    if (user) {
      const prefDoc = doc(db, 'preferences', user.uid)
      const snap = await getDoc(prefDoc)
      if (snap.exists()) {
        const data = snap.data()
        if (typeof data.darkTheme === 'boolean') {
          isDarkTheme.value = data.darkTheme
        }
      }
    }
  }

  async function saveThemeToFirebase(theme: boolean) {
    const auth = getAuth()
    const user = auth.currentUser
    if (user) {
      const prefDoc = doc(db, 'preferences', user.uid)
      await setDoc(prefDoc, { darkTheme: theme }, { merge: true })
    }
  }

  return {
    isDarkTheme,
    toggleTheme,
    loadThemeFromFirebase
  }
})
