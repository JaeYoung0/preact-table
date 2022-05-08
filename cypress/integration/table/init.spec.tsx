/// <reference types="cypress"/>

const initialize = () =>
  window.postMessage({
    payload: {
      user_id: '1651800183717x956761776063033100',
      start: '2021-12-05',
      end: '2022-04-05',
      metrics_type: 'SALES',
      order_by_col_num: 1,
      page: 0,
    },
  })

context('Table init', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000')
  })

  it('initialize table', () => {
    cy.intercept('GET', '**/v2/metrics/columns?*').as('getCols')
    cy.intercept('GET', '**/v2/metrics?*').as('getRows')

    cy.window().then((window) => {
      window.postMessage({
        payload: {
          user_id: '1651800183717x956761776063033100',
          start: '2021-12-05',
          end: '2022-04-05',
          metrics_type: 'SALES',
          order_by_col_num: 1,
          page: 0,
        },
      })
    })

    cy.wait('@getCols').its('response.statusCode').should('eq', 200)
    cy.wait('@getRows').its('response.statusCode').should('eq', 200)
  })
})
