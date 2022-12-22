import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './Button.styles.styl';

const getVariant = variant => {
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
    children: PropTypes.element,
    variant: PropTypes.string,
    disabled: PropTypes.bool,
    key: PropTypes.string,
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
      key,
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
        key={key}
        id={id}
      >
        {children}
      </button>
    );
  }
}

export { Button };
