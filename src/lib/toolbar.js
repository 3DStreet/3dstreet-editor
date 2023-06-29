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

function getValidJSON(stringJSON) {
  return stringJSON
    .replace(/\'/g, '')
    .replace(/\n/g, '')
    .replace(/[\u0000-\u0019]+/g, '');
}

function createElementsFromJSON(streetJSONString) {
  const validJSONString = getValidJSON(streetJSONString);
  const streetContainerEl = document.getElementById('street-container');
  while (streetContainerEl.firstChild) {
    streetContainerEl.removeChild(streetContainerEl.lastChild);
  }
  const streetObject = JSON.parse(validJSONString);
  createEntities(streetObject.data, streetContainerEl);
  // update sceneGraph
  Events.emit('entitycreated', streetContainerEl.sceneEl);
}

export function fileJSON(event) {
  let reader = new FileReader();
  console.log(event.target.files[0]);
  reader.onload = function () {
    createElementsFromJSON(reader.result);
  };
  reader.readAsText(event.target.files[0]);
}
