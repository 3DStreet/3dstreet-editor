import React, { Component } from "react";
import "./HelpButton.styles.styl";
import classNames from "classnames";
import {QuestionMark} from './icons.jsx';
import Events from '../../../lib/Events.js';

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
          <button
            id="helpButton"
            className={classNames("helpButton")}
            type="button"
            onClick={onClick}
            key="helpButton"
          >
            {QuestionMark}
          </button>
    );
  }
}

export { HelpButton };