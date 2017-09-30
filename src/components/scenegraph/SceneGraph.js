import React from 'react';
import classnames from 'classnames';
import debounce from 'lodash.debounce';
import {removeEntity, cloneEntity} from '../../actions/entity';
import Toolbar from './Toolbar';
const Events = require('../../lib/Events.js');

const ICONS = {
  camera: 'fa-camera',
  geometry: 'fa-cube',
  light: 'fa-lightbulb-o',
  material: 'fa-picture-o'
};

const gaTrackSearchEntity = debounce(() => {
  ga('send', 'event', 'SceneGraph', 'searchEntity');
}, 3000);

export default class SceneGraph extends React.Component {
  static propTypes = {
    onChange: React.PropTypes.func,
    scene: React.PropTypes.object,
    value: React.PropTypes.string,
    visible: React.PropTypes.bool
  };

  static defaultProps = {
    value: '',
    index: -1,
    id: 'left-sidebar'
  }

  constructor (props) {
    super(props);
    this.state = {
      value: this.props.value || '',
      options: [],
      selectedIndex: -1,
      filterText: ''
    };

  }

  componentDidMount () {
    this.rebuildOptions();

    document.addEventListener('componentremoved', () => {
      this.forceUpdate();
    });

    Events.on('entityselected', (entity, self) => {
      if (self) { return; }
      this.setValue(entity);
    });
    Events.on('entityidchanged', this.rebuildOptions);
    document.addEventListener('componentremoved', this.rebuildOptions);
    Events.on('dommodified', this.rebuildOptions);
  }

  setValue = value => {
    let found = false;
    for (let i = 0; i < this.state.options.length; i++) {
      const element = this.state.options[i];
      if (element.value === value) {
        this.setState({value: value, selectedIndex: i});

        if (this.props.onChange) {
          this.props.onChange(value);
        }
        Events.emit('entityselected', value, true);
        found = true;
      }
    }

    if (!found) {
      this.setState({value: null, selectedIndex: -1});
    }
    ga('send', 'event', 'SceneGraph', 'selectEntity');
  }

  update = e => {
    this.setValue(e.target.value);
  }

  rebuildOptions = () => {
    const options = [{static: true, value: this.props.scene, tagName: 'a-scene', hasChildren: true}];

    function treeIterate (element, depth) {
      if (!element) { return; }

      if (depth === undefined) {
        depth = 1;
      } else {
        depth += 1;
      }
      let children = element.children;
      for (let i = 0; i < children.length; i++) {
        let child = children[i];

        // filter out all entities added by inspector and the canvas added by aframe-core
        if (!child.dataset.isInspector && child.isEntity && !child.isInspector) {
          let extra = '';

          for (let componentName in ICONS) {
            if (child.components && child.components[componentName]) {
              let properties = child.getAttribute(componentName);
              if (!properties) { continue; }
              const titles = Object.keys(properties)
                .sort()
                .map(property => {
                  return ' - ' + property + ': ' + properties[property];
                });
              let componentTitle = componentName + (titles.length ? '\n' + titles.join('\n') : '');
              extra += ' <i class="component fa ' + ICONS[componentName] + '" title="' + componentTitle + '"></i>';
            }
          }

          const pad = '&nbsp;&nbsp;&nbsp;'.repeat(depth);
          const label = child.id ? child.id : '&lt;' + child.tagName.toLowerCase() + '&gt;';

          options.push({
            static: true,
            depth: depth,
            value: child,
            hasChildren: child.children.length > 0,
            tagName: child.tagName.toLowerCase(),
            id: child.id,
            extra: extra
          });

          treeIterate(child, depth);
        }
      }
    }
    treeIterate(this.props.scene);
    this.setState({options: options});
  }

  selectIndex = index => {
    if (index >= 0 && index < this.state.options.length) {
      this.setValue(this.state.options[index].value);
    }
  }

  onFilterKeyUp = event => {
    if (event.keyCode === 27) {
      this.clearFilter();
    }
  }

  onKeyDown = event => {
    switch (event.keyCode) {
      case 38: // up
      case 40: // down
        event.preventDefault();
        event.stopPropagation();
        break;
    }
  }

  onKeyUp = event => {
    if (this.state.value === null) {
      return;
    }
    switch (event.keyCode) {
      case 38: // up
        this.selectIndex(this.state.selectedIndex - 1);
        ga('send', 'event', 'SceneGraph', 'navigateWithKeyboard');
        break;
      case 40: // down
        this.selectIndex(this.state.selectedIndex + 1);
        ga('send', 'event', 'SceneGraph', 'navigateWithKeyboard');
        break;
    }
  }

  cloneEntity = option => {
    cloneEntity(option);
    ga('send', 'event', 'SceneGraph', 'cloneEntity');
  }

  toggleVisibility = (entity, event) => {
    var visible = entity.tagName.toLowerCase() === 'a-scene' ? entity.object3D.visible : entity.getAttribute('visible');
    entity.setAttribute('visible', !visible);
  }

  renderOptions () {
    var filterText = this.state.filterText.toUpperCase();
    return this.state.options
      .filter((option, idx) => {
        const value = option.value;
        // Check if the ID or the tagName includes the filterText
        if (value.id.toUpperCase().indexOf(filterText) > -1 ||
            value.tagName.toUpperCase().indexOf(filterText) > -1 ||
            value.getAttribute('class').indexOf(filterText) > -1) {
          return true;
        }

        // Check each component's name
        for (var i in value.components) {
          var component = value.components[i];
          if (component.attrName.toUpperCase().indexOf(filterText) > -1) { return true; }

          // @todo Use .data instead of attrValue ?
          for (var j in component.attrValue) {
            var attrValue = component.attrValue[j].toString();
            if (attrValue.toUpperCase().indexOf(filterText) > -1) { return true; }
          }
        }

        return false;
      })
      .map((option, idx) => {
        let cloneButton = <a onClick={() => this.cloneEntity(option.value)}
          title="Clone entity" className="button fa fa-clone"></a>;
        let removeButton = <a onClick={event => { event.stopPropagation(); removeEntity(option.value); } }
          title="Remove entity" className="button fa fa-trash-o"></a>;

        if (option.value.tagName === 'A-SCENE') {
          cloneButton = '';
          removeButton = '';
        }

        const pad = '    '.repeat(option.depth);
        // const collapse = option.hasChildren ? <span className="collasespace fa fa-caret-down"></span> : <span className="collasespace"></span>;
        const collapse = null;
        let entity = option.value;
        const visible = entity.tagName.toLowerCase() == 'a-scene' ? entity.object3D.visible : entity.getAttribute('visible');
        let visibility = <i title="Toggle entity visibility" className={'fa ' + (visible ? 'fa-eye' : 'fa-eye-slash')}
            onClick={ event => { this.toggleVisibility(option.value, event) } }></i>;

        const className = classnames({
          option: true,
          active: option.value === this.state.value,
          novisible: !visible
        });

        let entityName = option.id;
        if (!entity.isScene && !entityName && entity.getAttribute('class')) {
          entityName = entity.getAttribute('class').split(' ')[0];
        }

        return (
          <div key={idx} className={className} value={option.value}
            onClick={() => this.setValue(option.value)}>
            <span>{visibility} {collapse}{pad} &lt;{option.tagName}<span className="name">{entityName ? ` ${entityName}` : ''}</span>
            <span dangerouslySetInnerHTML={{__html: option.extra}}></span>&gt;</span>
              <span className="icons">
                {cloneButton}
                {removeButton}
              </span>
          </div>
        );
      });
  }

  onChangeFilter = e => {
    this.setState({filterText: e.target.value});
    gaTrackSearchEntity();
  }

  clearFilter = () => {
    this.setState({filterText: ''});
  }

  render () {
    // to hide the SceneGraph we have to hide its parent too (#left-sidebar)
    if (!this.props.visible) {
      return null;
    }

    let clearFilter = this.state.filterText ? <a onClick={this.clearFilter} className='button fa fa-times'></a> : null;

    return (
      <div id={this.props.id} className='scenegraph'>
        <div className='scenegraph-toolbar'>
          <Toolbar/>
          <div className='search'>
            <input id="filter" placeholder='Search...' value={this.state.filterText}
              onChange={this.onChangeFilter} onKeyUp={this.onFilterKeyUp}/>
            {clearFilter}
            <span className='fa fa-search'></span>
          </div>
        </div>
        <div className='outliner' tabIndex='0' onKeyDown={this.onKeyDown}
          onKeyUp={this.onKeyUp}>
          {this.renderOptions()}
        </div>
      </div>
    );
  }
}
