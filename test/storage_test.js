import {testTask, addGroup, getGroups, addTask, getAllTasks, getTasksByGroup, 
deleteTask, completeTask, completeSession} from '../code/storage.js';

describe('Testing API for storage.js', () => {
  // spy to track calls, arguments, and return values of function
  const addGroup = sinon.spy(addGroup);
  const getGroups = sinon.spy(getGroups);
  const addTask = sinon.spy(addTask);
  const getAllTasks = sinon.spy(getAllTasks);
  const getTasksByGroup = sinon.spy(getTasksByGroup);
  const deleteTask = sinon.spy(deleteTask);
  const completeTask = sinon.spy(completeTask);
  const completeSession = sinon.spy(completeSession);
  /*var store = {};

  spyOn(localStorage, 'getItem').andCallFake(function (key) {
    return store[key];
  });
  spyOn(localStorage, 'setItem').andCallFake(function (key, value) {
    return store[key] = value + '';
  });
  spyOn(localStorage, 'clear').andCallFake(function () {
      store = {};
  });*/

  beforeEach(function() {
    addGroup.resetHistory();
    getGroups.resetHistory();
    addTask.resetHistory();
    getAllTasks.resetHistory();
    getTasksByGroup.resetHistory();
    deleteTask.resetHistory();
    completeTask.resetHistory();
    completeSession.resetHistory();
  });
  
  describe('test addGroup', () => {
    it('check initial states', () => {
      chai.expect(addGroup.called).to.equal(false);
    });
    
    it('Run addGroup', async () => {
      await addGroup('this is mocha test');
      chai.expect(addGroup.called).to.equal(true);
    });      
  });
/*
  it('test getGroups', () => {
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
  });*/

  it('test addTask', () => {
    chai.expect(addTask.called).to.equal(false);
    chai.expect(addGroup.called).to.equal(false);
    const d = new Date();
    const date = d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate();
    const task = {
      name: 'mochatest',
      group: 'green',
      session: 4,
      date: date
    }
    addTask(task.name, task.session, task.group);
    chai.expect(addTask.calledOnce).to.equal(true);
    //chai.expect(addGroup.called).to.equal(true);
    
    chai.expect(testTask.name).to.equal(task.name);
    chai.expect(testTask.group).to.equal(task.group);
    chai.expect(testTask.session).to.equal(task.session);
    chai.expect(testTask.sessionCompleted).to.equal(0);
    chai.expect(testTask.date).to.equal(task.date);
    chai.expect(testTask.completed).to.equal(false);
  });
/*
  it('pauseTimer handled correctly', () => {
    chai.expect(pauseTimer.called).to.equal(false);
    chai.assert.ok(pauseTimer());
    chai.expect(pauseTimer.calledOnce).to.equal(true);
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
    chai.expect(setupStorageSettingsSpy.called).to.equal(false);
    const value = {
      'timerL': 13,
      'breakL': 33,
      'SULB': 27,
      'longbreakL': 9,
    };
    chai.assert.ok(setupStorageSettingsSpy(value));
    chai.expect(setupStorageSettingsSpy.calledOnce).to.equal(true);
    chai.expect(timerL).to.equal(value.timerL);
    chai.expect(breakL).to.equal(value.breakL);
    chai.expect(sulb).to.equal(value.SULB);
    chai.expect(longbreakL).to.equal(value.longbreakL);
    chai.expect(timeLeft).to.equal(value.timerL);
  });*/
});
