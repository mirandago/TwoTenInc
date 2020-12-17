import {addGroup, getGroups, addTask, getAllTasks, getTasksByGroup,
  deleteTask, completeTask, completeSession} from '../code/storage.js';

describe('Testing API for storage.js', () => {
  describe('test addGroup', () => {
    before(() => {
      window.localStorage.clear();
      window.localStorage.setItem('mochatest', true);
    });

    it('Run addGroup', async () => {
      chai.expect(window.localStorage.getItem('this is mocha test')).to.be.null;
      return addGroup('this is mocha test')
          .then((value) => {
            chai.expect(value).to.equal(false); // promise resolves to false
          });
      chai.expect(JSON.parse(window.localStorage.getItem('this is mocha test')))
          .to.equal([]);
    });

    it('try adding same group', async () => {
      return addGroup('this is mocha test')
          .then((value) => {
            chai.expect(value).to.equal(true); // promise resolves to true
          });
      chai.expect(JSON.parse(window.localStorage.getItem('this is mocha test')))
          .to.equal([]);
    });
  });

  describe('test getGroups', () => {
    before(() => {
      window.localStorage.clear();
      window.localStorage.setItem('mochatest', true);
    });

    it('when no groups are added', async () => {
      return getGroups()
          .then((value) => {
            chai.expect(value.length).to.equal(1);
            chai.expect(value[0]).to.equal('mochatest');
          });
    });

    it('when one group added', async () => {
      window.localStorage.setItem('Group1', '');
      return getGroups()
          .then((value) => {
            chai.expect(value.length).to.equal(2);
            chai.expect(value).to.eql(['mochatest', 'Group1']);
          });
    });
  });

  describe('test addTask', () => {
    const d = new Date();
    const task1 = {name: 'mochatest', group: 'green', session: 4, 
      sessionCompleted: 0,
      date: d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate(),
      completed: false
    };
    const task2 = {name: 'mochatest2', group: 'green', session: 3, 
      sessionCompleted: 0,
      date: d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate(),
      completed: false
    };

    before(() => {
      window.localStorage.clear();
      window.localStorage.setItem('mochatest', true);
    });

    it('test addTask', async () => {
      chai.expect(window.localStorage.getItem('green')).to.be.null;

      return addTask(task1.name, task1.session, task1.group)
          .then((value) => {
            chai.expect(value).to.equal(false); // because this is new task
          });
      chai.expect(window.localStorage.getItem('green')).to.eql(task1);      
    });

    it('test addTask for different task', async () => {
      chai.expect(window.localStorage.getItem('green')).not.to.be.null;

      return addTask(task2.name, task2.session, task2.group)
          .then((value) => {
            chai.expect(value).to.equal(false); // because this is new task
          });
      chai.expect(window.localStorage.getItem('green')).to.eql(task2);
    });

    it('test addTask for same task', async () => {
      chai.expect(window.localStorage.getItem('green')).not.to.be.null;

      return addTask(task2.name, task2.session, task2.group)
          .then((value) => {
            chai.expect(value).to.equal(true); // because this task exists
          });
      chai.expect(window.localStorage.getItem('green')).to.eql(task2);
    });
  });

  describe('test getAllTasks', () => {
    before(() => {
      window.localStorage.clear();
      window.localStorage.setItem('mochatest', true);
    });

    it('test getAllTasks when no tasks', async () => {
      return getAllTasks()
          .then((value) => {
            chai.expect(value.length).to.equal(0); // no tasks initially
          });
    });

    it('test getAllTasks when one group', async () => {
      window.localStorage.setItem('Group1', JSON.stringify(['task0', 'task1']));
      return getAllTasks()
          .then((value) => {
            chai.expect(value.length).to.equal(2); // 2 tasks in Group1
            chai.expect(value).to.include.members(['task0', 'task1']);
          });
    });

    it('test getAllTasks when two groups', async () => {
      window.localStorage.setItem('Group2', JSON.stringify(['task2', 'task3']));
      return getAllTasks()
          .then((value) => {
            chai.expect(value.length).to.equal(4); // 4 tasks in Group1+Group2
            chai.expect(value)
                .to.include.members(['task0', 'task1', 'task2', 'task3']);
          });
    });
  });

  describe('test getTasksByGroup', () => {
    before(() => {
      window.localStorage.clear();
      window.localStorage.setItem('mochatest', true);
    });

    it('test getTasksByGroup when no group', async () => {
      return getTasksByGroup('Group1')
          .then((value) => {
            chai.expect(value).to.be.null; // no group
          });
    });

    it('test getTasksByGroup when empty group', async () => {
      window.localStorage.setItem('Group1', JSON.stringify([]));
      return getTasksByGroup('Group1')
          .then((value) => {
            chai.expect(value).not.to.be.null; // group exists
            chai.expect(value.length).to.equal(0); // no tasks
          });
    });

    it('test getTasksByGroup when two groups', async () => {
      window.localStorage.setItem('Group1', JSON.stringify(['task0', 'task1']));
      return getTasksByGroup('Group1')
          .then((value) => {
            chai.expect(value.length).to.equal(2); // 2 tasks in Group1
            chai.expect(value).to.include.members(['task0', 'task1']);
          });
    });
  });

  describe('test deleteTask', () => {
    const d = new Date();
    const task1 = {name: 'a', group: 'yellow', session: 42, sessionCompleted: 0,
      date: d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate(),
      completed: false,
    };
    const task2 = {name: 'b', group: 'blue', session: 1, sessionCompleted: 0,
      date: d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate(),
      completed: false,
    };
    const task3 = {name: 'c', group: 'blue', session: 2, sessionCompleted: 0,
      date: d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate(),
      completed: false,
    };
    before(() => {
      window.localStorage.clear();
      window.localStorage.setItem('mochatest', true);
      window.localStorage.setItem('yellow', JSON.stringify([task1]));
      window.localStorage.setItem('blue', JSON.stringify([task2, task3]));
    });

    it('test deleteTask when no task', () => {
      deleteTask('nonexsistent task', 'yellow');
      chai.expect(JSON.parse(window.localStorage.getItem('yellow'))
          .length).to.equal(1);
      chai.expect(JSON.parse(window.localStorage.getItem('yellow'))[0]).
          to.eql(task1);
    });

    it('test deleteTask when only task', () => {
      deleteTask('a', 'yellow');
      chai.expect(JSON.parse(window.localStorage.getItem('yellow')).length)
          .to.equal(0);
    });

    it('test deleteTask when multiple tasks', () => {
      deleteTask('c', 'blue');
      chai.expect(JSON.parse(window.localStorage.getItem('blue')).length)
          .to.equal(1);
      chai.expect(JSON.parse(window.localStorage.getItem('blue'))[0])
          .to.eql(task2);
    });
  });

  describe('test completeTask', () => {
    const d = new Date();
    const task1 = {name: 'a', group: 'yellow',
      session: 42, sessionCompleted: 0,
      date: d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate(),
      completed: false,
    };
    const task2 = {name: 'b', group: 'blue', session: 1, sessionCompleted: 0,
      date: d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate(),
      completed: false,
    };
    const task3 = {name: 'c', group: 'blue', session: 2, sessionCompleted: 0,
      date: d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate(),
      completed: false,
    };
    before(() => {
      window.localStorage.clear();
      window.localStorage.setItem('mochatest', true);
      window.localStorage.setItem('yellow', JSON.stringify([task1]));
      window.localStorage.setItem('blue', JSON.stringify([task2, task3]));
    });

    it('test completeTask when no task', () => {
      completeTask('nonexsistent task', 'yellow');
      chai.expect(JSON.parse(window.localStorage.getItem('yellow'))[0]
          .completed).to.equal(false);
    });

    it('test completeTask when only task', () => {
      completeTask('a', 'yellow');
      chai.expect(JSON.parse(window.localStorage.getItem('yellow'))[0]
          .completed).to.equal(true);
    });

    it('test completeTask when multiple tasks', () => {
      completeTask('b', 'blue');
      chai.expect(JSON.parse(window.localStorage.getItem('blue'))[0]
          .completed).to.equal(true);
      chai.expect(JSON.parse(window.localStorage.getItem('blue'))[1]
          .completed).to.equal(false);
    });
  });

  describe('test completeSession', () => {
    const d = new Date();
    const task1 = {name: 'a', group: 'yellow', session: 42, sessionCompleted: 0,
      date: d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate(),
      completed: false,
    };
    const task2 = {name: 'b', group: 'blue', session: 1, sessionCompleted: 0,
      date: d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate(),
      completed: false,
    };
    const task3 = {name: 'c', group: 'blue', session: 2, sessionCompleted: 0,
      date: d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate(),
      completed: false,
    };
    before(() => {
      window.localStorage.clear();
      window.localStorage.setItem('mochatest', true);
      window.localStorage.setItem('yellow', JSON.stringify([task1]));
      window.localStorage.setItem('blue', JSON.stringify([task2, task3]));
    });

    it('test completeSession when no task', () => {
      completeSession('nonexsistent task', 'yellow');
      chai.expect(JSON.parse(window.localStorage.getItem('yellow'))[0]
          .sessionCompleted).to.equal(0);
    });

    it('test completeSession when only task', () => {
      completeSession('a', 'yellow');
      chai.expect(JSON.parse(window.localStorage.getItem('yellow'))[0]
          .sessionCompleted).to.equal(1);
      completeSession('a', 'yellow');
      chai.expect(JSON.parse(window.localStorage.getItem('yellow'))[0]
          .sessionCompleted).to.equal(2);
    });

    it('test completeSession when multiple tasks', () => {
      completeSession('b', 'blue');
      chai.expect(JSON.parse(window.localStorage.getItem('blue'))[0]
          .sessionCompleted).to.equal(1);
      chai.expect(JSON.parse(window.localStorage.getItem('blue'))[1]
          .sessionCompleted).to.equal(0);
      completeSession('c', 'blue');
      chai.expect(JSON.parse(window.localStorage.getItem('blue'))[0]
          .sessionCompleted).to.equal(1);
      chai.expect(JSON.parse(window.localStorage.getItem('blue'))[1]
          .sessionCompleted).to.equal(1);
      completeSession('b', 'blue');
      chai.expect(JSON.parse(window.localStorage.getItem('blue'))[0]
          .sessionCompleted).to.equal(2);
      chai.expect(JSON.parse(window.localStorage.getItem('blue'))[1]
          .sessionCompleted).to.equal(1);
    });
  });
});
