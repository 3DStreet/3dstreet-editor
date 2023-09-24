import React, { useState } from 'react';
import styles from './ScreenshotModal.module.scss';

import { Button, Dropdown, Input } from '../../components';
import Modal from '../Modal.jsx';
import PropTypes from 'prop-types';
import { Copy32Icon, Save24Icon } from '../../../icons';
import { loginHandler } from '../SignInModal';
import { useAuthContext } from '../../../contexts';
import Toolbar from '../../scenegraph/Toolbar';

function ScreenshotModal({ isOpen, onClose }) {
  const storedScreenshot = localStorage.getItem('screenshot');
  const parsedScreenshot = JSON.parse(storedScreenshot);
  const { currentUser } = useAuthContext();
  const saveScreenshot = (value) => {
    const screenshotEl = document.getElementById('screenshot');
    screenshotEl.play();
    screenshotEl.setAttribute('screentock', 'type', value);
    screenshotEl.setAttribute('screentock', 'takeScreenshot', true);
  };
  const [selectedOption, setSelectedOption] = useState(null);

  const options = [
    {
      value: 'PNG',
      label: 'PNG',
      onClick: () => saveScreenshot('png')
    },
    {
      value: 'JPG',
      label: 'JPG',
      onClick: () => saveScreenshot('jpg')
    },
    {
      value: 'GLB glTF',
      label: 'GLB glTF',
      onClick: Toolbar.exportSceneToGLTF
    },
    {
      value: '.3dstreet.json',
      label: '.3dstreet.json',
      onClick: Toolbar.convertToObject
    }
  ];

  const handleSelect = (value) => {
    setSelectedOption(value);
  };
  return (
    <Modal
      className={styles.screenshotModalWrapper}
      isOpen={isOpen}
      onClose={onClose}
      extraCloseKeyCode={72}
      title={'Share scene'}
    >
      <div className={styles.wrapper}>
        <div className={styles.header}>
          {currentUser ? (
            <div className={styles.inputContainer}>
              <Input
                copyToClipboard={true}
                className={styles.input}
                tailingIcon={<Copy32Icon />}
                readOnly={true}
                leadingSubtext={window.location.href}
              />
            </div>
          ) : (
            <div>
              <h3>Please log in first to share the URL</h3>
              <Button onClick={() => loginHandler()}>
                Sign in to 3DStreet Cloud
              </Button>
            </div>
          )}
        </div>
        <div
          className={styles.imageWrapper}
          dangerouslySetInnerHTML={{ __html: parsedScreenshot }}
        />
        <Dropdown
          placeholder="Download scene as..."
          options={options}
          onSelect={handleSelect}
          selectedOptionValue={selectedOption}
          icon={<Save24Icon />}
          className={styles.dropdown}
        />
      </div>
    </Modal>
  );
}

ScreenshotModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func.isRequired
};

export { ScreenshotModal };
