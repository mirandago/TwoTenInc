import {bg, timeLeft, sessionNum, runningCall,
sulb, timerL, breakL, longbreakL, isFocus, isActive, breakAudio, 
focusAudio, DEFAULT_FOCUS, DEFAULT_ACTIVE, audioPlayed, setupStorageSettings,
setVarForTesting} from '../code/background.js';

describe('Testing API for background.js', () => {
  // spy to track calls, arguments, and return values of function
  const setRunningCall = sinon.spy(bg.setRunningCall);
  const start_timer = sinon.spy(bg.start_timer);
  const pause_timer = sinon.spy(bg.pause_timer);
  const reset_timer = sinon.spy(bg.reset_timer);
  const set_time = sinon.spy(bg.set_time);
  const get_time = sinon.spy(bg.get_time);
  const get_timer = sinon.spy(bg.get_timer);
  const set_settings = sinon.spy(bg.set_settings);
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
  }
  
  
  afterEach(function() {
    start_timer.resetHistory();
    pause_timer.resetHistory();
    reset_timer.resetHistory();
    set_time.resetHistory();
    get_time.resetHistory();
    get_timer.resetHistory();
    set_settings.resetHistory();
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
  
  it('SET_SETTINGS handled correctly', () => {
    chai.expect(set_settings.called).to.equal(false);
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
    chai.assert.ok(set_settings(request));
    chai.expect(set_settings.calledOnce).to.equal(true); 
    chai.expect(sessionNum).to.equal(0);
    chai.expect(timerL).to.equal(request.settings.timerL);
    chai.expect(breakL).to.equal(request.settings.breakL);
    chai.expect(sulb).to.equal(request.settings.SULB);
    chai.expect(longbreakL).to.equal(request.settings.longbreakL);
    // check that function cannot take arguments
    chai.expect(function () {set_settings(1);}).to.throw(TypeError);
  });

  it('START_TIMER handled correctly', () => {
    chai.expect(start_timer.called).to.equal(false);
    chai.expect(setRunningCall.called).to.equal(false);
    chai.assert.ok(start_timer());
    chai.expect(start_timer.calledOnce).to.equal(true);
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
  
  it('PAUSE_TIMER handled correctly', () => {
    chai.expect(pause_timer.called).to.equal(false);
    chai.assert.ok(pause_timer());
    chai.expect(pause_timer.calledOnce).to.equal(true);
    chai.expect(isActive).to.equal(false);
    chai.expect(runningCall).to.equal(false);
  });
  
  it('RESET_TIMER handled correctly', () => {
    const settings = {
      'timeLeft': 10,
      'sessionNum': 10,
      'runningCall': undefined,
      'timerL': 500,
      'isFocus': !DEFAULT_FOCUS,
      'isActive': !DEFAULT_ACTIVE,
    };
    setVarForTesting(settings);
    
    chai.expect(reset_timer.called).to.equal(false);
    chai.assert.ok(reset_timer());
    chai.expect(reset_timer.calledOnce).to.equal(true);
    chai.expect(sessionNum).to.equal(0);
    chai.expect(timeLeft).to.equal(settings.timerL);
    chai.expect(isActive).to.equal(DEFAULT_ACTIVE);
    chai.expect(isFocus).to.equal(DEFAULT_FOCUS);
    chai.expect(runningCall).to.equal(false);
  });
  
  it('SET_TIME handled correctly', () => {
    const request = {
      'timeLeft': 10,
    };    
    
    chai.expect(set_time.called).to.equal(false);
    chai.assert.ok(set_time(request));
    chai.expect(set_time.calledOnce).to.equal(true);
    chai.expect(timeLeft).to.equal(request.timeLeft);
  });
  
  it('GET_TIME handled correctly', () => {
    const request = {
      'timeLeft': 545,
    };    
    const settings = {
      'timeLeft': 666,
    };
    setVarForTesting(settings);
    chai.expect(get_time.called).to.equal(false);
    chai.assert.ok(get_time(request));
    chai.expect(get_time.calledOnce).to.equal(true);
    chai.expect(get_time.returnValues[0].timeLeft).to.equal(settings.timeLeft);
  });
  
  it('GET_TIMER handled correctly', () => {
    chai.expect(get_timer.called).to.equal(false);
    chai.assert.ok(get_timer());
    chai.expect(get_timer.calledOnce).to.equal(true);
    chai.expect(timeLeft).to.equal(0);
    chai.expect(isActive).to.equal(DEFAULT_ACTIVE);
    chai.expect(isFocus).to.equal(DEFAULT_FOCUS);
    chai.expect(get_timer.returnValues[0].timeLeft).to.equal(0);    
    chai.expect(get_timer.returnValues[0].isActive).to.equal(DEFAULT_ACTIVE);
    chai.expect(get_timer.returnValues[0].isFocus).to.equal(DEFAULT_FOCUS);  
    const settings = {
      'timeLeft': 123,
      'isActive': !DEFAULT_ACTIVE,
      'isFocus': !DEFAULT_FOCUS,
    };
    setVarForTesting(settings);
    chai.assert.ok(get_timer());
    chai.expect(get_timer.returnValues[1].timeLeft).to.equal(settings.timeLeft);    
    chai.expect(get_timer.returnValues[1].isActive).to.equal(settings.isActive);
    chai.expect(get_timer.returnValues[1].isFocus).to.equal(settings.isFocus);    
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
