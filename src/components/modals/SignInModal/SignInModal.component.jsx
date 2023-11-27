import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import React from 'react';
import { auth } from '../../../services/firebase';
import Modal from '../Modal.jsx';
import styles from './SignInModal.module.scss';
import { GoogleSignInButtonSVG } from '../../../icons';

const loginHandler = async (onClose) => {
  try {
    await signInWithPopup(auth, new GoogleAuthProvider());

    onClose();
  } catch (error) {
    console.log(error);
  }
};

const SignInModal = ({ isOpen, onClose }) => {
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
            Save and share your street scenes with 3DStreet Cloud.{' '}
          </p>
          <p className={styles.p1}>
            <a
              className={styles.docsLink}
              href="https://www.3dstreet.org/docs/3dstreet-editor/saving-and-loading-scenes/#3dstreet-cloud-account"
              target="_blank"
            >
              This is beta software which may not work as expected.{' '}
            </a>
          </p>
        </div>
        <div
          onClick={() => loginHandler(onClose)}
          alt="Sign In with Google Button"
          className={styles.signInButton}
        >
          <GoogleSignInButtonSVG />
        </div>
      </div>
    </Modal>
  );
};
export { loginHandler };
export { SignInModal };
