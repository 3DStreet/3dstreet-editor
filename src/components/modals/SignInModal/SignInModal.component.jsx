import React from 'react';
import styles from './SignInModal.module.scss';

import Modal from '../Modal.jsx';
import { Button } from '../../components';
import GoogleIcon from '../../../../assets/google.svg';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../../services/firebase';
import { redirect } from 'react-router-dom';

const SignInModal = ({ isOpen, onClose }) => {
  const loginHandler = async () => {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());

      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal
      className={styles.modalWrapper}
      isOpen={isOpen}
      onClose={onClose}
      extraCloseKeyCode={72}
    >
      <div className={styles.contentWrapper}>
        <h2 className={styles.title}>Sign in to 3DStreet Cloud</h2>
        <div className={styles.content}>
          <p className={styles.p1}>
            Access or create your 3DStreet Cloud account via Google.
          </p>
          <p className={styles.p2}>
            A 3DStreet Cloud account is optional. You can still save and load
            files locally.{' '}
            <a className={styles.docsLink} href="#">
              Learn about 3DStreet Cloud accounts in the docs
            </a>
          </p>
        </div>
        <button
          onClick={loginHandler}
          className={styles.signInButton}
          type={'button'}
          tabIndex={0}
        >
          <img src={GoogleIcon} />
          Sign in with Google
        </button>
      </div>
    </Modal>
  );
};

export { SignInModal };
