const BASE_URL = Cypress.env("BASE_URL")

describe('Scuola Digitale', () => {
    before(
        function() {
            cy.visit(BASE_URL + '/scuoladigitale/mappa.html')
        }
    )

    it('Carica livelli in legenda', function() {
        cy.get('.gv-list-legend-layer-item ').should('have.length', 6)
    })

    it('Carica mappa in configurazione', function() {
        cy.window().its('GV').then(GV => {
            const maps = GV.config.maps
            expect(maps.length).to.eq(1)
        })
    })

    it('Effettua ricerca scuola', function() {
        // cy.get('#gv-seach-input').clear()
        cy.get('#gv-seach-input').type('calvino')
        cy.get('.el-select-dropdown__item span').contains('CALVINO').click()
        cy.window().its('GV').then(GV => {
            const zoom = GV.app.map.getZoom(),
                lng = GV.app.map.getCenter().lng,
                lat = GV.app.map.getCenter().lat
            expect(zoom).to.eq(16)
            expect(lng).to.eq(8.85545387)
            expect(lat).to.eq(44.42549624)
        })
    })

})