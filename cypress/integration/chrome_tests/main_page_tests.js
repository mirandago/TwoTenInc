describe('Main Page Test', () => {
	
	// had to include this because cypress doesn't recognize chrome.sync
	Cypress.on('uncaught:exception', (err, runnable) => {
	  // prevents Cypress from failing the test
	  return false
	})
		
	// check main page has correct elements
	it('main page loads', () => {
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
  })