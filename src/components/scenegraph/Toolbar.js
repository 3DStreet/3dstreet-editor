import { Button, ScreenshotButton } from '../components';
import { Load24Icon, Save24Icon } from '../../icons';
import { fileJSON, inputStreetmix } from '../../lib/toolbar';

import React, { Component } from 'react';
import Events from '../../lib/Events';
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
  constructor(props) {
    super(props);
    this.state = {
      // isPlaying: false,
      isSaveActionActive: false,
      isLoadActionActive: false,
      isCapturingScreen: false,
      showSaveBtn: true,
      showLoadBtn: true
    };
    this.loadButtonRef = React.createRef();
    this.saveButtonRef = React.createRef();
  }

  componentDidMount() {
    document.addEventListener('click', this.handleClickOutsideLoad);
    document.addEventListener('click', this.handleClickOutsideSave);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickOutsideLoad);
    document.removeEventListener('click', this.handleClickOutsideSave);
  }

  handleClickOutsideLoad = (event) => {
    if (
      this.loadButtonRef.current &&
      !this.loadButtonRef.current.contains(event.target)
    ) {
      this.setState({ isLoadActionActive: false });
    }
  };

  handleClickOutsideSave = (event) => {
    if (
      this.saveButtonRef.current &&
      !this.saveButtonRef.current.contains(event.target)
    ) {
      this.setState({ isSaveActionActive: false });
    }
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
      // use vanilla js to create an img element as destination for our screenshot
      const imgHTML = '<img id="screentock-destination">';
      // Set the screenshot in local storage
      localStorage.setItem('screenshot', JSON.stringify(imgHTML));
      AFRAME.scenes[0].setAttribute('screentock', 'type', 'img');
      AFRAME.scenes[0].setAttribute(
        'screentock',
        'imgElementSelector',
        '#screentock-destination'
      );
      // take the screenshot
      AFRAME.scenes[0].setAttribute('screentock', 'takeScreenshot', true);
      setTimeout(() => resolve(), 1000);
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

  toggleSaveActionState = () => {
    this.setState((prevState) => ({
      isSaveActionActive: !prevState.isSaveActionActive
    }));
  };

  toggleLoadActionState = () => {
    this.setState((prevState) => ({
      isLoadActionActive: !prevState.isLoadActionActive
    }));
  };

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
          {this.state.showSaveBtn && (
            <div className="saveButtonWrapper" ref={this.saveButtonRef}>
              <Button
                className={'actionBtn'}
                onClick={this.toggleSaveActionState.bind(this)}
              >
                <div
                  className="iconContainer"
                  style={{
                    display: 'flex',
                    margin: '-2.5px 0px -2.5px -2px'
                  }}
                >
                  <Save24Icon />
                </div>
                <div className={'innerText'}>Save</div>
              </Button>
              {this.state.isSaveActionActive && (
                <div className="dropdownedButtons">
                  <Button onClick={this.exportSceneToGLTF} variant="white">
                    <div
                      className="icon"
                      style={{
                        display: 'flex',
                        margin: '-2.5px 0px -2.5px -2px'
                      }}
                    >
                      <Save24Icon />
                    </div>
                    Download glTF
                  </Button>
                  <Button onClick={this.convertToObject} variant="white">
                    <div
                      className="icon"
                      style={{
                        display: 'flex',
                        margin: '-2.5px 0px -2.5px -2px'
                      }}
                    >
                      <Save24Icon />
                    </div>
                    Download 3DStreet JSON
                  </Button>
                </div>
              )}
            </div>
          )}

          {this.state.showLoadBtn && (
            <div className="saveButtonWrapper" ref={this.loadButtonRef}>
              <Button
                className={'actionBtn'}
                onClick={this.toggleLoadActionState}
              >
                <div
                  className="iconContainer"
                  style={{
                    display: 'flex',
                    margin: '-2.5px 0px -2.5px -2px'
                  }}
                >
                  <Load24Icon />
                </div>
                <div className={'innerText'}>Open</div>
              </Button>
              {this.state.isLoadActionActive && (
                <div className="dropdownedButtons">
                  <Button onClick={inputStreetmix} variant="white">
                    <div
                      className="icon"
                      style={{
                        display: 'flex',
                        margin: '-2.5px 0px -2.5px -2px'
                      }}
                    >
                      <Load24Icon />
                    </div>
                    Streetmix URL
                  </Button>
                  <Button variant="white">
                    <div
                      className="icon"
                      style={{
                        display: 'flex',
                        margin: '-2.5px 0px -2.5px -2px'
                      }}
                    >
                      <Load24Icon />
                    </div>
                    <label
                      style={{
                        display: 'inherit',
                        alignItems: 'center',
                        cursor: 'pointer'
                      }}
                    >
                      <input
                        type="file"
                        onChange={fileJSON}
                        style={{ display: 'none' }}
                        accept=".js, .json, .txt"
                      />
                      3DStreet JSON
                    </label>
                  </Button>
                </div>
              )}
            </div>
          )}
          <div
            onClick={() =>
              this.setState((prevState) => ({
                ...prevState,
                isCapturingScreen: true
              }))
            }
            className={'cameraButton'}
          >
            <ScreenshotButton />
          </div>
        </div>
      </div>
    );
  }
}
