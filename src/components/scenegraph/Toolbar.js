import React, { Component } from 'react';

import Events from '../../lib/Events.js';
import { saveBlob } from '../../lib/utils';

// const LOCALSTORAGE_MOCAP_UI = "aframeinspectormocapuienabled";

function filterHelpers(scene, visible) {
  scene.traverse(o => {
    if (o.userData.source === 'INSPECTOR') {
      o.visible = visible;
    }
  });
}

function getSceneName(scene) {
  return scene.id || slugify(window.location.host + window.location.pathname);
}

/**
 * Slugify the string removing non-word chars and spaces
 * @param  {string} text String to slugify
 * @return {string}      Slugified string
 */
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '-') // Replace all non-word chars with -
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}

function getElementData(entity) {
  const elementTree = getAttributes(entity);
  const children = entity.childNodes;
  if (children.length) {
    elementTree['children'] = [];
    for (const child of children) {
      if (child.nodeType === Node.ELEMENT_NODE) {
        elementTree['children'].push(getElementData(child));
      }
    }
  }
  return elementTree;
}

function getAttributes(entity) {
  const elemObj = {};
  elemObj['element'] = entity.tagName.toLowerCase();

  if (entity.id) {
    elemObj['id'] = entity.id;
  }
  if (entity.className) {
    // convert from DOMTokenList to Array
    elemObj['class'] = Array.from(entity.classList);
  }
  if (entity.getAttribute('mixin')) {
    elemObj['mixin'] = entity.getAttribute('mixin');
  }

  const entityComponents = entity.components;
  if (entityComponents) {
    elemObj['components'] = {};
    for (const componentName in entityComponents) {
      const modifiedProperty = getModifiedProperties(entity, componentName);
      if (!isEmpty(modifiedProperty)) {
        elemObj['components'][componentName] = modifiedProperty;
      }
    }
  }
  return elemObj;
}

function isEmpty(object) {
  return object ? Object.keys(object).length === 0 : true;
}

function getModifiedProperties(entity, componentName) {
  const data = entity.components[componentName].data;
  const defaultData = entity.components[componentName].schema;

  // If its single-property like position, rotation, etc
  if (isSingleProperty(defaultData)) {
    const defaultValue = defaultData.default;
    const currentValue = data;
    if ((currentValue || defaultValue) && currentValue !== defaultValue) {
      return data;
    }
  }

  const diff = {};
  for (const key in data) {
    const defaultValue = defaultData[key].default;
    const currentValue = data[key];

    // Some parameters could be null and '' like mergeTo
    if (
      (currentValue || defaultValue) &&
      !AFRAME.utils.deepEqual(currentValue, defaultValue)
    ) {
      diff[key] = data[key];
    }
  }
  return diff;
}

function isSingleProperty(schema) {
  return AFRAME.schema.isSingleProperty(schema);
}

/**
 * Tools and actions.
 */
export default class Toolbar extends Component {
  state = {
    // isPlaying: false,
    isSaveActionActive: false
  };

  makeScreenshot() {
    const sceneElem = AFRAME.scenes[0];
    sceneElem.components.screenshot.capture('perspective');
  }
  // openViewMode() {
  //   AFRAME.INSPECTOR.close();
  // }

  exportSceneToGLTF() {
    ga('send', 'event', 'SceneGraph', 'exportGLTF');
    const sceneName = getSceneName(AFRAME.scenes[0]);
    const scene = AFRAME.scenes[0].object3D;
    filterHelpers(scene, false);
    AFRAME.INSPECTOR.exporters.gltf.parse(
      scene,
      function(buffer) {
        filterHelpers(scene, true);
        const blob = new Blob([buffer], { type: 'application/octet-stream' });
        saveBlob(blob, sceneName + '.glb');
      },
      { binary: true }
    );
  }

  addEntity() {
    Events.emit('entitycreate', { element: 'a-entity', components: {} });
  }

  /**
   * Try to write changes with aframe-inspector-watcher.
   */
  writeChanges = () => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:51234/save');
    xhr.onerror = () => {
      alert(
        'aframe-watcher not running. This feature requires a companion service running locally. npm install aframe-watcher to save changes back to file. Read more at supermedium.com/aframe-watcher'
      );
    };
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(AFRAME.INSPECTOR.history.updates));
  };

  toggleScenePlaying = () => {
    if (this.state.isPlaying) {
      AFRAME.scenes[0].pause();
      this.setState(prevState => ({ ...prevState, isPlaying: false }));
      AFRAME.scenes[0].isPlaying = true;
      document.getElementById('aframeInspectorMouseCursor').play();
      return;
    }
    AFRAME.scenes[0].isPlaying = false;
    AFRAME.scenes[0].play();
    this.setState(prevState => ({ ...prevState, isPlaying: true }));
  };

  toggleSaveActionState = () =>
    this.setState(prevState => ({
      ...prevState,
      isSaveActionActive: !this.state.isSaveActionActive
    }));

  convertToObject = () => {
    const entity = document.getElementById('streets');

    const data = getElementData(entity);

    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify({ data: data })
    )}`;

    const link = document.createElement('a');
    link.href = jsonString;
    link.download = 'data.json';

    link.click();
    link.remove();
  };

  render() {
    // const watcherClassNames = classnames({
    //   button: true,
    //   fa: true,
    //   'fa-save': true
    // });
    // const watcherTitle = 'Write changes with aframe-watcher.';

    return (
      <div id="toolbar">
        <div className="toolbarActions">
          {/* not in use */}
          {/* <a
            className="button fa fa-plus"
            title="Add a new entity"
            onClick={this.addEntity}
          />
          <a
            id="playPauseScene"
            className={
              'button fa ' + (this.state.isPlaying ? 'fa-pause' : 'fa-play')
            }
            title={this.state.isPlaying ? 'Pause scene' : 'Resume scene'}
            onClick={this.toggleScenePlaying}
          /> */}

          {!this.state.isSaveActionActive ? (
            <button
              className={'gltfIcon'}
              type={'button'}
              onClick={this.toggleSaveActionState.bind(this)}
            >
              <div />
              <span>Save</span>
            </button>
          ) : (
            <div className={'saveActions'}>
              <button type={'button'} onClick={this.exportSceneToGLTF}>
                glTF 3D Model
              </button>
              <button type={'button'} onClick={this.convertToObject}>
                3DStreet JSON
              </button>
              <button
                type={'button'}
                className={'closeButton'}
                onClick={this.toggleSaveActionState.bind(this)}
              >
                <span />
                <span />
              </button>
            </div>
          )}
          {!this.state.isSaveActionActive && (
            <button className={'cameraButton'} onClick={this.makeScreenshot} />
          )}
          {/* not is use */}
          {/* <button
            className={"viewButton"}
            type={"button"}
            onClick={this.openViewMode}
          >
            View
          </button> */}

          {/* not in use */}
          {/* <a
            className={watcherClassNames}
            title={watcherTitle}
            onClick={this.writeChanges}
          /> */}
        </div>
      </div>
    );
  }
}
