import './ScreenshotButton.styles.styl';

import { Button } from '../Button';
import { Component } from 'react';
import Events from '../../../lib/Events.js';
import { ScreenshotIcon } from './icons.jsx';

/**
 * ScreenshotButton component.
 *
 * @author Ihor Dubas
 * @category Components.
 */
class ScreenshotButton extends Component {
  render() {
    const onClick = () => Events.emit('openscreenshotmodal');
    return (
      <Button
        id={'screenshotButton'}
        className={'screenshotButton'}
        type="button"
        onClick={onClick}
        key="screenshotButton"
        variant={'toolbtn'}
      >
        {ScreenshotIcon}
      </Button>
    );
  }
}
export { ScreenshotButton };
