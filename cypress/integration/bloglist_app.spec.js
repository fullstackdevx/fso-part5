describe('bloglist app',  function()  {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')

    cy.createUser({
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      password: 'secret'
    })

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
        cy.login({ username: 'mluukkai', password: 'secret' })
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
          cy.createBlog({
            title: 'First class tests',
            author: 'Robert C. Martin',
            url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html'
          })

          cy.createBlog({
            title: 'React patterns',
            author: 'Michael Chan',
            url: 'https://reactpatterns.com/',
            likes: 2
          })

          cy.createBlog({
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 1
          })
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

        it('blogs are ordered according to likes descending', function(){
          const blogsTitlesAtStart = ['React patterns', 'Go To Statement Considered Harmful', 'First class tests']

          cy.get('.blog')
            .should('have.length', 3)
            .each((blog, index) => {
              cy.wrap(blog).should('contain', blogsTitlesAtStart[index])
            })

          cy.contains('First class tests Robert C. Martin').contains('view').click()

          cy.contains('First class tests Robert C. Martin').parent().contains('like').as('firstClassLikeButton')

          cy.get('@firstClassLikeButton').click()
          cy.contains('First class tests Robert C. Martin').parent().contains('likes 1')

          cy.get('@firstClassLikeButton').click()
          cy.contains('First class tests Robert C. Martin').parent().contains('likes 2')

          cy.get('@firstClassLikeButton').click()
          cy.contains('First class tests Robert C. Martin').parent().contains('likes 3')

          const blogsTitlesAtEnd = ['First class tests', 'React patterns', 'Go To Statement Considered Harmful']

          cy.get('.blog')
            .each((blog, index) => {
              cy.wrap(blog).should('contain', blogsTitlesAtEnd[index])
            })
        })

        it('a user who created a blog can delete it', function (){
          cy.contains('First class tests Robert C. Martin')
            .contains('view')
            .click()

          cy.contains('First class tests Robert C. Martin').parent()
            .contains('remove')
            .click()

          cy.contains('Deleted First class tests')
          cy.get('html').should('not.contain', 'First class tests Robert C. Martin')
        })

        describe('and a user without blogs logged in', function(){

          beforeEach(function(){
            cy.createUser({
              name: 'Arto Hellas',
              username: 'hellas',
              password: 'pass'
            })

            localStorage.removeItem('loggedBlogappUser')
            cy.visit('http://localhost:3000')

            cy.login({ username: 'hellas', password: 'pass' })
          })

          it('a user who does not create the blog can not delete it', function() {
            cy.contains('First class tests Robert C. Martin')
              .contains('view')
              .click()

            cy.contains('First class tests Robert C. Martin').parent('div')
              .should('not.contain','remove')
          })
        })
      })
    })
  })
})