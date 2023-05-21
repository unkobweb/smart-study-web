describe('Signup', () => {
  it('Form rules', () => {
    cy.visit('http://localhost:3000/signup')

    cy.get('#email-input').wait(100).type('test').blur()
    cy.contains("L'email n'est pas valide")
    cy.get('#email-input').wait(100).clear().type('good@mail.fr').blur()

    cy.get('#password-input').wait(100).type('1234567').blur()
    cy.contains('Le mot de passe doit contenir au moins 8 caractères')
    cy.get('#password-input').wait(100).clear().type('12345678').blur()

    cy.get('#confirm-password-input').wait(100).type('1234567').blur()
    cy.contains('Les deux mots de passe doivent être identiques')
    cy.get('#confirm-password-input').wait(100).clear().type('12345678').blur()
  })
  it('Signup problems', () => {
    cy.visit('http://localhost:3000/signup')

    cy.get('#email-input').type('wrong@mail.fr')
    cy.get('#password-input').type('test123456789')
    cy.get('#confirm-password-input').type('test123456789')

    cy.intercept(
      {
        method: 'POST', // Route all GET requests
        url: '/auth/register', // that have a URL that matches '/users/*'
      },
      {
        statusCode: 400
      } // and force the response to be: []
    )

    cy.contains('s\'inscrire', {matchCase: false}).click()

    cy.contains("Une erreur est survenue lors de l'inscription")
  })
  it('Signup success', () => {
    cy.visit('http://localhost:3000/signup')

    cy.get('#email-input').type('good@mail.fr')
    cy.get('#password-input').type('test123456789')
    cy.get('#confirm-password-input').type('test123456789')

    cy.intercept(
      {
        method: 'POST', // Route all GET requests
        url: '/auth/register', // that have a URL that matches '/users/*'
      },
      {
        statusCode: 200,
        body: {
          token: "a_valid_jwt_token"
        }
      } // and force the response to be: []
    )

    cy.contains('s\'inscrire', {matchCase: false}).click()

    cy.contains("Inscription réussie !")

    cy.url().should('eq', 'http://localhost:3000/')
  })
})