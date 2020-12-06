import {JSDOM} from 'jsdom';
import chai from 'chai';
import sinon from 'sinon';
import chrome from 'sinon-chrome';
import Audio from 'mock-audio-element';

global.Audio = Audio;
global.chrome = chrome;

global.chai = chai;
global.sinon = sinon;

let doc = new JSDOM('<!doctype html><html><body></body></html>');
const win = doc.defaultView;

global.document = doc;
global.window = win;

document.createElement = function(tag) {
  this.tag;
  this.src;
  this.child;
}


