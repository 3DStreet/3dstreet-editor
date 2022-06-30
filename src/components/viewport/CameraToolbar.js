var React = require('react');
var Events = require('../../lib/Events.js');
var classNames = require('classnames');
import Select from 'react-select';

const options = [
  { value: 'perspective', event: 'cameraperspectivetoggle', payload: null, label: 'Perspective' },
  { value: 'ortholeft', event: 'cameraorthographictoggle', payload: 'left', label: 'Left View' },
  { value: 'orthoright', event: 'cameraorthographictoggle', payload: 'right', label: 'Right View' },
  { value: 'orthotop', event: 'cameraorthographictoggle', payload: 'top', label: 'Top View' },
  { value: 'orthobottom', event: 'cameraorthographictoggle', payload: 'bottom', label: 'Bottom View' },
  { value: 'orthoback', event: 'cameraorthographictoggle', payload: 'back', label: 'Back View' },
  { value: 'orthofront', event: 'cameraorthographictoggle', payload: 'front', label: 'Front View' },
];

function getOption (value) {
  return options.filter(opt => opt.value === value)[0];
}

export default class CameraToolbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCamera: 'perspective'
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
    console.log(option);
    this.justChangedCamera = true;
    this.setState({selectedCamera: option.value});
    Events.emit(option.event, option.payload);
  }

  render() {
    const customStyles = {
      dropdownIndicator: (provided, state) => ({
        backgroundImage: state.isSelected ? 'url("/assets/arrow_up.svg")': 'url("/assets/arrow_down.svg")'
      }),
      menuList: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected ? '#2D2D2D' : 'rgba(50,50,50,0.8)'
      })
    }
    return (
      <div id="cameraToolbar">
        <Select
          styles={customStyles}
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
