describe('Download', () => {
  before(function() {
    const url = Cypress.env('BASE_URL') ? Cypress.env('BASE_URL') + '/download/index.html?id=56' : 'http://localhost:8081/?id=56'
    cy.visit(url)
  })

  it('Apre pannello Download', function() {
    cy.get('#gv-map-download')
    cy.get('#gv-map-download-email').type('s.parodi@datasiel.net')
    cy.get('#gv-map-download-crs').click()
    cy
      .get('.el-scrollbar .el-select-dropdown__wrap ul.el-scrollbar__view li.el-select-dropdown__item span')
      .contains('ROMA40 - Gauss-Boaga - Fuso Ovest')
      .click()
    // cy.get('#gv-map-download-cancel').click()
  })
})
