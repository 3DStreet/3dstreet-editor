import Events from './Events';

export function inputStreetmix() {
  const streetmixURL = prompt(
    'Please enter a Streetmix URL',
    'https://streetmix.net/kfarr/3/example-street'
  );

  setTimeout(function () {
    window.location.hash = streetmixURL;
  });

  const streetContainerEl = document.getElementById('street-container');

  while (streetContainerEl.firstChild) {
    streetContainerEl.removeChild(streetContainerEl.lastChild);
  }

  streetContainerEl.innerHTML =
    '<a-entity street streetmix-loader="streetmixStreetURL: ' +
    streetmixURL +
    '""></a-entity>';

  // update sceneGraph
  Events.emit('entitycreated', streetContainerEl.sceneEl);
}

export function createElementsForScenesFromJSON(streetData) {
  const streetContainerEl = document.getElementById('street-container');

  while (streetContainerEl.firstChild) {
    streetContainerEl.removeChild(streetContainerEl.lastChild);
  }

  if (!Array.isArray(streetData)) {
    console.error('Invalid data format. Expected an array.');
    return;
  }

  createEntities(streetData, streetContainerEl);
}

export function fileJSON(event) {
  let reader = new FileReader();

  reader.onload = function () {
    createElementsFromJSON(reader.result);
  };

  reader.readAsText(event.target.files[0]);
}