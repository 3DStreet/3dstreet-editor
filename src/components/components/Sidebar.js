import { cloneEntity, removeSelectedEntity } from '../../lib/entity';

import { Button } from '../components';
import ComponentsContainer from './ComponentsContainer';
import Events from '../../lib/Events';
import Mixins from './Mixins';
import PropTypes from 'prop-types';
import React from 'react';
import capitalize from 'lodash-es/capitalize';
import classnames from 'classnames';

export default class Sidebar extends React.Component {
  static propTypes = {
    entity: PropTypes.object,
    visible: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      rightBarHide: false
    };
  }

  componentDidMount() {
    Events.on('componentremove', (event) => {
      this.forceUpdate();
    });

    Events.on('componentadd', (event) => {
      this.forceUpdate();
    });
  }

  // additional toggle for hide/show panel by clicking the button
  toggleRightBar = () => {
    this.setState({ rightBarHide: !this.state.rightBarHide });
  };

  handleToggle = () => {
    this.setState({ open: !this.state.open });
    if (typeof ga !== 'undefined') {
      ga('send', 'event', 'Components', 'toggleSidebar');
    }
  };

  render() {
    const entity = this.props.entity;
    const visible = this.props.visible;

    // Rightbar class names
    const className = classnames({
      outliner: true,
      hide: this.state.rightBarHide
    });

    if (entity && visible) {
      const entityName = entity.getDOMAttribute('data-layer-name');
      const entityMixin = entity.getDOMAttribute('mixin');
      const formattedMixin = entityMixin
        ? capitalize(entityMixin.replaceAll('-', ' ').replaceAll('_', ' '))
        : null;

      return (
        <div className={className} tabIndex="0">
          <div id="layers-title" onClick={this.toggleRightBar}>
            <span>{entityName || formattedMixin}</span>
            <div id="toggle-leftbar" />
          </div>
          <div className="scroll">
            <Mixins entity={entity} />
            <div id="sidebar-buttons">
              <Button variant={'toolbtn'} onClick={() => cloneEntity(entity)}>
                Duplicate
              </Button>
              <Button
                variant={'toolbtn'}
                onClick={() => removeSelectedEntity()}
              >
                Delete
              </Button>
            </div>
            <ComponentsContainer entity={entity} />
          </div>
        </div>
      );
    } else {
      return <div />;
    }
  }
}
