# Brixel Hub

## Demo

[Brixel Hub](https://dev-hub.brixel.io/)

## Install

`npm install`

If you have not built for a long time, onpm r you have problems with
the installed node packages, please delete the ```node_modules``` 
folder and run ```npm install``` again.

## Start Locally

`npm run start-dev`
With this command it is possible to run a real test of the deployed version

or

`npm run start`
With this command it skips the purgeCSS and gZip compression and optimization, it is useful to run faster the project 

## Test

To run the End-to-End tests We are using Cypress

[Cypress Documentation](https://docs.cypress.io/)

To run the test on local it is possibile to use Browser Mode (`open command`) or on terminal (`run command`).

### RUN TEST

***Browser Mode***

You have to run the following command:

- On terminal you have to use `npm run test-e2e`
- Wait that the project is started
- Now Cypress will open a Window when it is possible to choose the browser that you want to use for the test. 
- After have chosen the browser you can click on which test you want to run
- Here on the right you will have a visual test and on left the type of test is running.

***Terminal Mode***

- You have to run the command `npm run build`
- After you can use `npm run test-cypress`
- Now on the terminal you can follow the test

### WRITE TEST E2E

All tests are inside the folder `cypress/e2e`, here you can create a subfolder.

A new test have to be inside a `describe` function:

<pre>
describe('test description', { retries: 1 }, () => {
    ...
});
</pre>

the command `retries` it means how many times it automatically retries if fail.

Inside of the `describe` function you have to put the `before` command:

<pre>
describe('test description', { retries: 1 }, () => {
    before(() => {
        // Cypress starts out with a blank slate for each test
        // so we must tell it to visit our website with the `cy.visit()` command.
        // Since we want to visit the same URL at the start of all our tests,
        // we include it in our beforeEach function so that it runs before each test
        cy.visit('http://localhost:5000/packageFlow/getStarted/brixel_portugal/propertyType');
      });
});
</pre>

In this case be sure to set the same port on `webpack.config.js` and on `server.js`.

Now after the `before` you can add all `it()` that you need to test:

<pre>
describe('test description', { retries: 1 }, () => {
    before(() => {
        // Cypress starts out with a blank slate for each test
        // so we must tell it to visit our website with the `cy.visit()` command.
        // Since we want to visit the same URL at the start of all our tests,
        // we include it in our beforeEach function so that it runs before each test
        cy.visit('http://localhost:5000/packageFlow/getStarted/brixel_portugal/propertyType');
    });

    it('button test', () => {
        cy.get('button[type="submit"]').click();
    })
});
</pre>

For all possible commands you can read here:

[Cypress Commands](https://docs.cypress.io/api/commands/and)

### WRITE TEST COMPONENTS

With Cypress it is possible to write a test for a specific component, for now it is still on a Beta version and it doesn't work with Gitlab CI.

- You can use `npm run test-component`
- Now Cypress will open a Window when it is possible to choose the browser that you want to use for the test.
- After have chosen the browser you can click on which test you want to run
- Here on the right you will have a visual test and on left the type of test is running.

### VIEWPORT SCREENSHOT

With Cypress it is possible to create a screenshot to simulate different size screen by device to do that you can do like this:

<pre>
describe('viewport testing', { retries: 1 }, () => {
  before(() => {
    cy.visit('http://localhost:5000/packageFlow/getStarted/brixel_portugal/propertyType');
  })

  it('take viewport screenshot', () => {
    const preset = ['ipad-2', 'ipad-mini', 'iphone-6', 'iphone-6+', 'iphone-7', 'iphone-8', 'iphone-x', 'iphone-xr', 'iphone-se2', 'macbook-11', 'macbook-13', 'macbook-15', 'macbook-16', 'samsung-note9', 'samsung-s10',];
    preset.forEach((preset) => {
      cy.viewport(preset);
      cy.screenshot(`./exmples/${preset}`, { overwrite: true })
    })
  })
})
</pre>

You can change the `cy.visit` website to run on the page that you need to test and under `const preset` you can add all devices that you want to check.

You can change the `example`, on `cy.screenshot` to change the destination folder inside screenshot

It is better to run locally so you can easily check under the folder `cypress/screenshot/example` (example can change by folder you choose to use on `cypress.screenshot` params).

### AFTER TESTS

After both tests please remove all data from the database, to do this you can do manually on admin or run the command:

- On develop: `ssh ubuntu@3.124.80.14 'cd /srv/development/brixel-api; NODE_ENV=development node scripts/dataManagement/cleanJestTestsData.js delete'
- On stage: `ssh ubuntu@3.124.80.14 'cd /srv/staging/brixel-api; NODE_ENV=staging node scripts/dataManagement/cleanJestTestsData.js delete'`
- On master: `ssh ubuntu@3.124.95.1 'cd /srv/production/brixel-api; NODE_ENV=production node scripts/dataManagement/cleanJestTestsData.js delete'`
