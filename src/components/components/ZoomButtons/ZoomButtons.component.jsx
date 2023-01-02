import './ZoomButton.styles.styl';

import { Component } from 'react';

/**
 * ZoomButtons component.
 *
 * @author Oleksii Medvediev
 * @category Components
 */
class ZoomButtons extends Component {
  render() {
    return (
      <div className={'wrapper'} id={'zoomButtons'}>
        <button
          id={'zoomInButton'}
          className={'btn plus-button'}
          type={'button'}
        />
        <button
          id={'zoomOutButton'}
          className={'btn minus-button'}
          type={'button'}
        />
      </div>
    );
  }
}

export { ZoomButtons };
