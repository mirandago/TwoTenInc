import promisify from 'cypress-promise'

describe('Main Page Test', () => {
	
	// had to include this because cypress doesn't recognize chrome.sync
	Cypress.on('uncaught:exception', (err, runnable) => {
	  // prevents Cypress from failing the test
	  return false
	})
		
	// check main page has correct elements
	it('main page loads', () => {
    window.localStorage.setItem('runtest', true)
    cy.visit('/code/mainPage.html')
    cy.get('div#group_select').should('exist')
    cy.get('div#timerButtonsContainer').should('exist')
    cy.get('div#play_img').should('exist')
    cy.get('div#pause_img').should('exist')
    cy.get('div#reset_img').should('exist')
    cy.get('div#setting_img').should('exist')
    cy.get('div#input_task').should('exist')
    cy.get('div#session_id').should('exist')
  })
   
  it('timer can be updated', async() => {
    window.localStorage.setItem('runtest', true)
    const response = {
      timeLeft: 300,
      isActive: true,
      isFocus: true,
      currentTask: 'testing',
    };
    window.localStorage.setItem('response', JSON.stringify(response))
    const finishAsyncCode = await promisify(cy.visit('/code/mainPage.html'))
    cy.get('label#timer').should('have.value', response.timeLeft)
    cy.get('label#timer_state').should('have.text', response.currentTask)
  })

  it ('visit settings', () => {
    cy.visit('/code/mainPage.html')
    cy.get('div#setting_img').click()
    cy.location('pathname').should('include', 'setting')
  })

  it ('visit full task list', () => {
    cy.visit('/code/mainPage.html')
    cy.get('button#viewTasksBtn').click()
    cy.location('pathname').should('include', 'taskList')
  })

  it('check group buttons', () => {
    cy.visit('/code/mainPage.html')
    cy.get('button#taskListGroupRed').should('exist')
    cy.get('button#taskListGroupGreen').should('exist')
    cy.get('button#taskListGroupYellow').should('exist')
    cy.get('button#taskListGroupBlue').should('exist')
  })
   
  it('check task input and submission', () => {
    cy.visit('/code/mainPage.html')
    cy.get('input#inputTask').type('test')
    cy.get('input#inputTask').should('have.value', 'test')
    cy.get('input#sessionId').type('1')
    cy.get('input#sessionId').should('have.value', '1')
    cy.get('select').select('Blue')
    cy.get('select').should('have.value', 'Blue')
    cy.get('button#submitTaskBtn').click()    
    // input fields reset after submitting a task      
    cy.get('input#inputTask').should('have.value', '')
    cy.get('input#sessionId').should('have.value', '')      
    cy.get('select').should('have.value', 'Red')
  })
  
  it('check input validation for tasks', () => {
    cy.visit('/code/mainPage.html')
    cy.get('button#submitTaskBtn').click() 
    let called = false 
    cy.on('window:alert', (str) => {
      expect(str).to.equal('Please input a task')
      called = true
    })
    cy.wrap(null).should(() => {
      expect(called).to.be.true
    })
  })
  
  it('check input validation for sessions', () => {
    cy.visit('/code/mainPage.html')
    cy.get('input#inputTask').type('test')
    cy.get('button#submitTaskBtn').click() 
    let called = false
    cy.on('window:alert', (str) => {
      expect(str).to.equal('Please input the number of sessions')
      called = true
    })
    cy.wrap(null).should(() => {
      expect(called).to.be.true
    })
  })
  
  it('check submitted task stored', async () => {
    window.localStorage.setItem('runtest', true)
    expect(window.localStorage.getItem('Red')).to.be.null
    cy.visit('/code/mainPage.html')
    cy.get('input#inputTask').type('test')
    cy.get('input#sessionId').type('1')
    cy.get('select').select('Red')
    const asyncFunction = await promisify(cy.get('button#submitTaskBtn').click()) 
    expect(window.localStorage.getItem('Red')).not.to.be.null
  })
})