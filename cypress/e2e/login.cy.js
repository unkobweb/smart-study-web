describe('Login page', () => {
  it('Local credentials', () => {
    cy.visit('http://localhost:3000/login')

    cy.get('#email-input').type('test@test')
    cy.get('#password-input').type('test')

    cy.contains('SE CONNECTER').click()
  })
})