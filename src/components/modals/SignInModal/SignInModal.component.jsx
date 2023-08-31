import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import React from 'react';
import GoogleSignIn from '../../../../assets/google_sign_in.png';
import { auth } from '../../../services/firebase';
import Modal from '../Modal.jsx';
import styles from './SignInModal.module.scss';

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
              href="https://www.3dstreet.org/docs/3dstreet-editor/saving-and-loading-scenes/#3dstreet-cloud-account"
              target="_blank"
            >
              This is optional, learn more in the docs.{' '}
            </a>
          </p>
        </div>
        <img
          onClick={loginHandler}
          src={GoogleSignIn}
          alt="Google Sign-In"
          className={styles.signInButton}
        />
      </div>
    </Modal>
  );
};

export { SignInModal };
