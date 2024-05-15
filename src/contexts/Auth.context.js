import { createContext, useContext, useEffect, useState } from 'react';
import { createInitialUsersCollection, getUserByQuery, userFindByUidQuery } from '../api';
import { auth } from '../services/firebase';
import PropTypes from 'prop-types';
import { isUserPro, isUserBeta } from '../api/user';

const AuthContext = createContext({
  currentUser: null,
  setCurrentUser: (user) => {}
});

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async (user) => {
      if (!user) {
        localStorage.removeItem('token');
        setCurrentUser(null);
        return;
      }
      
      localStorage.setItem('token', await user.getIdToken());
      
      const isPro = await isUserPro(user);
      const isBeta = await isUserBeta(user);
      const enrichedUser = { ...user, isPro, isBeta };

      setCurrentUser(enrichedUser);

      try {
        const users = await getUserByQuery(userFindByUidQuery(user.uid));

        if (users.empty) {
          await createInitialUsersCollection(user.uid);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      fetchUserData(user);
    });

    return () => unsubscribe();
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
