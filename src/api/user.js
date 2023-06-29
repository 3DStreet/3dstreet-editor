import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../services/firebase';

const getScenes = () => {
  return query(collection(db, 'users'));
};

const userFindByUidQuery = (uid) => {
  return query(collection(db, 'users'), where('uid', '==', uid));
};

const getUserByQuery = async (query) => {
  return await getDocs(query);
};

const createInitialUsersCollection = async (uid) => {
  await addDoc(collection(db, 'users'), {
    uid,
    scenes: []
  });
};

export {
  userFindByUidQuery,
  getUserByQuery,
  createInitialUsersCollection,
  getScenes
};
