import './ZoomButton.styles.styl';

import React, { Component } from 'react';

import { inspector } from '../../../index';

const delta = new THREE.Vector3();

/**
 * ZoomButtons component.
 *
 * @author Oleksii Medvediev
 * @category Components
 */
class ZoomButtons extends Component {
  handleZoomIn = () => {
    const controls = new THREE.EditorControls(
      inspector.camera,
      inspector.container
    );
    delta.set(0, 0, -1);
    controls.zoom(delta);
  };

  handleZoomOut = () => {
    const controls = new THREE.EditorControls(
      inspector.camera,
      inspector.container
    );
    delta.set(0, 0, 1);
    controls.zoom(delta);
  };

  render() {
    return (
      <div className={'wrapper'} id={'zoomButtons'}>
        <button
          className={'btn plus-button'}
          type={'button'}
          onClick={this.handleZoomIn}
        />
        <button
          className={'btn minus-button'}
          type={'button'}
          onClick={this.handleZoomOut}
        />
      </div>
    );
  }
}

export { ZoomButtons };
