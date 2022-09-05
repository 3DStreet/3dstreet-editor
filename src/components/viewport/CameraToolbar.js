var React = require('react');
var Events = require('../../lib/Events.js');
var classNames = require('classnames');
import Select from 'react-select';

const options = [
  { value: 'perspective', event: 'cameraperspectivetoggle', payload: null, label: '3D View' },
  // { value: 'ortholeft', event: 'cameraorthographictoggle', payload: 'left', label: 'Left View' },
  // { value: 'orthoright', event: 'cameraorthographictoggle', payload: 'right', label: 'Right View' },
  { value: 'orthotop', event: 'cameraorthographictoggle', payload: 'top', label: 'Plan View' },
  // { value: 'orthobottom', event: 'cameraorthographictoggle', payload: 'bottom', label: 'Bottom View' },
  // { value: 'orthoback', event: 'cameraorthographictoggle', payload: 'back', label: 'Back View' },
  { value: 'orthofront', event: 'cameraorthographictoggle', payload: 'front', label: 'Cross Section' },
];

function getOption (value) {
  return options.filter(opt => opt.value === value)[0];
}

export default class CameraToolbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCamera: 'perspective',
      menuIsOpen: false
    };
    this.justChangedCamera = false;
  }

  componentDidMount() {
    Events.on('cameratoggle', data => {
      if (this.justChangedCamera) {
        // Prevent recursion.
        this.justChangedCamera = false;
        return;
      }
      this.setState({selectedCamera: data.value});
    });
  }

  onChange(option) {
    this.justChangedCamera = true;
    this.setState({selectedCamera: option.value});
    Events.emit(option.event, option.payload);
  }
  render() {
    const className = classNames({
      open: this.state.menuIsOpen
    });
    return (
      <div id="cameraToolbar" className={className}>
        <Select
          onMenuOpen={() => {
            this.setState({menuIsOpen: true})
          }}
          onMenuClose={() => {
            this.setState({menuIsOpen: false})
          }}          
          id="cameraSelect"
          classNamePrefix="select"
          options={options}
          simpleValue
          value={getOption(this.state.selectedCamera)}
          isSearchable={false}
          onChange={this.onChange.bind(this)} />
      </div>
    );
  }
}
