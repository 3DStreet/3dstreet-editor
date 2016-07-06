var React = require('react');
var handleEntityChange = require('./Widget');

export default class NumberWidget extends React.Component {
  static propTypes = {
    min: React.PropTypes.number,
    max: React.PropTypes.number,
    value: React.PropTypes.number,
    precision: React.PropTypes.number,
    step: React.PropTypes.number
  };

  static defaultProps = {
    min: -Infinity,
    max: Infinity,
    value: 0,
    precision: 2,
    step: 1
  };

  constructor(props) {
    super(props);
    this.state = {value: this.props.value, displayValue: this.props.value.toFixed(this.props.precision)};
  }

  componentDidMount() {
    this.distance = 0;
    this.onMouseDownValue = 0;
    this.prevPointer = [ 0, 0 ];

    this.setValue(this.props.value);

    this.onBlur();
  }

  onMouseMove = event => {
    var currentValue = parseFloat(this.value);
    var pointer = [ event.clientX, event.clientY ];

    this.distance += ( pointer[ 0 ] - this.prevPointer[ 0 ] ) - ( pointer[ 1 ] - this.prevPointer[ 1 ] );
    var value = this.onMouseDownValue + ( this.distance / ( event.shiftKey ? 5 : 50 ) ) * this.props.step;
    value = Math.min( this.props.max, Math.max( this.props.min, value ) );
    if ( currentValue !== value ) {
      this.setValue( value );
    }
    this.prevPointer = [ event.clientX, event.clientY ];
  }

  onMouseDown = event => {
    event.preventDefault();
    this.distance = 0;
    this.onMouseDownValue = this.state.value;
    this.prevPointer = [ event.clientX, event.clientY ];
    document.addEventListener('mousemove', this.onMouseMove, false);
    document.addEventListener('mouseup', this.onMouseUp, false);
  }

  onMouseUp = event => {
    document.removeEventListener('mousemove', this.onMouseMove, false);
    document.removeEventListener('mouseup', this.onMouseUp, false);

    if ( Math.abs( this.distance ) < 2 ) {
      this.refs.input.focus();
      this.refs.input.select();
    }
  }

  setValue(value) {
    if (value === this.state.value) return;

    if (value !== undefined) {
      if (this.props.precision === 0) {
        value = parseInt(value);
      } else {
        value = parseFloat(value);
      }

      if (value < this.props.min)
        value = this.props.min;
      if (value > this.props.max)
        value = this.props.max;

      this.setState({value: value, displayValue: value.toFixed(this.props.precision)});

      if (this.props.onChange)
        this.props.onChange(this.props.entity, this.props.componentname, this.props.name, value);
    }
  }

  componentWillReceiveProps(newProps) {
    // This will be triggered typically when the element is changed directly with element.setAttribute
    if (newProps.value != this.state.value) {
      this.setState({value: newProps.value, displayValue: newProps.value.toFixed(this.props.precision)});
    }
  }

  onBlur = () => {
    this.setValue(parseFloat(this.refs.input.value));
    this.setState({class: ''});
  }

  onChange = e => {
    value = eval( this.refs.input.value );
    this.setState({value: value, displayValue: this.refs.input.value});
  }

  onKeyDown = event => {
    event.stopPropagation();
    if ( event.keyCode === 13 ) {
      this.setValue(parseFloat(this.refs.input.value));
      this.refs.input.blur();
    }
  }

  render() {
    return (
        <input ref="input" className="number" type="text"
          value={this.state.displayValue}
          onKeyDown={this.onKeyDown}
          onChange={this.onChange}
          onMouseDown={this.onMouseDown}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
        />
        );
  }
}
