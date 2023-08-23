import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDTXn0Xhw0UFY0WmnOM3F7nGkqh-2Rb3oU',
  authDomain: 'dev-3dstreet.firebaseapp.com',
  projectId: 'dev-3dstreet',
  storageBucket: 'dev-3dstreet.appspot.com',
  messagingSenderId: '35938260968',
  appId: '1:35938260968:web:ff479731a6603f73b6f65d',
  measurementId: 'G-YF8EXV88Z0'
};

// const firebaseConfig = {
//   apiKey: '',
//   authDomain: '',
//   projectId: '',
//   storageBucket: '',
//   messagingSenderId: '',
//   appId: '',
//   measurementId: ''
// };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);

export { auth, storage, db };
