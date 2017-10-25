import {getClipboardRepresentation} from '../actions/entity';
const INSPECTOR = require('../lib/inspector.js');

/**
 * Get scene name
 * @param  {Element} scene Scene element
 * @return {string}       Scene ID or slugify from the current path
 */
export function getSceneName (scene) {
  return scene.id || slugify(window.location.host + window.location.pathname);
}

/**
 * Slugify the string removing non-word chars and spaces
 * @param  {string} text String to slugify
 * @return {string}      Slugified string
 */
function slugify (text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '-')      // Replace all non-word chars with -
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

/**
 * Generate a filtered stringify HTML from the current page
 * @return {string} String that contains the filtered HTML of the current page
 */
export function generateHtml () {
  // flushToDOM first because the elements are posibilly modified by user in Inspector.
  var sceneEl = AFRAME.scenes[0];
  sceneEl.flushToDOM(true);

  var parser = new window.DOMParser();
  var xmlDoc = parser.parseFromString(document.documentElement.innerHTML, 'text/html');

  // Remove all the components that are being injected by aframe-inspector or aframe
  // @todo Use custom class to prevent this hack
  var elementsToRemove = xmlDoc.querySelectorAll([
    // Injected by the inspector
    '[data-aframe-inspector]',
    'script[src$="aframe-inspector.js"]',
    'style[type="text/css"]',
    'link[href="http://fonts.googleapis.com/css?family=Roboto%7CRoboto+Mono"]',
    // Injected by aframe
    '[aframe-injected]',
    'style[data-href$="aframe.css"]',
    // Injected by stats
    '.rs-base',
    '.a-canvas',
    'style[data-href$="rStats.css"]'
  ].join(','));
  for (var i = 0; i < elementsToRemove.length; i++) {
    var el = elementsToRemove[i];
    el.parentNode.removeChild(el);
  }

  var root = xmlDoc.documentElement; // eslint-disable-line no-unused-vars
  var sceneTemp = xmlDoc.createElement('a-scene-temp');

  var scene = xmlDoc.getElementsByTagName('a-scene')[0];

  scene.parentNode.replaceChild(sceneTemp, scene);

  // Activate the previous scene camera, and prevent the inspector from reactive its camera
  INSPECTOR.opened = false;
  INSPECTOR.currentCameraEl.setAttribute('camera', 'active', true);

  var output = xmlToString(xmlDoc)
    .replace('<a-scene-temp></a-scene-temp>', getClipboardRepresentation(sceneEl))
    .replace('aframe-inspector-opened', '');

  // Activate the inspector camera again
  INSPECTOR.opened = true;
  INSPECTOR.inspectorCameraEl.setAttribute('camera', 'active', true);

  return output;
}

/**
 * Returns the string representation of a XML
 * @param  {Document} xmlData XML to stringify
 * @return {string}         String representation of the XML document
 */
function xmlToString (xmlData) {
  var xmlString;
  // IE
  if (window.ActiveXObject) {
    xmlString = xmlData.xml;
  } else {
    // Mozilla, Firefox, Opera, etc.
    xmlString = (new window.XMLSerializer()).serializeToString(xmlData);
  }
  return xmlString;
}
