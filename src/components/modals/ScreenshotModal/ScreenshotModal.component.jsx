import React from 'react';
import styles from './ScreenshotModal.module.scss';

import { Button } from '../../components';
import { Component } from 'react';
import Modal from '../Modal.jsx';
import PropTypes from 'prop-types';
class ScreenshotModal extends Component {
  static propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func.isRequired
  };

  saveScreenshot = (value) => {
    //    screenshotEl = AFRAME.scenes[0];
    const screenshotEl = document.getElementById('no-pause');
    screenshotEl.play();
    screenshotEl.setAttribute('screentock', 'type', value);
    screenshotEl.setAttribute('screentock', 'takeScreenshot', true);
  };

  render() {
    const { isOpen, onClose } = this.props;
    const storedScreenshot = localStorage.getItem('screenshot');
    const parsedScreenshot = JSON.parse(storedScreenshot);
    return (
      <Modal
        className={styles.screenshotModalWrapper}
        isOpen={isOpen}
        onClose={onClose}
        extraCloseKeyCode={72}
      >
        <div className={styles.wrapper}>
          <div className={styles.header}>
            <h1 className={styles.title}>Save as</h1>
            <div className={styles.buttons}>
              <Button
                className={styles.button}
                onClick={() => this.saveScreenshot('jpg')}
              >
                JPG
              </Button>
              <Button
                className={styles.button}
                onClick={() => this.saveScreenshot('png')}
              >
                PNG
              </Button>
            </div>
          </div>
          <div
            className={styles.imageWrapper}
            dangerouslySetInnerHTML={{ __html: parsedScreenshot }}
          />
        </div>
      </Modal>
    );
  }
}
export { ScreenshotModal };
