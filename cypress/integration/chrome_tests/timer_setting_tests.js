describe('Timer Settings Page test', () => {
	
	// had to include this because cypress doesn't recognize chrome.sync
	Cypress.on('uncaught:exception', (err, runnable) => {
	  // prevents Cypress from failing the test
	  return false
	})
	
	it('elements exist', () => {
		cy.visit('/code/settingTimer.html')
		cy.get('button#settingAudio').should('exist')
		cy.get('button#settingTimer').should('exist')
		cy.get('button#settingGroup').should('exist')
		cy.get('button#submitChanges').should('exist')
		cy.get('input#timerLength').should('exist')
		cy.get('input#breakLength').should('exist')
		cy.get('input#sessionsLB').should('exist')
		cy.get('input#LBreakLength').should('exist')
	})

	it ('current page highlighted', () => {
		cy.visit('/code/settingTimer.html')
		cy.get('button#settingTimer').should('have.css', 'background-color', 'rgb(255, 250, 205)')
		cy.get('button#settingAudio').should('have.css', 'background-color', 'rgb(169, 169, 169)')
		cy.get('button#settingGroup').should('have.css', 'background-color', 'rgb(169, 169, 169)')
	})

	it ('visit other settings', () => {
		cy.visit('/code/settingTimer.html')
		cy.get('button#settingTimer').click()
		cy.location('pathname').should('include', 'settingTimer')

		cy.visit('/code/settingTimer.html')
		cy.get('button#settingGroup').click()
		cy.location('pathname').should('include', 'settingGroup')

		cy.visit('/code/settingTimer.html')
		cy.get('button#settingAudio').click()
		cy.location('pathname').should('include', 'settingAudio')
	})

	it ('update value in input', () => {
		cy.visit('/code/settingTimer.html')
		cy.get('input#timerLength').type('abc12')
		cy.get('input#timerLength').should('have.value', 'abc1')

		cy.get('input#breakLength').type('abc12')
		cy.get('input#breakLength').should('have.value', 'abc1')

		cy.get('input#sessionsLB').type('abc12')
		cy.get('input#sessionsLB').should('have.value', 'abc1')

		cy.get('input#LBreakLength').type('abc12')
		cy.get('input#LBreakLength').should('have.value', 'abc1')
	})
  })