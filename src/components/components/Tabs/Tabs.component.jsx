import React, { Component } from "react";
import "./Tabs.styl";

class Tabs extends Component {
  render() {
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

export { Tabs };
