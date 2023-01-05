import './HelpButton.styles.styl';

import { Button } from '../Button';
import { Component } from 'react';
import Events from '../../../lib/Events.js';
import { QuestionMark } from './icons.jsx';

/**
 * HelpButton component.
 *
 * @author Anna Botsula, Oleksii Medvediev
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
