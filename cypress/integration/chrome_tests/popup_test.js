describe('Popup Page Test', () => {
	// had to include this because cypress doesn't recognize chrome.sync
	Cypress.on('uncaught:exception', (err, runnable) => {
	  // prevents Cypress from failing the test
	  return false
	})
    
    // Not sure how to test this since the background needs to be running 
    // at the same time
	// check settings page has correct elements
	it('popup loads', () => {
		cy.visit('/code/popup.html')
		//cy.get('h1#timer').should('have.text','Timer Alarm')
		//cy.get('h1#break').should('have.text','Break Alarm')
		cy.get('div#play_img').should('exist')
        cy.get('div#reset_img').should('exist')
        cy.wait(1000)
        cy.get('div#setting_img').should('exist')
        cy.get('img#imgid').click()
        cy.wait(1000)
    })
	
	// need failing test to get screenshot
  })