import './ZoomButtons.scss';

import { Button } from '../Button';
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
        <Button
          id={'zoomInButton'}
          className={'btn plus-button'}
          type={'button'}
          variant={'primary'}
        />
        <Button
          id={'zoomOutButton'}
          className={'btn minus-button'}
          type={'button'}
          variant={'primary'}
        />
      </div>
    );
  }
}

export { ZoomButtons };
