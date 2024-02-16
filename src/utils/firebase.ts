import { initializeApp } from 'firebase/app'
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
	apiKey: 'AIzaSyDycpTiElMVci8fehzDCB6M2Oh0aM4m7Y8',
	authDomain: 'twitter-clone-88-d8135.firebaseapp.com',
	projectId: 'twitter-clone-88-d8135',
	storageBucket: 'twitter-clone-88-d8135.appspot.com',
	messagingSenderId: '499031689104',
	appId: '1:499031689104:web:8043ae788cdc28e6f2d515',
	measurementId: 'G-LF957BBYJ8',
}

export const app = initializeApp(firebaseConfig)
const auth = getAuth()
const googleProvider = new GoogleAuthProvider()

// Google SSO
export const GoogleLogin = async () => {
	const result = await signInWithPopup(auth, googleProvider)
	return result
}

export const firestore = getFirestore(app)
export const storage = getStorage(app)
