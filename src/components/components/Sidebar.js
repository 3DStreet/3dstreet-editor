import React from 'react';
import PropTypes from 'prop-types';
import ComponentsContainer from './ComponentsContainer';
import Events from '../../lib/Events';
import classnames from 'classnames';

export default class Sidebar extends React.Component {
  static propTypes = {
    entity: PropTypes.object,
    visible: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.state = { 
      open: false ,
      rightBarHide: false
    };
  }

  componentDidMount() {
    Events.on('componentremove', event => {
      this.forceUpdate();
    });

    Events.on('componentadd', event => {
      this.forceUpdate();
    });
  }

  // additional toggle for hide/show panel by clicking the button
  toggleRightBar = () => {
    this.setState({ rightBarHide: !this.state.rightBarHide});
  }

  handleToggle = () => {
    this.setState({ open: !this.state.open });
    ga('send', 'event', 'Components', 'toggleSidebar');
  };

  render() {
    const entity = this.props.entity;
    const visible = this.props.visible;

    // Rightbar class names
    const className = classnames({
      hide: this.state.rightBarHide
    });

    if (entity && visible) {
      const entityName = entity.getDOMAttribute('data-layer-name');
      return (
        <div id="sidebar" className={className}>
            <div id="entity-name" 
              onClick={this.toggleRightBar}
              >
              <span>{entityName}</span>
              <div 
                id="toggle-rightbar"                
              >
              </div>
            </div>
          <ComponentsContainer entity={entity} />
        </div>
      );
    } else {
      return <div />;
    }
  }
}
