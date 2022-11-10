import './ZoomButton.styles.styl';

import React, { Component } from 'react';

/**
 * ZoomButtons component.
 *
 * @author Oleksii Medvediev
 * @category Components
 */
class ZoomButtons extends Component {
  render() {
    const zoomIn = () => {};

    const zoomOut = () => {};

    return (
      <div className={'wrapper'} id={'zoomButtons'}>
        <button
          className={'btn plus-button'}
          type={'button'}
          onClick={zoomIn}
        />
        <button
          className={'btn minus-button'}
          type={'button'}
          onClick={zoomOut}
        />
      </div>
    );
  }
}

export { ZoomButtons };
