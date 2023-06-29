import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDJiCG7Ua4OKt-e2EtUPdVzLb5wm0rOLFw',
  authDomain: '3dstreet.app',
  projectId: 'dstreet-305604',
  storageBucket: 'dstreet-305604.appspot.com',
  messagingSenderId: '568813074454',
  appId: '1:568813074454:web:41ec82e30413603c771d37',
  measurementId: 'G-T65XPDLZ3F'
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
