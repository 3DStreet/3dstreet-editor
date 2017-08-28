import React from 'react';
import {InputWidget} from '../widgets';
import DEFAULT_COMPONENTS from './DefaultComponents';
import PropertyRow from './PropertyRow';
import Collapsible from '../Collapsible';
import Mixins from './Mixins';
import {updateEntity, getClipboardRepresentation} from '../../actions/entity';
import Events from '../../lib/Events';
import Clipboard from 'clipboard';
import {saveString} from '../../lib/utils';

// @todo Take this out and use updateEntity?
function changeId (componentName, value) {
  var entity = AFRAME.INSPECTOR.selectedEntity;
  if (entity.id !== value) {
    entity.id = value;
    Events.emit('entityidchanged', entity);
  }
}

export default class CommonComponents extends React.Component {
  static propTypes = {
    entity: React.PropTypes.object
  };

  componentDidMount () {
    Events.on('selectedentitycomponentchanged', detail => {
      if (DEFAULT_COMPONENTS.indexOf(detail.name) !== -1) {
        this.forceUpdate();
      }
    });

    var clipboard = new Clipboard('[data-action="copy-entity-to-clipboard"]', {
      text: trigger => {
        return getClipboardRepresentation(this.props.entity);
      }
    });
    clipboard.on('error', e => {
      // @todo Show the error on the UI
    });
  }

  renderCommonAttributes () {
    const entity = this.props.entity;
    const components = entity ? entity.components : {};
    return Object.keys(components).filter(function (key) {
      return DEFAULT_COMPONENTS.indexOf(key) !== -1;
    }).sort().map(componentName => {
      const componentData = components[componentName];
      const schema = AFRAME.components[componentName].schema;
      return (
        <PropertyRow onChange={updateEntity} key={componentName} name={componentName}
          showHelp={true} schema={schema} data={componentData.data}
          isSingle={true} componentname={componentName} entity={entity}/>
      );
    });
  }

  exportToGLTF() {
    const entity = this.props.entity;
    AFRAME.INSPECTOR.exporters.gltf.parse(entity.object3D, function (result) {
      var output = JSON.stringify(result, null, 2);
      saveString(output, (entity.id || 'entity') + '.gltf', 'application/json');
    });
  }

  render () {
    const entity = this.props.entity;
    if (!entity) { return <div></div>; }
    const entityName = '<' + entity.tagName.toLowerCase() + '>';
    const entityButtons = <div>
      <a title='Export entity to GLTF' className='button fa fa-download' onClick={event => {this.exportToGLTF(); event.stopPropagation()} }></a>
      <a href='#' title='Copy entity HTML to clipboard' data-action='copy-entity-to-clipboard'
        className='button fa fa-clipboard' onClick={event => event.stopPropagation()}></a>
    </div>;

    return (
      <Collapsible>
        <div className='collapsible-header'>
          <span className='entity-name'>{entityName}</span>
          {entityButtons}
        </div>
        <div className='collapsible-content'>
          <div className='row'>
            <span className='text'>ID</span>
            <InputWidget onChange={changeId} entity={entity} name='id' value={entity.id}/>
          </div>
          {this.renderCommonAttributes()}
          <Mixins entity={entity}/>
        </div>
      </Collapsible>
    );
  }
}
