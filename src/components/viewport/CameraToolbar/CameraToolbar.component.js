import "./CameraToolbar.styl";

import React, { Component } from "react";

import Events from "../../../lib/Events.js";
import { Hint } from "./components";
import classNames from "classnames";

const options = [
  {
    value: "perspective",
    event: "cameraperspectivetoggle",
    payload: null,
    label: "3D View",
    hint: "3D View tab hint text"
  },
  // { value: 'ortholeft', event: 'cameraorthographictoggle', payload: 'left', label: 'Left View' },
  // { value: 'orthoright', event: 'cameraorthographictoggle', payload: 'right', label: 'Right View' },
  {
    value: "orthotop",
    event: "cameraorthographictoggle",
    payload: "top",
    label: "Plan View",
    hint: "Plan View tab hint text"
  },
  // { value: 'orthobottom', event: 'cameraorthographictoggle', payload: 'bottom', label: 'Bottom View' },
  // { value: 'orthoback', event: 'cameraorthographictoggle', payload: 'back', label: 'Back View' },
  {
    value: "orthofront",
    event: "cameraorthographictoggle",
    payload: "front",
    label: "Cross Section",
    hint: "Cross Section tab hint text"
  }
];

class CameraToolbar extends Component {
  state = {
    selectedCamera: "perspective"
  };

  componentDidMount() {
    Events.on("cameratoggle", data =>
      this.setState({ selectedCamera: data.value })
    );
  }

  handleCameraChange(option) {
    this.setState({ selectedCamera: option.value });
    Events.emit(option.event, option.payload);
  }

  render() {
    const className = classNames({
      open: this.state.menuIsOpen
    });
    return (
      <div id={"cameraToolbar"} className={className}>
        {options.map(({ label, value, event, payload, hint }) => (
          <button
            className={classNames(
              this.state.selectedCamera === value && "selectedCamera"
            )}
            type={"button"}
            onClick={() => this.handleCameraChange({ value, event, payload })}
            key={value}
          >
            {label}
            <Hint hint={hint} tab={value} />
          </button>
        ))}
      </div>
    );
  }
}

export { CameraToolbar };
