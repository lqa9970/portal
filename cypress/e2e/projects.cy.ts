describe('Test application', () => {
  before(() => {
    cy.login()
  })
  it('can see user name', () => {
    cy.visit('http://localhost:3000/')
    cy.contains('Technical DevOps Foundation')
  })
  it('can see project list', () => {
    cy.visit('http://localhost:3000/')
    cy.contains('tesa-sandbox')
    cy.contains('tepa-dev')
  })
  it('can navigate to create sandbox', () => {
    cy.visit('http://localhost:3000/')
    cy.get('[data-cy="create-sandbox"]').click()
    cy.contains('New Sandbox')
  })
  it('can navigate to create project', () => {
    cy.visit('http://localhost:3000/')
    cy.contains('New Project')
  })
  it('show errors messages for required fields', () => {
    cy.visit('http://localhost:3000/projects/create/sandbox')
    cy.wait(1000)
    cy.get('[data-cy="submit"]').click()
    cy.contains('Required')
  })
  it('show errors messages for applicationShortName', () => {
    cy.visit('http://localhost:3000/projects/create/sandbox')
    cy.wait(1000)
    cy.get('[data-cy="submit"]').click()
    cy.contains('Required')
    cy.get('[data-cy="applicationShortName"]').type('1')
    cy.contains('Only letters')
    cy.get('[data-cy="applicationShortName"]').type('abca')
    cy.contains('Max 4 characters')
    cy.get('[data-cy="applicationShortName"]').clear()
    cy.get('[data-cy="applicationShortName"]').type('tesa')
    cy.contains('Short name is not available. Please use another short name')
  })
  it('show errors messages for costCenter', () => {
    cy.visit('http://localhost:3000/projects/create/sandbox')
    cy.wait(1000)
    cy.get('[data-cy="submit"]').click()
    cy.get('[data-cy="costCenter"]').type('a')
    cy.contains('Numbers only')
  })
})
