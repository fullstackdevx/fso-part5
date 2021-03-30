describe('bloglist app',  function()  {
  beforeEach(function() {
    //reset users and blogs
    cy.request('POST', 'http://localhost:3003/api/testing/reset')

    //creates a user
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      password: 'secret'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)

    //opens the web
    cy.visit('http://localhost:3000')
  })

  it('login form is shown', function () {
    cy.contains('log in to application')
    cy.contains('username')
    cy.contains('password')

    cy.get('#username')
    cy.get('#password')
    cy.get('#login-button')
  })

  describe('login', function () {
    it('succeeds with correct credentials', function (){
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('secret')
      cy.get('#login-button').click()

      cy.contains('Matti Luukkainen logged-in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.get('.error')
        .should('contain', 'Wrong credentials')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })
})