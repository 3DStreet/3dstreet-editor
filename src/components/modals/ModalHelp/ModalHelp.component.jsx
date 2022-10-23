import React, { Component } from "react";

import Modal from "../Modal.jsx";
import PropTypes from "prop-types";
import { Tabs } from "../../components";
import "./ModalHelp.styles.styl";
import { EssentialActions, Shortcuts } from "./components/index.js";

const tabs = [
  {
    label: "Essential Actions",
    value: "essentialActions"
  },
  {
    label: "Keyboard Shortcuts",
    value: "shortcuts"
  }
];

class ModalHelp extends Component {
  static propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func.isRequired
  };

  state = {
    selectedTab: "essentialActions"
  };

  handleChangeTab = tab =>
    this.setState(prevState => ({
      ...prevState,
      selectedTab: tab
    }));

  render() {
    const { isOpen, onClose } = this.props;

    return (
      <Modal
        titleElement={
          <Tabs
            tabs={tabs.map(tab => ({
              ...tab,
              isSelected: this.state.selectedTab === tab.value,
              onClick: () => this.handleChangeTab(tab.value)
            }))}
          />
        }
        isOpen={isOpen}
        onClose={onClose}
        extraCloseKeyCode={72}
      >
        {this.state.selectedTab === "shortcuts" ? (
          <Shortcuts />
        ) : (
          <EssentialActions />
        )}
      </Modal>
    );
  }
}

export { ModalHelp };
