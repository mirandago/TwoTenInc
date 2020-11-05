describe('Small end-to-end test', () => {
	it('Dummy test', () => {
		expect(true).to.equal(true)
	})
	
	// had to include this because cypress doesn't recognize chrome.sync
	Cypress.on('uncaught:exception', (err, runnable) => {
	  // prevents Cypress from failing the test
	  return false
	})
	
	// check Hello world popup has correct elements
	it('Hello World popup loads', () => {
		cy.visit('/code/popup.html')
		cy.get('title').should('have.text','Hello world')
		cy.get('h2').should('have.text','Hello world!')
		cy.get('button').should('have.text', 'button')
	})
	
	// check Hello world popup redirects on click
	it('redirects on click', () => {
		cy.get('button').click()
		cy.url().should('include', 'newPage')
	})
	
	// check Awful counter has correct elements
	it('Awful counter popup loads', () => {
		cy.visit('/code/newPage.html')
		cy.get('h1').should('have.text','Awful Counter')
		cy.get('p').should('have.text','default text')
		cy.get('button').eq(0).should('have.text','show')
		cy.get('button').eq(1).should('have.text','set to zero')
		cy.get('button').eq(2).should('have.text','increment')
    })
	
	/* these buttons don't work because chrome.storage.sync doesn't work
	// check Awful counter buttons work
	it('Awful counter show', () => {
		cy.get('p').should('have.text','default text')
		cy.get('button').eq(0).click() // click show
		cy.get('p').should('not.have.text','default text')
		cy.get('button').eq(1).should('have.text','set to zero')
		cy.get('button').eq(2).should('have.text','increment')
    })
	
	// check Awful counter buttons work
	it('Awful counter set to zero', () => {
		cy.get('button').eq(1).click() // click set to zero
		cy.get('p').should('have.text','0')
    })
	
	// check Awful counter buttons work
	it('Awful counter increment', () => {
		cy.get('button').eq(1).click() // click set to zero
		cy.get('p').should('have.text','0')
		cy.get('button').eq(2).click() // click increment
		cy.get('p').should('have.text','1')
    })
	*/
	it('Dummy test that should fail', () => {
		expect(false).to.equal(true)
	})
	

  })