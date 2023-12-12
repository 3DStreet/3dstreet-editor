import './Hint.scss';

import { Component } from 'react';

import PropTypes from 'prop-types';

/**
 * Hint component.
 * Exclusively for the CameraToolbar component's tab button.
 *
 * @author Oleksii Medvediev
 * @category Components.
 */
class Hint extends Component {
  componentDidMount() {
    const hintElement = document.getElementById(this.props.tab.concat('Tab'));

    hintElement.setAttribute(
      'style',
      `left: calc(50% - ${hintElement.clientWidth / 2}px)`
    );
  }

  render() {
    const { hint, tab } = this.props;

    return (
      <div id={tab.concat('Tab')} className="wrapper">
        <span>{hint}</span>
      </div>
    );
  }
}

Hint.propTypes = {
  hint: PropTypes.string.isRequired,
  tab: PropTypes.string.isRequired
};

export { Hint };
