describe('Settings Page test', () => {
	
	// had to include this because cypress doesn't recognize chrome.sync
	Cypress.on('uncaught:exception', (err, runnable) => {
	  // prevents Cypress from failing the test
	  return false
	})
	
	// check settings page has correct elements
	it('Settings popup loads', () => {
		cy.visit('/code/settings.html')
		cy.get('h1#timer').should('have.text','Timer Alarm')
		cy.get('h1#break').should('have.text','Break Alarm')
		cy.get('input#timer').should('exist')
		cy.get('input#break').should('exist')
		cy.get('button#bell').should('exist')
		cy.get('i#bell').should('exist')
    })
	
	// check bell icon button works
	it('Bell icon button works', () => {
		cy.visit('/code/settings.html')
		cy.get('body').should('have.css', 'background-color', 'rgba(0, 0, 0, 0)')
		cy.get('button#bell').click()
		cy.get('body').should('have.css', 'background-color', 'rgb(255, 192, 203)')
    })
	
	// check timer notification checkbox
	it('Timer Notification works', () => {
		cy.visit('/code/settings.html')
		cy.get('input#timer').click() // check the box
		cy.get('body').should('have.css', 'background-color', 'rgb(255, 0, 0)')
		cy.get('input#timer').click() // uncheck the box
		cy.get('body').should('have.css', 'background-color', 'rgb(0, 128, 0)')
    })
	
	// check break notification checkbox
	it('Timer Notification works', () => {
		cy.visit('/code/settings.html')
		cy.get('input#break').click() // check the box
		cy.get('body').should('have.css', 'background-color', 'rgb(0, 0, 255)')
		cy.get('input#break').click() // uncheck the box
		cy.get('body').should('have.css', 'background-color', 'rgb(255, 165, 0)')
    })
	
	// need failing test to get screenshot
	it('Dummy test that should fail', () => {
		expect(false).to.equal(true)
	})

  })