import GetStartedSeller from '../../src/Pages/PackageFlow/GetStartedSeller';

describe('Onboarding Seller', () => {
  beforeEach(() => {
    // run these tests as if in a desktop
    // browser with a 720p monitor
    cy.viewport(1280, 720)
  })
  
  it('mount seller onboarding', () => {
    const defaultValue = {
      location: {
        address: 'Av. da Liberdade, 1250-096 Lisboa, Portugal',
        city: 'Lisboa',
        cityZip: '1250-096 Lisboa',
        country: 'Portugal',
        countryCode: 'PT',
        geometry: {},
        latitude: 38.7205373,
        longitude: -9.1459023,
        name: 'Avenida da Liberdade',
        searchAddress: 'Av. da Liberdade, 1250-096 Lisboa, Portugal',
        state: 'Lisboa',
        stateCode: 'Lisboa',
        vicinity: null,
        zip: '1250-096',
      },
      typology: {
        bathrooms: 0,
        bedrooms: 3,
        livingArea: {
          unit: 'm2',
        },
        grossArea: {
          unit: 'm2',
        },
        floorSpace: {
          unit: 'm2',
        },
      },
      parking: {
        garage: 0,
        outside: 0,
        underground: 0,
      },
    }
    cy.mount(<GetStartedSeller testValue={{ ...defaultValue }} />)
    
    cy.get('[type="radio"]').should('exist').first().check({ force: true });
    cy.get('button.inc').click();
    cy.get('button[type="submit"]').click();
    cy.get('input[type="number"]').type('124');
    cy.get('button[type="submit"]').click();
    cy.get('input[type="number"]').type('2000');
    cy.get('button[type="submit"]').click();
    cy.get('button[type="submit"]').click();
    cy.url().should('contain', '/locationInputResume')
    cy.get('button[type="submit"]').click();
    cy.get('[type="radio"]').first().check({ force: true });
    cy.get('input[name="register.name"]').type('Test Automated');
    cy.get('input[name="register.email"]').type('jestTest@brixel.io');
    cy.get('input[name="register.password"]').type('123456789');
    cy.get('input[name="register.privacy"]').check({ force: true });
  })
})
