import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
// При необходимости импортируйте другие сервисы (firestore, auth, storage и т.д.)

const firebaseConfig = {
  apiKey: "AIzaSyAiu8kdIgxf1INelHF62VIuVJTaFwzIIQM",
  authDomain: "boxing-club-e1de8.firebaseapp.com",
  projectId: "boxing-club-e1de8",
  storageBucket: "boxing-club-e1de8.firebasestorage.app",
  messagingSenderId: "500885425374",
  appId: "1:500885425374:web:16099d38364ccd1974864f",
  measurementId: "G-FP306CTB77"
}

const firebaseApp = initializeApp(firebaseConfig)
const analytics = getAnalytics(firebaseApp)
const db = getFirestore(firebaseApp)
const auth = getAuth(firebaseApp)

export { firebaseApp, db, auth, analytics }
