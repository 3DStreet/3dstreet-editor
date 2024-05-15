import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../services/firebase';

const getScenes = () => {
  return query(collection(db, 'scenes'));
};

const userFindByUidQuery = (uid) => {
  return query(collection(db, 'author'), where('author', '==', uid));
};

const getUserByQuery = async (query) => {
  return await getDocs(query);
};

const createInitialUsersCollection = async (author) => {
  await addDoc(collection(db, 'scenes'), {
    author,
    data
  });
};

const isUserPro = async (user) => {
  if (user) {
    try {
      await user.getIdToken(true);
      const idTokenResult = await user.getIdTokenResult();
      if (idTokenResult.claims.plan === "PRO") {
        console.log("PRO PLAN USER");
        return true;
      } else {
        console.log("FREE PLAN USER");
        return false;
      }
    } catch (error) {
      console.error("Error checking PRO plan:", error);
      return false;
    }
  } else {
    console.log('refreshIdTokens: currentUser not set');
    return false;
  }
};

const isUserBeta = async (user) => {
  if (user) {
    try {
      await user.getIdToken(true);
      const idTokenResult = await user.getIdTokenResult();
      if (idTokenResult.claims.beta) {
        console.log("BETA USER");
        return true;
      } else {
        console.log("NOT BETA USER");
        return false;
      }
    } catch (error) {
      console.error("Error checking BETA status:", error);
      return false;
    }
  } else {
    console.log('refreshIdTokens: currentUser not set');
    return false;
  }
};

export {
  userFindByUidQuery,
  getUserByQuery,
  createInitialUsersCollection,
  getScenes,
  isUserPro,
  isUserBeta
};
