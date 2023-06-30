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
            Save and share your street scenes with a 3DStreet Cloud account.{' '}
            <a
              className={styles.docsLink}
              href="//3dstreet.org/docs/3dstreet-editor/3dstreet-cloud-account"
            >
              This is optional, learn more in the docs.{' '}
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
