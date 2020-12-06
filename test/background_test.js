import {bg, timeLeft, sessionNum, runningCall,
  sulb, timerL, breakL, longbreakL, isFocus, isActive, breakAudio,
  focusAudio, DEFAULT_FOCUS, DEFAULT_ACTIVE, audioPlayed, setupStorageSettings,
  setVarForTesting} from '../code/background.js';

describe('Testing API for background.js', () => {
  // spy to track calls, arguments, and return values of function
  const setRunningCall = sinon.spy(bg.setRunningCall);
  const startTimer = sinon.spy(bg.startTimer);
  const pauseTimer = sinon.spy(bg.pauseTImer);
  const resetTimer = sinon.spy(bg.resetTimer);
  const setTime = sinon.spy(bg.setTime);
  const getTime = sinon.spy(bg.getTime);
  const getTimer = sinon.spy(bg.getTimer);
  const setSettings = sinon.spy(bg.setSettings);
  const setupStorageSettings_spy = sinon.spy(setupStorageSettings);
  const defaultSettings = {
    'timeLeft': undefined,
    'sessionNum': 0,
    'runningCall': undefined,
    'sulb': undefined,
    'timerL': undefined,
    'breakL': undefined,
    'longbreakL': undefined,
    'isFocus': undefined,
    'isActive': undefined,
    'audioPlayed': 'none',
  };

  afterEach(function() {
    startTimer.resetHistory();
    pauseTImer.resetHistory();
    resetTimer.resetHistory();
    setTime.resetHistory();
    getTime.resetHistory();
    getTimer.resetHistory();
    setSettings.resetHistory();
    setVarForTesting(defaultSettings);
  });

  it('constants and variables initialized correctly', () => {
    chai.expect(timeLeft).to.be.undefined;
    chai.expect(sessionNum).to.equal(0);
    chai.expect(runningCall).to.be.undefined;
    chai.expect(sulb).to.be.undefined;
    chai.expect(timerL).to.be.undefined;
    chai.expect(breakL).to.be.undefined;
    chai.expect(longbreakL).to.be.undefined;
    chai.expect(isFocus).to.be.undefined;
    chai.expect(isActive).to.be.undefined;
    chai.expect(breakAudio).to.be.an('Object');
    chai.expect(focusAudio).to.be.an('Object');
    chai.expect(DEFAULT_FOCUS).to.equal(true);
    chai.expect(DEFAULT_ACTIVE).to.equal(false);
  });

  it('setSettings handled correctly', () => {
    chai.expect(setSettings.called).to.equal(false);
    // try setting settings with this
    const settings = {
      'timerL': 103,
      'breakL': 36,
      'SULB': 7,
      'longbreakL': 66,
    };
    const request = {
      'settings': settings,
    };
    chai.assert.ok(setSettings(request));
    chai.expect(setSettings.calledOnce).to.equal(true);
    chai.expect(sessionNum).to.equal(0);
    chai.expect(timerL).to.equal(request.settings.timerL);
    chai.expect(breakL).to.equal(request.settings.breakL);
    chai.expect(sulb).to.equal(request.settings.SULB);
    chai.expect(longbreakL).to.equal(request.settings.longbreakL);
    // check that function cannot take arguments
    chai.expect(function() {
        setSettings(1);
      }).to.throw(TypeError);
  });

  it('startTimer handled correctly', () => {
    chai.expect(startTimer.called).to.equal(false);
    chai.expect(setRunningCall.called).to.equal(false);
    chai.assert.ok(startTimer());
    chai.expect(startTimer.calledOnce).to.equal(true);
    chai.expect(isActive).to.equal(true);
    chai.expect(timeLeft).to.equal(timerL);
    chai.expect(isFocus).to.equal(DEFAULT_FOCUS);
    chai.expect(runningCall).to.not.be.undefined;
    // need to clearinterval so test can end
    clearInterval(runningCall);
  });

  it('setRunningCall functions correctly', () => {
    chai.expect(setRunningCall.called).to.equal(false);
    chai.assert.ok(setRunningCall());
    chai.expect(setRunningCall.calledOnce).to.equal(true);

    const settings = {
      'timeLeft': 1,
      'sessionNum': 0,
      'runningCall': undefined,
      'sulb': 2,
      'timerL': 1,
      'breakL': 2,
      'longbreakL': 5,
      'isFocus': true,
      'isActive': true,
      'audioPlayed': 'none',
    };
    setVarForTesting(settings);
    // timeLeft should decrement
    chai.assert.ok(setRunningCall());
    chai.expect(setRunningCall.calledTwice).to.equal(true);
    chai.expect(audioPlayed).to.equal('none');
    chai.expect(sessionNum).to.equal(settings.sessionNum);
    chai.expect(isFocus).to.equal(settings.isFocus);
    chai.expect(timeLeft).to.equal(settings.timeLeft-1);
    // break audio plays, sessionNum increments,
    // switch to break state, timeLeft = breakL
    chai.assert.ok(setRunningCall());
    chai.expect(setRunningCall.calledThrice).to.equal(true);
    chai.expect(audioPlayed).to.equal('break');
    chai.expect(sessionNum).to.equal(settings.sessionNum + 1);
    chai.expect(isFocus).to.equal(!settings.isFocus);
    chai.expect(timeLeft).to.equal(settings.breakL);
    // timeLeft should decrement
    chai.assert.ok(setRunningCall());
    chai.expect(audioPlayed).to.equal('break');
    chai.expect(sessionNum).to.equal(settings.sessionNum + 1);
    chai.expect(isFocus).to.equal(!settings.isFocus);
    chai.expect(timeLeft).to.equal(settings.breakL - 1);
    // timeLeft should decrement
    chai.assert.ok(setRunningCall());
    chai.expect(audioPlayed).to.equal('break');
    chai.expect(sessionNum).to.equal(settings.sessionNum + 1);
    chai.expect(isFocus).to.equal(!settings.isFocus);
    chai.expect(timeLeft).to.equal(settings.breakL - 2);
    // focus audio plays, switch to focus state, timeLeft = timerL
    chai.assert.ok(setRunningCall());
    chai.expect(audioPlayed).to.equal('focus');
    chai.expect(sessionNum).to.equal(settings.sessionNum + 1);
    chai.expect(isFocus).to.equal(settings.isFocus);
    chai.expect(timeLeft).to.equal(settings.timerL);
    // timer decrements
    chai.assert.ok(setRunningCall());
    chai.expect(audioPlayed).to.equal('focus');
    chai.expect(sessionNum).to.equal(settings.sessionNum + 1);
    chai.expect(isFocus).to.equal(settings.isFocus);
    chai.expect(timeLeft).to.equal(settings.timerL - 1);
    // break audio plays, sessionNum increments
    // switch to break state, timeLeft = longbreakL
    chai.assert.ok(setRunningCall());
    chai.expect(audioPlayed).to.equal('break');
    chai.expect(sessionNum).to.equal(settings.sessionNum + 2);
    chai.expect(isFocus).to.equal(!settings.isFocus);
    chai.expect(timeLeft).to.equal(settings.longbreakL);
  });

  it('pauseTImer handled correctly', () => {
    chai.expect(pauseTImer.called).to.equal(false);
    chai.assert.ok(pauseTImer());
    chai.expect(pauseTImer.calledOnce).to.equal(true);
    chai.expect(isActive).to.equal(false);
    chai.expect(runningCall).to.equal(false);
  });

  it('resetTimer handled correctly', () => {
    const settings = {
      'timeLeft': 10,
      'sessionNum': 10,
      'runningCall': undefined,
      'timerL': 500,
      'isFocus': !DEFAULT_FOCUS,
      'isActive': !DEFAULT_ACTIVE,
    };
    setVarForTesting(settings);

    chai.expect(resetTimer.called).to.equal(false);
    chai.assert.ok(resetTimer());
    chai.expect(resetTimer.calledOnce).to.equal(true);
    chai.expect(sessionNum).to.equal(0);
    chai.expect(timeLeft).to.equal(settings.timerL);
    chai.expect(isActive).to.equal(DEFAULT_ACTIVE);
    chai.expect(isFocus).to.equal(DEFAULT_FOCUS);
    chai.expect(runningCall).to.equal(false);
  });

  it('setTime handled correctly', () => {
    const request = {
      'timeLeft': 10,
    };

    chai.expect(setTime.called).to.equal(false);
    chai.assert.ok(setTime(request));
    chai.expect(setTime.calledOnce).to.equal(true);
    chai.expect(timeLeft).to.equal(request.timeLeft);
  });

  it('getTime handled correctly', () => {
    const request = {
      'timeLeft': 545,
    };
    const settings = {
      'timeLeft': 666,
    };
    setVarForTesting(settings);
    chai.expect(getTime.called).to.equal(false);
    chai.assert.ok(getTime(request));
    chai.expect(getTime.calledOnce).to.equal(true);
    chai.expect(getTime.returnValues[0].timeLeft).to.equal(settings.timeLeft);
  });

  it('getTimer handled correctly', () => {
    chai.expect(getTimer.called).to.equal(false);
    chai.assert.ok(getTimer());
    chai.expect(getTimer.calledOnce).to.equal(true);
    chai.expect(timeLeft).to.equal(0);
    chai.expect(isActive).to.equal(DEFAULT_ACTIVE);
    chai.expect(isFocus).to.equal(DEFAULT_FOCUS);
    chai.expect(getTimer.returnValues[0].timeLeft).to.equal(0);
    chai.expect(getTimer.returnValues[0].isActive).to.equal(DEFAULT_ACTIVE);
    chai.expect(getTimer.returnValues[0].isFocus).to.equal(DEFAULT_FOCUS);
    const settings = {
      'timeLeft': 123,
      'isActive': !DEFAULT_ACTIVE,
      'isFocus': !DEFAULT_FOCUS,
    };
    setVarForTesting(settings);
    chai.assert.ok(getTimer());
    chai.expect(getTimer.returnValues[1].timeLeft).to.equal(
      settings.timeLeft);
    chai.expect(getTimer.returnValues[1].isActive).to.equal(settings.isActive);
    chai.expect(getTimer.returnValues[1].isFocus).to.equal(settings.isFocus);
  });

  it('setupStorageSettings functions correctly', () => {
    chai.expect(setupStorageSettings_spy.called).to.equal(false);
    const value = {
      'timerL': 13,
      'breakL': 33,
      'SULB': 27,
      'longbreakL': 9,
    };
    chai.assert.ok(setupStorageSettings_spy(value));
    chai.expect(setupStorageSettings_spy.calledOnce).to.equal(true);
    chai.expect(timerL).to.equal(value.timerL);
    chai.expect(breakL).to.equal(value.breakL);
    chai.expect(sulb).to.equal(value.SULB);
    chai.expect(longbreakL).to.equal(value.longbreakL);
    chai.expect(timeLeft).to.equal(value.timerL);
  });
});
