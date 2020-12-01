describe('Audio Settings Page test', () => {
	
	// had to include this because cypress doesn't recognize chrome.sync
	Cypress.on('uncaught:exception', (err, runnable) => {
	  // prevents Cypress from failing the test
	  return false
	})
	
	it('elements exist', () => {
		cy.visit('/code/settingAudio.html')
		cy.get('button#settingAudio').should('exist')
		cy.get('button#settingTimer').should('exist')
		cy.get('button#settingGroup').should('exist')
		cy.get('button#mainPage').should('exist')
		cy.get('input#timer').should('exist')
		cy.get('input#break').should('exist')
	})

	it ('current page highlighted', () => {
		cy.visit('/code/settingAudio.html')
		cy.get('button#settingAudio').should('have.css', 'background-color', 'rgb(255, 250, 205)')
		cy.get('button#settingTimer').should('have.css', 'background-color', 'rgb(169, 169, 169)')
		cy.get('button#settingGroup').should('have.css', 'background-color', 'rgb(169, 169, 169)')
	})

	it ('visit other settings', () => {
		cy.visit('/code/settingAudio.html')
		cy.get('button#settingTimer').click()
		cy.location('pathname').should('include', 'settingTimer')

		cy.visit('/code/settingAudio.html')
		cy.get('button#settingGroup').click()
		cy.location('pathname').should('include', 'settingGroup')

		cy.visit('/code/settingAudio.html')
		cy.get('button#settingAudio').click()
		cy.location('pathname').should('include', 'settingAudio')

		cy.visit('/code/settingAudio.html')
		cy.get('button#mainPage').click()
		cy.location('pathname').should('include', 'mainPage')
	})

	it ('click to change settings', () => {
		cy.visit('/code/settingAudio.html')
		cy.get('input#timer').click() // check the box
		cy.get('input#timer').should('be.checked')
		cy.get('input#break').click() // check the box
		cy.get('input#break').should('be.checked')
	})
  })