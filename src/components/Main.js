require('../lib/vendor/ga');
const INSPECTOR = require('../lib/inspector.js');

import React from 'react';
import ReactDOM from 'react-dom';

const Events = require('../lib/Events.js');
import ComponentsSidebar from './components/Sidebar';
import ModalTextures from './modals/ModalTextures';
import SceneGraph from './scenegraph/SceneGraph';
import ToolBar from './ToolBar';

import '../css/main.css';

// Megahack to include font-awesome.
injectCSS('https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css');
injectCSS('https://fonts.googleapis.com/css?family=Roboto:400,300,500');

export default class Main extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      inspectorEnabled: true,
      sceneEl: document.querySelector('a-scene'),
      entity: null,
      isModalTexturesOpen: false
    };
  }

  componentDidMount () {
    // Create an observer to notify the changes in the scene
    var observer = new MutationObserver(function (mutations) {
      Events.emit('domModified', mutations);
    });
    var config = {attributes: true, childList: true, characterData: true};
    observer.observe(this.state.sceneEl, config);

    Events.on('openTexturesModal', function (textureOnClose) {
      this.setState({isModalTexturesOpen: true, textureOnClose: textureOnClose});
    }.bind(this));

    Events.on('entitySelected', entity => {
      this.setState({entity: entity});
    });

    Events.on('inspectorModeChanged', enabled => {
      this.setState({inspectorEnabled: enabled});
    });
  }

  onModalTextureOnClose = value => {
    this.setState({isModalTexturesOpen: false});
    if (this.state.textureOnClose) {
      this.state.textureOnClose(value);
    }
  }

  openModal = () => {
    this.setState({isModalTexturesOpen: true});
  }

  toggleEdit = () => {
    if (this.state.inspectorEnabled) {
      INSPECTOR.close();
    } else {
      INSPECTOR.open();
    }
  }

  render () {
    var scene = this.state.sceneEl;
    var textureDialogOpened = this.state.isModalTexturesOpen;
    let editButton = <a className='toggle-edit' onClick={this.toggleEdit}>{(this.state.inspectorEnabled ? 'Back to Scene' : 'Inspect Scene')}</a>;

    return (
      <div>
        {editButton}
        <div id='aframe-inspector-panels' className={this.state.inspectorEnabled ? '' : 'hidden'}>
          <ModalTextures ref='modaltextures' isOpen={textureDialogOpened}
            onClose={this.onModalTextureOnClose}/>
          <div id='left-sidebar'>
            <SceneGraph scene={scene} selectedEntity={this.state.entity}/>
          </div>
          <div id='right-panels'>
            <ToolBar/>
            <ComponentsSidebar entity={this.state.entity}/>
          </div>
        </div>
      </div>
    );
  }
}

function injectCSS (url) {
  var link = document.createElement('link');
  link.href = url;
  link.type = 'text/css';
  link.rel = 'stylesheet';
  link.media = 'screen,print';
  link.setAttribute('data-aframe-inspector', 'style');
  document.getElementsByTagName('head')[0].appendChild(link);
}

(function init () {
  var div = document.createElement('div');
  div.id = 'aframe-inspector';
  div.setAttribute('data-aframe-inspector', 'app');
  document.body.appendChild(div);
  window.addEventListener('inspector-loaded', function () {
    ReactDOM.render(<Main/>, div);
  });
  AFRAME.INSPECTOR = INSPECTOR;
})();
