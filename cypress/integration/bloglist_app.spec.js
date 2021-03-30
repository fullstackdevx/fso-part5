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

    describe('when logged in ', function () {
      beforeEach(function() {
        cy.request('POST', 'http://localhost:3003/api/login', {
          username: 'mluukkai', password: 'secret'
        }).then(response => {
          localStorage.setItem('loggedBlogappUser', JSON.stringify(response.body))
          cy.visit('http://localhost:3000')
        })
      })


      it('A blog can be created', function() {
        const title = 'First class tests'
        const author = 'Robert C. Martin'
        const url = 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html'

        cy.contains('create new')
        cy.contains('new blog').click()

        cy.get('input[aria-label="title"]').type(title)
        cy.get('input[aria-label="author"]').type(author)
        cy.get('input[aria-label="url"]').type(url)
        cy.get('button[aria-label="create new blog"]').click()

        cy.contains(`a new blog ${title} by ${author} added`)
        cy.contains('First class tests Robert C. Martin').contains('view')
      })

      describe('and several blog exist', function (){
        beforeEach(function () {
          cy.contains('new blog').click()
          cy.get('input[aria-label="title"]').type('First class tests')
          cy.get('input[aria-label="author"]').type('Robert C. Martin')
          cy.get('input[aria-label="url"]').type('http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html')
          cy.get('button[aria-label="create new blog"]').click()
        })

        it('A user can like a blog', function (){
          cy.contains('First class tests Robert C. Martin')
            .contains('view')
            .click()

          cy.contains('First class tests Robert C. Martin').parent()
            .contains('likes 0')
            .contains('like')
            .click()

          cy.contains('First class tests Robert C. Martin').parent()
            .contains('likes 1')
        })
      })
    })
  })
})