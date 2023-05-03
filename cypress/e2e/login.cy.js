describe('Login page', () => {
  it('Local credentials', () => {
    cy.visit('http://localhost:3000/login')

    cy.get('#email-input').type('test@test')
    cy.get('#password-input').type('test')

    cy.intercept(
      {
        method: 'POST', // Route all GET requests
        url: '/auth/login', // that have a URL that matches '/users/*'
      },
      {
        statusCode: 401
      } // and force the response to be: []
    )

    cy.contains('se connecter', {matchCase: false}).click()
  })
})