import React, { Component } from "react";
import "./EssentialActions.styles.styl";
import {
  Angle,
  Drag,
  Edit,
  RButton,
  Scroll,
  View,
  ZoomIn,
  ZoomOut
} from "./icons.jsx";

const actions = [
  {
    title: "Move around the map",
    description:
      "You have the ability to move in all directions (up, down, left, right, diagonal)",
    items: [[RButton, Drag]]
  },
  {
    title: "Look around",
    description: "Viewing the map while staying in place",
    items: [[Angle, Drag], [ZoomIn, ZoomOut, "or", Scroll]]
  },
  {
    title: "Mode switch",
    description:
      'To switch between the "View" and "Edit" modes, click the button in the upper right corner.',
    items: [[View], [Edit]]
  }
];

/**
 * EssentialActions component.
 * Exclusively for the HelpModal component as an 'Essential Actions' tab content.
 *
 * @author Oleksii Medvediev
 * @category Components.
 */
class EssentialActions extends Component {
  render() {
    return (
      <div className="essentialActionsWrapper">
        {actions.map(({ title, description, items }) => (
          <div className="row" key={title}>
            <div className="text">
              <h3 className="actionTitle">{title}</h3>
              <p className="actionDescription">{description}</p>
            </div>
            <div className="icons">
              {items.map((row, index) => (
                <div className="itemsRow" key={title.concat(index.toString())}>
                  {row.map((item, index) => (
                    <span className="item" key={index.toString()}>
                      {item}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export { EssentialActions };
