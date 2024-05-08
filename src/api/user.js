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
    author
  });
};

const isUserPremium = async (user) => {
  if(user) {
    user.getIdToken(true)
    .then(() => {
      user.getIdTokenResult().then(idTokenResult => {
        if (idTokenResult.claims.plan === "PRO") {
          console.log("PRO PLAN USER")
          return true;
        } else {
          console.log("FREE PLAN USER")
          return false;
        }
      })
    })
  } else {
    console.log('refreshIdTokens : currentUser not set')
  }
  return false;
};

export {
  userFindByUidQuery,
  getUserByQuery,
  createInitialUsersCollection,
  getScenes,
  isUserPremium
};
