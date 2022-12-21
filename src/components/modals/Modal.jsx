import './Modal.styles.styl';

import React, { Component } from 'react';

import PropTypes from 'prop-types';
import classNames from 'classnames';

export default class Modal extends Component {
  static propTypes = {
    id: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.array, PropTypes.element])
      .isRequired,
    isOpen: PropTypes.bool,
    extraCloseKeyCode: PropTypes.number,
    closeOnClickOutside: PropTypes.bool,
    onClose: PropTypes.func,
    title: PropTypes.string,
    titleElement: PropTypes.element,
    className: PropTypes.string
  };

  static defaultProps = {
    closeOnClickOutside: true
  };

  constructor(props) {
    super(props);
    this.state = { isOpen: this.props.isOpen };
  }

  componentDidMount() {
    document.addEventListener('keyup', this.handleGlobalKeydown);
    document.addEventListener('mousedown', this.handleGlobalMousedown);
  }

  handleGlobalKeydown = event => {
    if (
      this.state.isOpen &&
      (event.keyCode === 27 ||
        (this.props.extraCloseKeyCode &&
          event.keyCode === this.props.extraCloseKeyCode))
    ) {
      this.close();

      // Prevent closing the inspector
      event.stopPropagation();
    }
  };

  shouldClickDismiss = event => {
    var target = event.target;
    // This piece of code isolates targets which are fake clicked by things
    // like file-drop handlers
    if (target.tagName === 'INPUT' && target.type === 'file') {
      return false;
    }
    if (target === this.refs.self || this.refs.self.contains(target)) {
      return false;
    }
    return true;
  };

  handleGlobalMousedown = event => {
    if (
      this.props.closeOnClickOutside &&
      this.state.isOpen &&
      this.shouldClickDismiss(event)
    ) {
      if (typeof this.props.onClose === 'function') {
        this.props.onClose();
      }
    }
  };

  componentWillUnmount() {
    document.removeEventListener('keyup', this.handleGlobalKeydown);
    document.removeEventListener('mousedown', this.handleGlobalMousedown);
  }

  componentWillReceiveProps(newProps) {
    if (this.state.isOpen !== newProps.isOpen) {
      this.setState({ isOpen: newProps.isOpen });
    }
  }

  close = () => {
    this.setState({ isOpen: false });
    if (this.props.onClose) {
      this.props.onClose();
    }
  };

  render() {
    const { children, id, title, titleElement, className } = this.props;

    return (
      <div
        id={id}
        className={classNames('modal', !this.state.isOpen && 'hide')}
      >
        <div className={classNames('modal-content', className)} ref="self">
          <div className="modal-header">
            <span className="close" onClick={this.close}>
              <span />
              <span />
            </span>
            {typeof titleElement !== 'undefined' ? (
              titleElement
            ) : (
              <h3>{title}</h3>
            )}
          </div>
          <div className="modal-body">{children}</div>
        </div>
      </div>
    );
  }
}
