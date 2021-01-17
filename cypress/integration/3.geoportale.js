describe('Geoportale Senza Mappa', () => {
  before(function() {
    const url = Cypress.env('BASE_URL') ? Cypress.env('BASE_URL') + '/geoportale/index.html' : 'http://localhost:8081/'
    cy.visit(url)
  })

  it('Nessun livello in legenda', function() {
    cy.get('.gv-list-legend-layer-item ').should('have.length', 0)
  })

  it('Nessuna mappa in configurazione', function() {
    cy
      .window()
      .its('GV')
      .then(GV => {
        const maps = GV.config.maps
        expect(maps.length).to.eq(0)
      })
  })

  it('Pannello Cataloghi è aperto', function() {
    cy.get('#gv-map-catalog-panel')
  })
})
