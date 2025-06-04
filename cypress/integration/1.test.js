describe('TEST', () => {
  before(function() {
    const url = Cypress.env('BASE_URL') ? Cypress.env('BASE_URL') + '/test/index.html?id=56' : 'http://localhost:8081/?id=56'
    cy.visit(url)
    cy
      .window()
      .its('GV')
      .as('GV') // referenziabile come this.GV
  })

  it('Effettua ricerca indirizzo', function() {
    cy
      .get('.gv-geocoder')
      .find('div')
      .find('input')
      .clear()
    cy
      .get('.gv-geocoder')
      .find('div')
      .find('input')
      .type('genova')
    cy
      .get('.gv-geocoder-options span')
      .contains('Genova')
      .click({ force: true })
    cy
      .window()
      .its('GV')
      .then(GV => {
        console.log(this.GV2)
        const zoom = GV.app.map.getZoom(),
          lng = GV.app.map.getCenter().lng,
          lat = GV.app.map.getCenter().lat
        expect(zoom).to.eq(14)
        expect(lng).to.eq(8.93898)
        expect(lat).to.eq(44.4104)
      })
  })

  it('Carica livelli in legenda', function() {
    cy.get('.gv-list-legend-layer-item ').should('have.length', 2)
  })

  it('Carica mappa in configurazione', function() {
    cy
      .window()
      .its('GV')
      .then(GV => {
        const maps = GV.config.maps
        expect(maps.length).to.eq(1)
      })
  })

  it('Carica livelli in mappa', function() {
    cy
      .window()
      .its('GV')
      .then(GV => {
        const layer = GV.app.map.getLayerByName('L3')
        expect(layer.name).to.eq('L3')
      })
  })

  it('Effettua Info', function() {
    cy
      .window()
      .its('GV')
      .then(GV => {
        GV.app.map.zoomTo(44.4104, 8.93898, 13)
      })
    cy.get('#gv-map').click()
    cy.get('#gv-info-wms-html')
    cy.get('#gv-info-wms-html-title button').click()
  })

  it('Apre Pannello Scheda', function() {
    cy.get('#gv-legend-scheda-56').click()
    cy.get('#gv-map-info-panel')
    cy.get('#gv-map-info-panel-title button').click()
  })

  it('Apre Pannello Cataloghi da Legenda', function() {
    // cy.get('#gv-seach-input').clear()
    cy.get('#gv-legend-add-map').click()
    cy.get('#gv-map-catalog-panel')
    cy.get('#gv-map-catalog-panel-title button').click()
  })

  it('Apre Pannello Cataloghi da Bottone e carica mappa', function() {
    cy.get('#gv-button-add-map').click()
    cy.get('#gv-map-catalog-panel')
    cy
      .get('#gv-map-catalog-panel-repertorio-search')
      .type('sentieri')
      .type('{enter}')
    cy
      .get(
        '#gv-map-catalog-repertorio-tree div.el-tree-node.is-expanded div.el-tree-node__children div.el-tree-node.is-expanded div.el-tree-node__children div.el-tree-node div.el-tree-node__content span'
      )
      .contains('REL')
      .click()
    cy.get('#gv-map-info-panel')
    cy.get('#gv-map-info-panel-add-map').click()
    // controllo lievlli in legenda
    cy.get('.gv-list-legend-layer-item ').should('have.length', 11)
    // controllo mappe in configurazione
    cy
      .window()
      .its('GV')
      .then(GV => {
        const maps = GV.config.maps
        expect(maps.length).to.eq(2)
      })
    cy.get('#gv-map-catalog-panel-title button').click()
  })

  it('Cancella mappa', function() {
    cy.get('#gv-legend-delete-1630').click()
    cy.get('.gv-list-legend-layer-item ').should('have.length', 2)
    cy
      .window()
      .its('GV')
      .then(GV => {
        const maps = GV.config.maps
        expect(maps.length).to.eq(1)
      })
  })

  // it('Cambia Scala', function() {
  //   cy.get('#gv-scalebar').click()
  //   cy
  //     .get('.el-scrollbar .el-select-dropdown__wrap ul.el-scrollbar__view li.el-select-dropdown__item span')
  //     .contains('1:50.000')
  //     .click()
  //   cy
  //     .window()
  //     .its('GV')
  //     .then(GV => {
  //       const zoom = GV.app.map.getZoom()
  //       expect(zoom).to.eq(11)
  //     })
  // })

  it('Apre pannello Download', function() {
    cy.get('#gv-legend-download-56').click()
    cy.get('#gv-map-download')
    cy.get('#gv-map-download-cancel').click()
  })

  it('Apre pannello Trasparenza', function() {
    cy.get('#gv-legend-transparency-56').click()
    cy.get('#gv-layers-transparency')
    cy.get('#gv-layers-transparency-title button').click()
  })

  it('Acquisizione Coordinate', function() {
    const x = 1490509,
      y = 4921821
    cy.get('#gv-button-coordinate').click()
    cy.get('#gv-coordinate-panel')
    cy.get('#gv-map').click()
    cy.get('#gv-coordinate-panel-x').contains(x)
    cy.get('#gv-coordinate-panel-y').contains(y)
    cy.get('#gv-button-coordinate').click()
  })

  it('Ricerca livelli', function() {
    cy.get('#gv-button-layer-search').click()
    cy.get('#gv-layer-search')
    cy.get('#gv-layer-search-layer-select').click()
    cy
      .get('.el-select-dropdown__item span')
      .contains('Comuni 1:5000')
      .click()
    cy.get('#gv-layer-search-column-select').click()
    cy
      .get('.el-select-dropdown__item span')
      .contains('Descr Zone Mon')
      .click()
    cy.get('#gv-layer-search-value-list-button').click()
    cy.get('#gv-layer-search-value-list-panel')
    cy
      .get('#gv-layer-search-value-list-table div.el-table__body-wrapper table tr.el-table__row')
      .first()
      .click()
    cy.get('#gv-layer-search-value').should('have.value', 'interamente delimitato')
    cy.get('#gv-layer-search-submit-button').click()
    cy.get('#gv-layer-search-results-panel')
    cy
      .get('#gv-layer-search-results-table div.el-table__body-wrapper table tr.el-table__row')
      .first()
      .click()
    cy.get('#gv-layer-search-title button').click()
  })
})
