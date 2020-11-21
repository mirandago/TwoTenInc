const sinon = require('sinon');
const chai = require('chai');
const chrome = require('sinon-chrome/extensions');
global.chrome = chrome;

const path = '../code/mocha_test/background_for_test.js';
const bg = require(path);
const DEFAULT_FOCUS_TIME = require(path).DEFAULT_FOCUS_TIME;
const DEFAULT_BREAK_TIME = require(path).DEFAULT_BREAK_TIME;
const DEFAULT_FOCUS = require(path).DEFAULT_FOCUS;
const DEFAULT_ACTIVE = require(path).DEFAULT_ACTIVE;

describe('Testing API for background.js', () => {
  // spy to track calls, arguments, and return values of function
  const spy = sinon.spy(bg.handler);
  beforeEach(function() {
    spy.resetHistory();
  });

  it('constants defined correctly', () => {
    chai.expect(DEFAULT_FOCUS_TIME).to.equal(10);
    chai.expect(DEFAULT_BREAK_TIME).to.equal(5);
    chai.expect(DEFAULT_FOCUS).to.equal(true);
    chai.expect(DEFAULT_ACTIVE).to.equal(false);
  });

  it('GET_TIME handled correctly', () => {
    chai.expect(spy.called).to.equal(false);
    chai.assert.ok(spy({cmd: 'GET_TIME'}));
    chai.expect(spy.calledOnce).to.equal(true);
    chai.expect(spy.lastCall.args[0].cmd).to.equal('GET_TIME');
    chai.expect(spy.returnValues[0].timeLeft).to.equal(undefined);
    chai.expect(spy.returnValues[0].isActive).to.equal(undefined);
    chai.expect(spy.returnValues[0].isFocus).to.equal(undefined);
  });

  it('SET_TIME handled correctly', () => {
    chai.expect(spy.called).to.equal(false);
    chai.assert.ok(spy({cmd: 'SET_TIME', timeLeft: 100}));
    chai.expect(spy.calledOnce).to.equal(true);
    chai.expect(spy.lastCall.args[0].cmd).to.equal('SET_TIME');
    chai.expect(spy.lastCall.args[0].timeLeft).to.equal(100);
    chai.expect(spy.returnValues[0].timeLeft).to.equal(
      spy.lastCall.args[0].timeLeft);
    chai.expect(spy.returnValues[0].isActive).to.equal(undefined);
    chai.expect(spy.returnValues[0].isFocus).to.equal(undefined);
    spy({cmd: 'SET_TIME'}); // reset for other tests
  });

  it('PAUSE_TIMER handled correctly', () => {
    chai.expect(spy.called).to.equal(false);
    chai.assert.ok(spy({cmd: 'PAUSE_TIMER'}));
    chai.expect(spy.calledOnce).to.equal(true);
    chai.expect(spy.lastCall.args[0].cmd).to.equal('PAUSE_TIMER');
    chai.expect(spy.returnValues[0].timeLeft).to.equal(undefined);
    chai.expect(spy.returnValues[0].isActive).to.equal(false);
    chai.expect(spy.returnValues[0].isFocus).to.equal(undefined);
  });

  it('GET_TIMER handled correctly', () => {
    chai.expect(spy.called).to.equal(false);
    chai.assert.ok(spy({cmd: 'GET_TIMER'}));
    chai.expect(spy.calledOnce).to.equal(true);
    chai.expect(spy.lastCall.args[0].cmd).to.equal('GET_TIMER');
    chai.expect(spy.returnValues[0].timeLeft).to.equal(DEFAULT_FOCUS_TIME);
    chai.expect(spy.returnValues[0].isActive).to.equal(DEFAULT_ACTIVE);
    chai.expect(spy.returnValues[0].isFocus).to.equal(DEFAULT_FOCUS);
    spy({cmd: 'SET_TIME'}); // reset for other tests
  });

  it('START_TIMER handled correctly', () => {
    chai.expect(spy.called).to.equal(false);
    chai.assert.ok(spy({cmd: 'START_TIMER'}));
    chai.expect(spy.calledOnce).to.equal(true);
    chai.expect(spy.lastCall.args[0].cmd).to.equal('START_TIMER');
    chai.expect(spy.returnValues[0].timeLeft).to.equal(DEFAULT_FOCUS_TIME);
    chai.expect(spy.returnValues[0].isActive).to.equal(true);
    chai.expect(spy.returnValues[0].isFocus).to.equal(DEFAULT_FOCUS);
    // cannot test runningCall and setInterval
  });

  it('RESET_TIMER handled correctly', () => {
    chai.expect(spy.called).to.equal(false);
    chai.assert.ok(spy({cmd: 'RESET_TIMER'}));
    chai.expect(spy.calledOnce).to.equal(true);
    chai.expect(spy.lastCall.args[0].cmd).to.equal('RESET_TIMER');
    chai.expect(spy.returnValues[0].timeLeft).to.equal(DEFAULT_FOCUS_TIME);
    chai.expect(spy.returnValues[0].isActive).to.equal(DEFAULT_ACTIVE);
    chai.expect(spy.returnValues[0].isFocus).to.equal(DEFAULT_FOCUS);
  });
});
