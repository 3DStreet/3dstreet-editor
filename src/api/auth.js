import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../services/firebase';

const signIn = async () => {
  try {
    const {
      user: {
        metadata: { creationTime, lastSignInTime }
      }
    } = await signInWithPopup(auth, new GoogleAuthProvider());

    // first signIn to ga
    if (creationTime !== lastSignInTime) return;
    if (typeof ga !== 'undefined') {
      ga('send', 'event', 'Auth', 'newAccountCreation');
    }
  } catch (error) {
    console.error(error);
  }
};

export { signIn };
