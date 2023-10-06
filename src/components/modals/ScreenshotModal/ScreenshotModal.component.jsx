import React, { useEffect, useState } from 'react';
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
  const currentUrl = window.location.href;
  const [inputValue, setInputValue] = useState(currentUrl);
  useEffect(() => {
    setInputValue(currentUrl);
  }, [currentUrl]);

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

  const copyToClipboardTailing = async () => {
    try {
      const updatedUrl = window.location.href;
      await navigator.clipboard.writeText(updatedUrl);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <Modal
      className={styles.screenshotModalWrapper}
      isOpen={isOpen}
      onClose={onClose}
      extraCloseKeyCode={72}
      title={'Share scene'}
      titleElement={
        <>
          <h3
            style={{
              fontSize: '20px',
              marginTop: '26px',
              marginBottom: '0px',
              position: 'relative'
            }}
          >
            Share scene
          </h3>
        </>
      }
    >
      <div className={styles.wrapper}>
        <div className={styles.header}>
          {currentUser ? (
            <div className={styles.forms}>
              <div className={styles.inputContainer}>
                <Input
                  className={styles.input}
                  defaultValue={inputValue}
                  value={inputValue}
                  readOnly={true}
                  hideBorderAndBackground={true}
                />
                <Button
                  variant="outlinedButton"
                  onClick={copyToClipboardTailing}
                  className={styles.button}
                >
                  <Copy32Icon />
                </Button>
              </div>
              <Dropdown
                placeholder="Download scene as..."
                options={options}
                onSelect={handleSelect}
                selectedOptionValue={selectedOption}
                icon={<Save24Icon />}
                className={styles.dropdown}
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
      </div>
    </Modal>
  );
}

ScreenshotModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func.isRequired
};

export { ScreenshotModal };
