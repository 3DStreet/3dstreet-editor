import { createContext, useContext, useEffect, useState } from 'react';
import {
  createInitialUsersCollection,
  getUserByQuery,
  userFindByUidQuery
} from '../api';
import { auth } from '../services/firebase';
import PropTypes from 'prop-types';
import { isUserPremium } from '../api/user';

const AuthContext = createContext({
  currentUser: null,
  setCurrentUser: (user) => {}
});

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (!user) {
        localStorage.removeItem('token');
      } else {
        const isPremium = await isUserPremium(user);
        setCurrentUser({ ...user, isPremium });

        localStorage.setItem('token', await user.getIdToken());

        try {
          const users = await getUserByQuery(userFindByUidQuery(user.uid));

          if (users.empty) {
            await createInitialUsersCollection(user.uid);
          }
        } catch (error) {
          console.log(error);
        }
      }
    });
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

const useAuthContext = () => useContext(AuthContext);

export { AuthProvider, useAuthContext };
