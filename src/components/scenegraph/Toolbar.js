import { Camera32Icon, Cross32Icon, Save24Icon } from '../../icons';

import { Button } from '../components';
import { Component } from 'react';
import Events from '../../lib/Events';
import { SavingModal } from '../modals/SavingModal';
import { saveBlob } from '../../lib/utils';

// const LOCALSTORAGE_MOCAP_UI = "aframeinspectormocapuienabled";

function filterHelpers(scene, visible) {
  scene.traverse((o) => {
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
    .replace(/[^\w-]+/g, '-') // Replace all non-word chars with -
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}

/**
 * Tools and actions.
 */
export default class Toolbar extends Component {
  state = {
    // isPlaying: false,
    isSaveActionActive: false,
    isCapturingScreen: false
  };

  convertToObject = () => {
    const entity = document.getElementById('street-container');

    const data = convertDOMElToObject(entity);

    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      //JSON.stringify(data)
      filterJSONstreet(removeProps, renameProps, data)
    )}`;

    const link = document.createElement('a');
    link.href = jsonString;
    link.download = 'data.json';

    link.click();
    link.remove();
  };

  makeScreenshot = (component) =>
    new Promise((resolve) => {
      const sceneElem = AFRAME.scenes[0];
      sceneElem.components.screenshot.capture('perspective');
      setTimeout(() => resolve(), 2000);
    }).then(() => {
      component &&
        component.setState((prevState) => ({
          ...prevState,
          isCapturingScreen: false
        }));
    });

  componentDidUpdate() {
    if (this.state.isCapturingScreen) {
      this.makeScreenshot(this);
    }
  }
  // openViewMode() {
  //   AFRAME.INSPECTOR.close();
  // }

  exportSceneToGLTF() {
    if (typeof ga !== 'undefined') {
      ga('send', 'event', 'SceneGraph', 'exportGLTF');
    }
    const sceneName = getSceneName(AFRAME.scenes[0]);
    const scene = AFRAME.scenes[0].object3D;
    filterHelpers(scene, false);
    AFRAME.INSPECTOR.exporters.gltf.parse(
      scene,
      function (buffer) {
        filterHelpers(scene, true);
        const blob = new Blob([buffer], { type: 'application/octet-stream' });
        saveBlob(blob, sceneName + '.glb');
      },
      function (error) {
        console.error(error);
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
      this.setState((prevState) => ({ ...prevState, isPlaying: false }));
      AFRAME.scenes[0].isPlaying = true;
      document.getElementById('aframeInspectorMouseCursor').play();
      return;
    }
    AFRAME.scenes[0].isPlaying = false;
    AFRAME.scenes[0].play();
    this.setState((prevState) => ({ ...prevState, isPlaying: true }));
  };

  toggleSaveActionState = () =>
    this.setState((prevState) => ({
      ...prevState,
      isSaveActionActive: !this.state.isSaveActionActive
    }));

  render() {
    // const watcherClassNames = classNames({
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
            <Button onClick={this.toggleSaveActionState.bind(this)}>
              <div
                style={{
                  display: 'flex',
                  margin: '-2.5px 0px -2.5px -2px'
                }}
              >
                <Save24Icon />
              </div>
              Save
            </Button>
          ) : (
            <div className={'saveActions'}>
              <Button onClick={this.exportSceneToGLTF}>glTF 3D Model</Button>
              <Button onClick={this.convertToObject}>3DStreet JSON</Button>
              
              <Button
                className={'closeButton'}
                onClick={this.toggleSaveActionState.bind(this)}
              >
                <div style={{ display: 'flex', margin: '-6.5px -10.5px' }}>
                  <Cross32Icon />
                </div>
              </Button>
            </div>
          )}
          {!this.state.isSaveActionActive && (
            <Button
              onClick={() =>
                this.setState((prevState) => ({
                  ...prevState,
                  isCapturingScreen: true
                }))
              }
              className={'cameraButton'}
            >
              <div style={{ display: 'flex', margin: '-6.5px -10.5px' }}>
                <Camera32Icon />
              </div>
            </Button>
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
            className="gltfIcon"
            title="Export to GLTF"
            onClick={this.exportSceneToGLTF}
          >
            <img src={GLTFIcon} />
          </a>
          <a
            className={watcherClassNames}
            title={watcherTitle}
            onClick={this.writeChanges}
          /> */}

          {this.state.isCapturingScreen && <SavingModal />}
        </div>
      </div>
    );
  }
}
