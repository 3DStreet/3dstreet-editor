import './Button.styles.styl';

import React, { Component } from 'react';

import PropTypes from 'prop-types';
import classNames from 'classnames';

const getVariant = (variant) => {
  switch (variant) {
    case 'filled':
      return 'filledButton';

    case 'outlined':
      return 'outlinedButton';

    case 'ghost':
      return 'ghostButton';

    case 'toolbtn':
      return 'toolButton';

    default:
      return 'filledButton';
  }
};

/**
 * Button component.
 *
 * @author Oleksii Medvediev
 * @category Components
 */
class Button extends Component {
  static propTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func,
    type: PropTypes.string,
    children: PropTypes.node,
    variant: PropTypes.string,
    disabled: PropTypes.bool,
    id: PropTypes.string || PropTypes.number
  };

  render() {
    const {
      className,
      onClick,
      type = 'button',
      children,
      variant = 'filled',
      disabled,
      id
    } = this.props;

    return (
      <button
        className={classNames(
          'buttonWrapper',
          variant && getVariant(variant),
          className
        )}
        onClick={onClick}
        type={type}
        tabIndex={0}
        disabled={disabled}
        id={id}
      >
        {children}
      </button>
    );
  }
}

export { Button };
