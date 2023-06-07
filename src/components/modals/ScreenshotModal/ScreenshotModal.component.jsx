import './ScreenshotModal.styles.styl';

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
    AFRAME.scenes[0].setAttribute('screentock', 'type', value);
    AFRAME.scenes[0].setAttribute('screentock', 'takeScreenshot', true);
  };

  render() {
    const { isOpen, onClose } = this.props;
    const storedScreenshot = localStorage.getItem('screenshot');
    const parsedScreenshot = JSON.parse(storedScreenshot);
    return (
      <Modal
        className={'screenshotModalWrapper'}
        isOpen={isOpen}
        onClose={onClose}
        extraCloseKeyCode={72}
      >
        <div className={'header'}>
          <h1 className={'title'}>Save as</h1>
          <div className={'buttons'}>
            <Button onClick={() => this.saveScreenshot('jpg')}>{'JPG'}</Button>
            <Button onClick={() => this.saveScreenshot('png')}>{'PNG'}</Button>
          </div>
        </div>
        <div
          className={'image'}
          dangerouslySetInnerHTML={{ __html: parsedScreenshot }}
        ></div>
      </Modal>
    );
  }
}
export { ScreenshotModal };
