import {DEFAULT_TIMERL, DEFAULT_BREAKL, DEFAULT_SULB, DEFAULT_LONGBREAKL,
getSettings, setSettings} from '../code/settingStorage.js';

describe('Testing API for settingStorage.js', () => {
  
  it('check constants correct', () => {
    chai.expect(DEFAULT_TIMERL).to.equal(25);
    chai.expect(DEFAULT_BREAKL).to.equal(5);
    chai.expect(DEFAULT_SULB).to.equal(4);
    chai.expect(DEFAULT_LONGBREAKL).to.equal(15);
  });
  
  describe('test getSettings', () => {      
    const settings = {timerL: 9, breakL: 8, SULB: 7, longbreakL: 6};    
    function checkCallBack(value) {
      return value;
    }    
    const checkCallBackSpy = sinon.spy(checkCallBack);
    
    before(() => {  
      window.localStorage.clear();
      window.localStorage.setItem('mochatest',true); 
    });
    
    beforeEach(() => {
      checkCallBackSpy.resetHistory();
    });
    
    it('test getSettings when undefined', () => { 
      getSettings(checkCallBackSpy);
      const result = checkCallBackSpy.returnValues[0];
      chai.expect(result.timerL).to.equal(DEFAULT_TIMERL);
      chai.expect(result.breakL).to.equal(DEFAULT_BREAKL);
      chai.expect(result.SULB).to.equal(DEFAULT_SULB);
      chai.expect(result.longbreakL).to.equal(DEFAULT_LONGBREAKL);
    });
    
    it('test getSettings when defined', () => { 
      window.localStorage.setItem('timerSetting', JSON.stringify(settings)); 
      getSettings(checkCallBackSpy);
      const result = checkCallBackSpy.returnValues[0];
      chai.expect(result).to.eql(settings);
    });
  });
  
  it('test setSettings', () => {    
    window.localStorage.clear();
    window.localStorage.setItem('mochatest',true); 
    const values = {timerL: 3, breakL: 6, SULB: 9, longbreakL: 12}   
    const setSettingsSpy = sinon.spy(setSettings);
    chai.assert.ok(setSettingsSpy(values));
    chai.expect(JSON.parse(window.localStorage.getItem('timerSetting'))).to.eql(values);
    chai.expect(setSettingsSpy.returnValues[0]).to.eql({cmd: 'SET_SETTINGS', settings: values});
  });
});
