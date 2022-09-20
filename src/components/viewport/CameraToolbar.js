import React, { Component } from "react";

import Events from "../../lib/Events.js";
import classNames from "classnames";

const options = [
  {
    value: "perspective",
    event: "cameraperspectivetoggle",
    payload: null,
    label: "3D View"
  },
  // { value: 'ortholeft', event: 'cameraorthographictoggle', payload: 'left', label: 'Left View' },
  // { value: 'orthoright', event: 'cameraorthographictoggle', payload: 'right', label: 'Right View' },
  {
    value: "orthotop",
    event: "cameraorthographictoggle",
    payload: "top",
    label: "Plan View"
  },
  // { value: 'orthobottom', event: 'cameraorthographictoggle', payload: 'bottom', label: 'Bottom View' },
  // { value: 'orthoback', event: 'cameraorthographictoggle', payload: 'back', label: 'Back View' },
  {
    value: "orthofront",
    event: "cameraorthographictoggle",
    payload: "front",
    label: "Cross Section"
  }
];

export default class CameraToolbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCamera: "perspective"
      // menuIsOpen: false
    };
    this.justChangedCamera = false;
  }

  componentDidMount() {
    Events.on("cameratoggle", data => {
      if (this.justChangedCamera) {
        // Prevent recursion.
        this.justChangedCamera = false;
        return;
      }
      this.setState({ selectedCamera: data.value });
    });
  }

  onChange(option) {
    this.justChangedCamera = true;
    this.setState({ selectedCamera: option.value });
    Events.emit(option.event, option.payload);
  }
  render() {
    const className = classNames({
      open: this.state.menuIsOpen
    });
    return (
      <div id="cameraToolbar" className={className}>
        {options.map(({ label, value, event, payload }) => (
          <button
            className={classNames(
              this.state.selectedCamera === value && "selectedCamera"
            )}
            type={"button"}
            onClick={() => this.onChange({ value, event, payload })}
            key={value}
          >
            {label}
          </button>
        ))}
      </div>
    );
  }
}
