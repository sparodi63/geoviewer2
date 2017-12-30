const BASE_URL = Cypress.env("BASE_URL")

describe('TEST', () => {
    before(
        function() {
            cy.visit(BASE_URL + '/geoportale/index.html?id=56')
        }
    )

    it('Effettua ricerca indirizzo', function() {
        cy.get('.gv-geocoder').find('div').find('input').clear()
        cy.get('.gv-geocoder').find('div').find('input').type('genova')
        cy.get('.gv-geocoder-options span').contains('Genova').click({ force: true })
        cy.window().its('GV').then(GV => {
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
        cy.window().its('GV').then(GV => {
            const maps = GV.config.maps
            expect(maps.length).to.eq(1)
        })
    })

    it('Carica livelli in mappa', function() {
        cy.window().its('GV').then(GV => {
            const layer = GV.app.map.getLayerByName("L3")
            expect(layer.name).to.eq("L3")
        })
    })

    it('Effettua Info', function() {
        cy.window().its('GV').then(GV => {
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
        cy.get('#gv-map-catalog-panel-repertorio-search').type('sentieri').type('{enter}')
        cy.get('#gv-map-catalog-repertorio-tree div.el-tree-node.is-expanded div.el-tree-node__children div.el-tree-node.is-expanded div.el-tree-node__children div.el-tree-node div.el-tree-node__content span').contains('REL').click()
        cy.get('#gv-map-info-panel')
        cy.get('#gv-map-info-panel-add-map').click()
            // controllo lievlli in legenda
        cy.get('.gv-list-legend-layer-item ').should('have.length', 11)
            // controllo mappe in configurazione
        cy.window().its('GV').then(GV => {
            const maps = GV.config.maps
            expect(maps.length).to.eq(2)
        })
        cy.get('#gv-map-catalog-panel-title button').click()
    })

    it('Cancella mappa', function() {
        cy.get('#gv-legend-delete-1630').click()
        cy.get('.gv-list-legend-layer-item ').should('have.length', 2)
        cy.window().its('GV').then(GV => {
            const maps = GV.config.maps
            expect(maps.length).to.eq(1)
        })
    })

    it('Cambia Scala', function() {
        cy.get('#gv-scalebar').click()
        cy.get('.el-scrollbar .el-select-dropdown__wrap ul.el-scrollbar__view li.el-select-dropdown__item span').contains('1:50.000').click()
        cy.window().its('GV').then(GV => {
            const zoom = GV.app.map.getZoom()
            expect(zoom).to.eq(11)
        })
    })

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


})