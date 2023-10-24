import React, { useEffect, useState } from 'react';
import styles from './ScreenshotModal.module.scss';

import { Button, Dropdown, Input } from '../../components';
import Modal from '../Modal.jsx';
import PropTypes from 'prop-types';
import { Copy32Icon, Save24Icon } from '../../../icons';
import { loginHandler } from '../SignInModal';
import { useAuthContext } from '../../../contexts';
import Toolbar from '../../scenegraph/Toolbar';
import { db, storage } from '../../../services/firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import {
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc
} from 'firebase/firestore';

const uploadThumbnailImage = async () => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const screentockImgElement = document.getElementById(
      'screentock-destination'
    );

    // Get the original image dimensions
    const originalWidth = screentockImgElement.naturalWidth;
    const originalHeight = screentockImgElement.naturalHeight;

    // Define the target dimensions
    const targetWidth = 320;
    const targetHeight = 240;

    // Calculate the scale factors
    const scaleX = targetWidth / originalWidth;
    const scaleY = targetHeight / originalHeight;

    // Use the larger scale factor to fill the entire space
    const scale = Math.max(scaleX, scaleY);

    // Calculate the new dimensions
    const newWidth = originalWidth * scale;
    const newHeight = originalHeight * scale;

    const resizedCanvas = document.createElement('canvas');
    resizedCanvas.width = targetWidth;
    resizedCanvas.height = targetHeight;
    const context = resizedCanvas.getContext('2d');

    // Calculate the position to center the image
    const posX = (targetWidth - newWidth) / 2;
    const posY = (targetHeight - newHeight) / 2;

    // Draw the image on the canvas with the new dimensions and position
    context.drawImage(screentockImgElement, posX, posY, newWidth, newHeight);
    // Rest of the code...
    const thumbnailDataUrl = resizedCanvas.toDataURL('image/jpeg', 0.5);
    const blobFile = await fetch(thumbnailDataUrl).then((res) => res.blob());

    const sceneDocId = STREET.utils.getCurrentSceneId();

    const thumbnailRef = ref(storage, `scenes/${sceneDocId}/files/preview.jpg`);

    const uploadedImg = await uploadBytes(thumbnailRef, blobFile);

    const downloadURL = await getDownloadURL(uploadedImg.ref);
    const userScenesRef = collection(db, 'scenes');
    const sceneDocRef = doc(userScenesRef, sceneDocId);
    const sceneSnapshot = await getDoc(sceneDocRef);
    if (sceneSnapshot.exists()) {
      await updateDoc(sceneDocRef, {
        imagePath: downloadURL,
        updateTimestamp: serverTimestamp()
      });
      console.log('Firebase updateDoc fired');
    } else {
      throw new Error('No existing sceneSnapshot exists.');
    }

    console.log('Thumbnail uploaded and Firestore updated successfully.');
  } catch (error) {
    console.error('Error capturing screenshot and updating Firestore:', error);
  }
};

function ScreenshotModal({ isOpen, onClose }) {
  const storedScreenshot = localStorage.getItem('screenshot');
  const parsedScreenshot = JSON.parse(storedScreenshot);
  const { currentUser } = useAuthContext();
  const saveScreenshot = async (value) => {
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
                  variant="toolbtn"
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
        <Button
          variant="outlined"
          onClick={uploadThumbnailImage}
          className={styles.thumbnailButton}
        >
          Set as scene thumbnail
        </Button>
      </div>
    </Modal>
  );
}

ScreenshotModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func.isRequired
};

export { ScreenshotModal };
