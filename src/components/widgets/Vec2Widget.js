import NumberWidget from './NumberWidget';
import PropTypes from 'prop-types';
import React from 'react';
import { areVectorsEqual } from '../../lib/utils.js';

export default class Vec2Widget extends React.Component {
  static propTypes = {
    componentname: PropTypes.string,
    entity: PropTypes.object,
    onChange: PropTypes.func,
    value: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      x: props.value.x,
      y: props.value.y
    };
  }

  onChange = (name, value) => {
    this.setState({ [name]: parseFloat(value.toFixed(5)) }, () => {
      if (this.props.onChange) {
        this.props.onChange(name, this.state);
      }
    });
  };

  componentDidUpdate() {
    const props = this.props;
    if (!areVectorsEqual(props.value, this.state)) {
      this.setState({
        x: props.value.x,
        y: props.value.y
      });
    }
  }

  render() {
    const widgetProps = {
      componentname: this.props.componentname,
      entity: this.props.entity,
      onChange: this.onChange
    };

    return (
      <div className="vec2">
        <NumberWidget name="x" value={this.state.x} {...widgetProps} />
        <NumberWidget name="y" value={this.state.y} {...widgetProps} />
      </div>
    );
  }
}
