/// <reference types="cypress"/>

import {format, prepareLocalStorage} from '../support/utils'


describe('Dev Finances', () => {

  // hooks trechos que executam antes e depois do teste
  // before -> antes de todos os testes
  // beforEach -> antes de cada teste
  // after -> depois de todos os testes
  // afterEach -> depois de casa teste


  beforeEach(() =>{
    cy.visit('https://devfinance-agilizei.netlify.app', {
      // onBeforeLoad: (win) =>{
      //   prepareLocalStorage(win)
      // }
    })
  })


  it('Cadastrar entradas', () => {
      // - entender o fluxo manualmente
      // mapear os elementos que vamos interagir
      // descrever as interaçoes com o cypress
      // adicionar as asserçoes que a gente precisa

      cy.visit('https://devfinance-agilizei.netlify.app')

      cy.get('#transaction .button').click() // id + classe
      cy.get('#description').type('presente') // id
      cy.get('[name=amount]').type(12) // atributo
      cy.get('[type=date]').type('2022-03-17') // atributo
      cy.get('button').contains('Salvar').click() // tipo de valor

      cy.get('#data-table tbody tr').should('have.length', 1)
  });

  it('Cadastra saidas', ()=>{
    cy.visit('https://devfinance-agilizei.netlify.app')

    
    cy.get('#transaction .button').click() // id + classe
    cy.get('#description').type('presente') // id
    cy.get('[name=amount]').type(-12) // atributo
    cy.get('[type=date]').type('2022-03-17') // atributo
    cy.get('button').contains('Salvar').click() // tipo de valor

    cy.get('#data-table tbody tr').should('have.length', 1)
  })
  it('Remover, entrada e saida', () =>{
    const entrada = 'mesada'
    const saida = 'KinderOvo'

    
    cy.get('#transaction .button').click() // id + classe
    cy.get('#description').type(entrada) // id
    cy.get('[name=amount]').type(120) // atributo
    cy.get('[type=date]').type('2022-03-17') // atributo
    cy.get('button').contains('Salvar').click() // tipo de valor


    cy.get('#transaction .button').click() // id + classe
    cy.get('#description').type(saida) // id
    cy.get('[name=amount]').type(-60) // atributo
    cy.get('[type=date]').type('2022-03-17') // atributo
    cy.get('button').contains('Salvar').click() // tipo de valor

    // estrátegia 1: voltar para elemento pai, e avançar para um td img attr

    cy.get('td.description')
    .contains(entrada)
    .parent()
    .find('img[onclick*=remove]')
    .click()

    // estrátegia 2: buscar todos os irmaos e buscar o que tem img + attr

    cy.get('td.description')
    .contains(saida)
    .siblings()
    .children('img[onclick*=remove]')
    .click()

    cy.get('#data-table tbody tr').should('have.length', 0)
  })

  it('Validar saldo com diversas transações', () => {



    const entrada = 'mesada'
    const saida = 'KinderOvo'

    
    cy.get('#transaction .button').click() // id + classe
    cy.get('#description').type(entrada) // id
    cy.get('[name=amount]').type(120) // atributo
    cy.get('[type=date]').type('2022-03-17') // atributo
    cy.get('button').contains('Salvar').click() // tipo de valor


    cy.get('#transaction .button').click() // id + classe
    cy.get('#description').type(saida) // id
    cy.get('[name=amount]').type(-60) // atributo
    cy.get('[type=date]').type('2022-03-17') // atributo
    cy.get('button').contains('Salvar').click() // tipo de valor

    // capturar as linhas com as transações e as conlunas com valores
    // capturar o texto dessas colunas
    // formatar esses valores das linhas
    // somar os valores de entradas e saidas
    // capturar o texto do total
    // comparar o somatorio de entradas e despesas com o total

    let incomes = 0
    let expenses = 0

    cy.get('#data-table tbody tr')
    .each(($el, index, $list) => {
      cy.get($el).find('td.income, td.expense')
      .invoke('text').then(text => {
        if (text.includes('-')) {
          expenses = expenses + format(text)
        } else{
          incomes += format(text)
        }

        cy.log(incomes)
        cy.log(expenses)


      })
    })

    cy.get('#totalDisplay').invoke('text').then(text =>{
      let formattedTotalDisplay = format(text)
      let expectedTotal = incomes + expenses

      expect(formattedTotalDisplay).to.eq(expectedTotal)
    })
    
})

  it('Exemplo para teste otimizado usando localStorage', () => {
    cy.visit('https://devfinance-agilizei.netlify.app', {
      onBeforeLoad: (win) =>{
        prepareLocalStorage(win)
      }
    })
    cy.get('#data-table tbody tr').should('have.length', 2)
  });
  
});