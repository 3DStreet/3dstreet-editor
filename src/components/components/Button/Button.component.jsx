import { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './Button.module.scss';

const variants = {
  filled: styles.filledButton,
  outlined: styles.outlinedButton,
  ghost: styles.ghostButton,
  toolbtn: styles.toolButton
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
          styles.buttonWrapper,
          variants[variant],
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
