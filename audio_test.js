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

describe('Testing Audio in background.js', () => {
  // spy to track calls, arguments, and return values of function
  const handler = sinon.spy(bg.handler);
  const startBreak = sinon.spy(bg.setBreak);
  const startFocus = sinon.spy(bg.startFocus);
  const playNotification = sinon.spy(bg.playNotification);
  //const mock = sinon.mock(Audio());
  //const expectation = mock.expects("play");
  beforeEach(function() {
    handler.resetHistory();
    startBreak.resetHistory();
    startFocus.resetHistory();
    playNotification.resetHistory();
    global.mocha = true;
  });

  it('checks startBreak works properly', () => {
    expectation.never();
	expectation.verify();
    chai.expect(spy.called).to.equal(false);
    chai.assert.ok(spy({cmd: 'START_TIMER'}));
    chai.expect(spy.calledOnce).to.equal(true);
    chai.expect(spy.lastCall.args[0].cmd).to.equal('START_TIMER');
    chai.expect(spy.returnValues[0].timeLeft).to.equal(DEFAULT_FOCUS_TIME);
    chai.expect(spy.returnValues[0].isActive).to.equal(true);
    chai.expect(spy.returnValues[0].isFocus).to.equal(DEFAULT_FOCUS);
	
  });
  
  it('checks startFocus works properly', () => {
    expectation.never();
	expectation.verify();
    chai.expect(spy.called).to.equal(false);
    chai.assert.ok(spy({cmd: 'START_TIMER'}));
    chai.expect(spy.calledOnce).to.equal(true);
    chai.expect(spy.lastCall.args[0].cmd).to.equal('START_TIMER');
    chai.expect(spy.returnValues[0].timeLeft).to.equal(DEFAULT_FOCUS_TIME);
    chai.expect(spy.returnValues[0].isActive).to.equal(true);
    chai.expect(spy.returnValues[0].isFocus).to.equal(DEFAULT_FOCUS);
	
  });
  
  it('checks playNotification works properly', () => {
    expectation.never();
	expectation.verify();
    chai.expect(spy.called).to.equal(false);
    chai.assert.ok(spy({cmd: 'START_TIMER'}));
    chai.expect(spy.calledOnce).to.equal(true);
    chai.expect(spy.lastCall.args[0].cmd).to.equal('START_TIMER');
    chai.expect(spy.returnValues[0].timeLeft).to.equal(DEFAULT_FOCUS_TIME);
    chai.expect(spy.returnValues[0].isActive).to.equal(true);
    chai.expect(spy.returnValues[0].isFocus).to.equal(DEFAULT_FOCUS);
	
  });

  it('checks notification sounds played', () => {
    expectation.never();
	expectation.verify();
    chai.expect(spy.called).to.equal(false);
    chai.assert.ok(spy({cmd: 'START_TIMER'}));
    chai.expect(spy.calledOnce).to.equal(true);
    chai.expect(spy.lastCall.args[0].cmd).to.equal('START_TIMER');
    chai.expect(spy.returnValues[0].timeLeft).to.equal(DEFAULT_FOCUS_TIME);
    chai.expect(spy.returnValues[0].isActive).to.equal(true);
    chai.expect(spy.returnValues[0].isFocus).to.equal(DEFAULT_FOCUS);
	
  });
});
