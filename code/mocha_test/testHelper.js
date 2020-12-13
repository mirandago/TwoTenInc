import {JSDOM} from 'jsdom';
import chai from 'chai';
import sinon from 'sinon';
import chrome from 'sinon-chrome';
import Audio from 'mock-audio-element';
import 'mock-local-storage';
import chaiAsPromised from 'chai-as-promised';
 
chai.use(chaiAsPromised); 

global.Audio = Audio;
global.chrome = chrome;

global.chai = chai;
global.sinon = sinon;

const doc = new JSDOM('<!doctype html><html><body></body></html>');
//const win = doc.defaultView;
//console.log(win);

global.document = doc;
global.window = {};
window.localStorage = global.localStorage;

document.createElement = function(tag) {
  this.tag;
  this.src;
  this.child;
};
