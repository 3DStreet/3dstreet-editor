import Events from './Events';

export function inputStreetmix() {
  const streetmixURL = prompt(
    'Please enter a Streetmix URL',
    'https://streetmix.net/kfarr/3/example-street'
  );

  // clrear scene data, create new blank scene.
  // clearMetadata = true, clearUrlHash = false
  STREET.utils.newScene(true, false);

  setTimeout(function () {
    window.location.hash = streetmixURL;
  });

  const streetContainerEl = document.getElementById('default-street');
  streetContainerEl.setAttribute(
    'streetmix-loader',
    'streetmixStreetURL',
    streetmixURL
  );

  // update sceneGraph
  Events.emit('entitycreated', streetContainerEl.sceneEl);
}

export function createElementsForScenesFromJSON(streetData) {
  // clrear scene data, create new blank scene.
  // clearMetadata = true, clearUrlHash = true, addDefaultStreet = false
  STREET.utils.newScene(true, false, false);

  const streetContainerEl = document.getElementById('street-container');

  if (!Array.isArray(streetData)) {
    console.error('Invalid data format. Expected an array.');
    return;
  }

  STREET.utils.createEntities(streetData, streetContainerEl);
}

export function fileJSON(event) {
  let reader = new FileReader();

  reader.onload = function () {
    STREET.utils.createElementsFromJSON(reader.result);
    // update sceneGraph
    Events.emit('entitycreated', streetContainerEl.sceneEl);
  };

  reader.readAsText(event.target.files[0]);
}
