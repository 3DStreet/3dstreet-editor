import React from 'react';
import './ProfileButton.styles.styl';

import { Button } from '../Button';
import { Component } from 'react';
import Events from '../../../lib/Events.js';
import { Profile32Icon } from './icons.jsx';
import { useAuthContext } from '../../../contexts';
import { signOut } from 'firebase/auth';
import { auth } from '../../../services/firebase';
import { useNavigate } from 'react-router-dom';

/**
 * ProfileButton component.
 *
 * @author Rostyslav Nahornyi
 * @category Components.
 */
const ProfileButton = () => {
  const { currentUser, setCurrentUser } = useAuthContext();
  const navigate = useNavigate();

  const onClick = async () => {
    if (currentUser) {
      await signOut(auth);
      setCurrentUser(null);

      return navigate('/');
    }

    Events.emit('opensigninmodal');
  };

  return (
    <Button
      id={'profileButton'}
      className={'profileButton'}
      type="button"
      onClick={onClick}
      key="profileButton"
      variant={'toolbtn'}
    >
      {currentUser ? (
        <img
          className={'photoURL'}
          src={currentUser.photoURL}
          alt="userPhoto"
        />
      ) : (
        Profile32Icon
      )}
    </Button>
  );
};
export { ProfileButton };
