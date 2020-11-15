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
		cy.visit('/code/old_popup.html')
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
		cy.get('button#demo').should('have.text','show')
		cy.get('button#set').should('have.text','set to zero')
		cy.get('button#increment').should('have.text','increment')
    })
	
	// check Awful counter buttons work
	it('Awful counter show', () => {
		window.localStorage.setItem("runTest", true)
		cy.get('p').should('have.text','default text')
		window.localStorage.setItem("testCounter", 3) //Set initial counter to 3
		cy.get('button#demo').click() // click show
		cy.get('p').should('have.text','3')
    })
	
	// check Awful counter buttons work
	it('Awful counter set to zero', () => {
		window.localStorage.setItem("runTest", true)
		cy.get('button#set').click() // click set to zero
		cy.get('p').should('have.text','0')
    })
	
	// check Awful counter buttons work
	it('Awful counter increment', () => {
		window.localStorage.setItem("runTest", true)
		window.localStorage.setItem("testCounter", 1) //Set initial counter to 1
		cy.get('button#increment').click() // click increment
		cy.get('p').should('have.text','2')
		cy.get('button#increment').click() // click increment
		cy.get('p').should('have.text','3')
		cy.get('button#increment').click() // click increment
		cy.get('p').should('have.text','4')
    })
	
	// need failing test to get screenshot
	it('Dummy test that should fail', () => {
		expect(true).to.equal(true)
	})

  })