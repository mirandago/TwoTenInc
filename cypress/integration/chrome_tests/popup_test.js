describe('Popup Test', () => {
	
	// had to include this because cypress doesn't recognize chrome.sync
	Cypress.on('uncaught:exception', (err, runnable) => {
	  // prevents Cypress from failing the test
	  return false
	})
		
	// check popup has correct elements
	it('popup loads', () => {
		cy.visit('/code/popup.html')
		cy.get('p#timer').should('have.text', '00:00')
		cy.get('div#play_img').should('exist')
		cy.get('div#pause_img').should('exist')
        cy.get('div#reset_img').should('exist')
        cy.get('div#expand_img').should('exist')
    })
  })