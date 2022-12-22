import React, { Component } from 'react';
import './HelpButton.styles.styl';
import { QuestionMark } from './icons.jsx';
import Events from '../../../lib/Events.js';
import { Button } from '../Button';

/**
 * HelpButton component.
 *
 * @author Anna Botsula
 * @category Components.
 */
class HelpButton extends Component {
  render() {
    const onClick = () => Events.emit('openhelpmodal');

    return (
      <Button
        id={'helpButton'}
        className={'helpButton'}
        type="button"
        onClick={onClick}
        key="helpButton"
        variant={'toolbtn'}
      >
        {QuestionMark}
      </Button>
    );
  }
}

export { HelpButton };
