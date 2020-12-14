import promisify from 'cypress-promise'

describe('Full Task List Test', () => {
	
	// had to include this because cypress doesn't recognize chrome.sync
	Cypress.on('uncaught:exception', (err, runnable) => {
	  // prevents Cypress from failing the test
	  return false
	})
  
  const d = new Date();
  const task1 = { name: 'test1', group: 'green', session: 4, sessionCompleted: 0,
    date: d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate(),
    completed: false
  }
  const task2 = { name: 'test2', group: 'green', session: 3, sessionCompleted: 0,
    date: d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate(),
    completed: true
  }   
  const task3 = { name: 'test3', group: 'yellow', session: 2, sessionCompleted: 0,
    date: '2019-03-15',
    completed: true
  }   
  const task4 = { name: 'test4', group: 'red', session: 2, sessionCompleted: 0,
    date: '1807-02-01',
    completed: false
  }
  const data = [task1,task2,task3,task4];
  
  beforeEach(() => {
    window.localStorage.clear()
    window.localStorage.setItem('runtest', true)    
    window.localStorage.setItem('data', JSON.stringify(data))
  });
		
	// check tasklist has correct elements
	it('taskList page loads', () => {
    cy.visit('/code/taskList.html')
    cy.get('button[class=mainPageButton]').should('exist')
    cy.get('h1').should('have.text', 'Task List')
    cy.get('table#task-table').should('exist')
    cy.get('button#show-completed').should('exist')
    cy.get('button#show-completed').should('have.text', 'Show Completed')
    cy.get('table#completed-table').should('exist')
  })
  
  it ('back to main page', async () => {
    const finishAsyncCode = await promisify(cy.visit('/code/taskList.html'))
    cy.get('button[class=mainPageButton]').click()
    cy.location('pathname').should('include', 'mainPage')
  })
  
  it('taskList data loads', async () => {
    const finishAsyncCode = await promisify(cy.visit('/code/taskList.html'))
    cy.get('table#task-table').contains(task1.name)    
    cy.get('table#task-table').contains(task4.name)
    cy.get('table#task-table').contains(task1.group)    
    cy.get('table#task-table').contains(task4.group)    
    cy.get('table#task-table').contains(task1.date)    
    cy.get('table#task-table').contains(task4.date)
    cy.get('table#task-table').find('th').contains('Complete')    
    cy.get('table#task-table').find('th').contains('Name')
    cy.get('table#task-table').find('th').contains('Group')
    cy.get('table#task-table').find('th').contains('Date')
    cy.get('table#task-table').find('th').contains('Delete')
  })
  
  it('taskList completed data loads', async () => {
    const finishAsyncCode = await promisify(cy.visit('/code/taskList.html'))        
    cy.get('button#show-completed').click()
    cy.get('table#completed-table').should('have.css', 'display','table')
    cy.get('button#show-completed').should('have.text', 'Hide Completed')
    cy.get('table#completed-table').should('be.visible')
    cy.get('table#completed-table').contains(task2.name)     
    cy.get('table#completed-table').contains(task3.name)     
    cy.get('table#completed-table').contains(task2.group)     
    cy.get('table#completed-table').contains(task3.group)     
    cy.get('table#completed-table').contains(task2.date)     
    cy.get('table#completed-table').contains(task3.date)     
    cy.get('table#completed-table').find('th').contains('Complete')    
    cy.get('table#completed-table').find('th').contains('Name')
    cy.get('table#completed-table').find('th').contains('Group')
    cy.get('table#completed-table').find('th').contains('Date')
    cy.get('table#completed-table').find('th').contains('Delete')         
    cy.get('button#show-completed').click()
    cy.get('table#completed-table').should('have.css', 'display','none')
    cy.get('button#show-completed').should('have.text', 'Show Completed')
          
    cy.get('button#show-completed').click()
    cy.get('button#show-completed').should('have.text', 'Hide Completed')
    cy.get('button#show-completed').click()
    cy.get('button#show-completed').should('have.text', 'Show Completed')
  })
})