const {test, expect, chromium} = require('@playwright/test');
const POManager = require('../../../../page-objects/POManager');
require('dotenv').config()
const environment = "dev";
const envEmail = process.env[`lcp_email_${environment}`];
const envPass = process.env[`lcp_pass_${environment}`];
const node = "westeurope.azure";
const path = require('path');
let poManager;
const searchCriteria = "QA Test Low Code";
const searchCriteria2 = "LCP Admin";
const searchCriteria3 = "Solutions";
const searchCriteria4 = "admin";
const searchCriteria5 = "Azure Center for SAP Solutions";

test.describe.serial(`30734 : refactor search bar out of the menu to the app bar @ui-regression-${environment}-westeurope @pipeline2`, async () => {
    test.beforeEach(async ({ browser }, testInfo) => {
        const testName = testInfo.title;
        const testFileName = path.basename(__filename);
        console.log(`Starting test on "${testFileName}" - "${testName}"`);
    });

    test.beforeAll(async ({browser}) => {
        poManager = new POManager(await browser.newPage());
    });

  test('Verify that clicking on the search bar from the header displays a search modal at the center of the screen', async ({}) => {
        await poManager.page.goto(`https://portal.${environment}.lcp.ai`);
        console.log(await poManager.page.title());
        await poManager.page.waitForLoadState('networkidle');
        await new Promise(resolve => setTimeout(resolve, 3000));
        await poManager.LoginPage.acceptAllCookie.click();
        await poManager.LoginPage.loginToZen(envEmail, envPass);
        await new Promise(resolve => setTimeout(resolve, 3000));
        await poManager.HomePage.appBarSearchEnvironment.click();
        await expect(poManager.HomePage.appBarSearchDialogue).toBeVisible();
        await poManager.page.keyboard.press('Escape');
        await poManager.HomePage.clickLogOutButton();
        await new Promise(resolve => setTimeout(resolve, 5000));
    }); 

       
      test('Verify that pressing "/" + "s" in the keyboard displays the search modal', async ({}) => {
        await poManager.page.goto(`https://portal.${environment}.lcp.ai`);
        console.log(await poManager.page.title());
        await poManager.page.waitForLoadState('networkidle');
        await new Promise(resolve => setTimeout(resolve, 3000));
        await poManager.LoginPage.forgetMeButton.click();
        await poManager.LoginPage.loginToZen(envEmail, envPass);
        await poManager.page.waitForLoadState('networkidle');
        await new Promise(resolve => setTimeout(resolve, 3000));
        const locator = poManager.page.locator("#dropdown-button");
        await expect(locator).toBeVisible();
        await poManager.page.keyboard.press('/+s');
        await expect(poManager.HomePage.appBarSearchDialogue).toBeVisible();
        await poManager.page.keyboard.press('Escape');
        await poManager.HomePage.clickLogOutButton();
        await new Promise(resolve => setTimeout(resolve, 5000));
    }); 

        test('Verify that search results are displayed below the search field on the modal', async ({}) => {
        await poManager.page.goto(`https://portal.${environment}.lcp.ai`);
        console.log(await poManager.page.title());
        await poManager.page.waitForLoadState('networkidle');
        await new Promise(resolve => setTimeout(resolve, 3000));
        await poManager.LoginPage.forgetMeButton.click();
        await poManager.LoginPage.loginToZen(envEmail, envPass);
        await new Promise(resolve => setTimeout(resolve, 3000));
        await poManager.HomePage.appBarSearchEnvironment.click();
        await poManager.HomePage.appBarSearchBox.type(searchCriteria);
        await new Promise(resolve => setTimeout(resolve, 3000));
        const locator = poManager.page.locator("//p[text()='"+searchCriteria+"']");
        await expect(locator).toBeVisible();
        await poManager.HomePage.appBarSearchBox.clear();
        await poManager.page.keyboard.press('Escape');
        await poManager.HomePage.clickLogOutButton();
        await new Promise(resolve => setTimeout(resolve, 5000));
    });

    test('Verify that the search result updates dynamically', async ({}) => {
        await poManager.page.goto(`https://portal.${environment}.lcp.ai`);
        console.log(await poManager.page.title());
        await poManager.page.waitForLoadState('networkidle');
        await new Promise(resolve => setTimeout(resolve, 3000));
        await poManager.LoginPage.forgetMeButton.click();
        await poManager.LoginPage.loginToZen(envEmail, envPass);
        await new Promise(resolve => setTimeout(resolve, 3000));
        await poManager.HomePage.appBarSearchEnvironment.click();
        await poManager.HomePage.searchBoxClear.click();
        await poManager.HomePage.appBarSearchBox.type(searchCriteria);
        const locator = poManager.page.locator("//p[text()='"+searchCriteria+"']");
        await expect(locator).toBeVisible();
        await poManager.HomePage.searchBoxClear.click();
        await new Promise(resolve => setTimeout(resolve, 3000));
        await poManager.HomePage.appBarSearchBox.type(searchCriteria2);
        await new Promise(resolve => setTimeout(resolve, 3000));
        const locator2 = poManager.page.locator("//p[text()='"+searchCriteria2+"']");
        await expect(locator2).toBeVisible();
        await poManager.HomePage.appBarSearchBox.clear();
        await poManager.page.keyboard.press('Escape');
        await poManager.HomePage.clickLogOutButton();
        await new Promise(resolve => setTimeout(resolve, 5000));
    });

    test('Verify that the search results are appropriately categorized (Solution or Module)', async ({}) => {
        await poManager.page.goto(`https://portal.${environment}.lcp.ai`);
        console.log(await poManager.page.title());
        await poManager.page.waitForLoadState('networkidle');
        await new Promise(resolve => setTimeout(resolve, 3000));
        await poManager.LoginPage.forgetMeButton.click();
        await poManager.LoginPage.loginToZen(envEmail, envPass);
        await new Promise(resolve => setTimeout(resolve, 3000));
        await poManager.HomePage.appBarSearchEnvironment.click();
        await poManager.HomePage.appBarSearchBox.type(searchCriteria);
        const locator = poManager.page.locator("//p[text()='"+searchCriteria+"']");
        await expect(locator).toBeVisible();
        const solutionsElement = poManager.page.locator("//ul[contains(., 'Solutions')]//p[text()='"+searchCriteria+"']");
        await expect(solutionsElement).toBeVisible();
        await poManager.HomePage.appBarSearchBox.clear();
        await new Promise(resolve => setTimeout(resolve, 3000));
        await poManager.HomePage.appBarSearchBox.type(searchCriteria2);
        await new Promise(resolve => setTimeout(resolve, 3000));
        const locator2 = poManager.page.locator("//p[text()='"+searchCriteria2+"']");
        await expect(locator2).toBeVisible();
        const modulesElement = poManager.page.locator("//ul[contains(., 'Modules')]//p[text()='"+searchCriteria2+"']");
        await expect(modulesElement).toBeVisible();
        await poManager.HomePage.appBarSearchBox.clear();
        await poManager.page.keyboard.press('Escape');
        await poManager.HomePage.clickLogOutButton();
        await new Promise(resolve => setTimeout(resolve, 5000));
    });

test('Verify that the system displays relevant results from both categories (Solution and Module)', async ({}) => {
        await poManager.page.goto(`https://portal.${environment}.lcp.ai`);
        console.log(await poManager.page.title());
        await poManager.page.waitForLoadState('networkidle');
        await new Promise(resolve => setTimeout(resolve, 3000));
        await poManager.LoginPage.forgetMeButton.click();
        await poManager.LoginPage.loginToZen(envEmail, envPass);
        await new Promise(resolve => setTimeout(resolve, 3000));
        await poManager.HomePage.appBarSearchEnvironment.click();
        await poManager.HomePage.appBarSearchBox.clear();
        await poManager.HomePage.appBarSearchBox.type(searchCriteria3);
        await new Promise(resolve => setTimeout(resolve, 10000));
        const solutionsElement = poManager.page.locator("//h6[text()='Solutions']/../..//p[contains(text(),'"+searchCriteria3+"')]");  
        await expect(solutionsElement).toBeVisible();
        const modulesElement = poManager.page.locator("//h6[text()='Modules']/../..//p[contains(text(),'"+searchCriteria3+"')]");
        await expect(modulesElement).toBeVisible();
        await poManager.HomePage.appBarSearchBox.clear();
        await poManager.page.keyboard.press('Escape');
        await poManager.HomePage.clickLogOutButton();
        await new Promise(resolve => setTimeout(resolve, 5000));
    });

    //Limitation. Cannot check if there is a scrollbar
    //test('Verify that a scrollbar appears on the modal when the search result exceeds the modal size', async ({}) => {
    //});

    test('Verify that a message is displayed when no result are found', async ({}) => {
        await poManager.page.goto(`https://portal.${environment}.lcp.ai`);
        console.log(await poManager.page.title());
        await poManager.page.waitForLoadState('networkidle');
        await new Promise(resolve => setTimeout(resolve, 3000));
        await poManager.LoginPage.forgetMeButton.click();
        await poManager.LoginPage.loginToZen(envEmail, envPass);
        await new Promise(resolve => setTimeout(resolve, 3000));
        await poManager.HomePage.appBarSearchEnvironment.click();
        await poManager.HomePage.appBarSearchBox.type("Invalid Criteria");
        await new Promise(resolve => setTimeout(resolve, 3000));
        const noSearchResult = poManager.page.locator("//p[text()='No search results']")
        await expect(noSearchResult).toBeVisible();
        await poManager.HomePage.appBarSearchBox.clear();
        await poManager.page.keyboard.press('Escape');
        await poManager.HomePage.clickLogOutButton();
        await new Promise(resolve => setTimeout(resolve, 5000));
    });

    test('Verify that clearing the search field also clears the search result', async ({}) => {
        await poManager.page.goto(`https://portal.${environment}.lcp.ai`);
        console.log(await poManager.page.title());
        await poManager.page.waitForLoadState('networkidle');
        await new Promise(resolve => setTimeout(resolve, 3000));
        await poManager.LoginPage.forgetMeButton.click();
        await poManager.LoginPage.loginToZen(envEmail, envPass);
        await new Promise(resolve => setTimeout(resolve, 3000));
        await poManager.HomePage.appBarSearchEnvironment.click();
        await poManager.HomePage.appBarSearchBox.type(searchCriteria);
        await new Promise(resolve => setTimeout(resolve, 3000));
        const locator = poManager.page.locator("//p[text()='"+searchCriteria+"']");
        await expect(locator).toBeVisible();
        await poManager.HomePage.appBarSearchBox.clear();
        const noSearchResult = poManager.page.locator("//p[text()='No search results']")
        await expect(noSearchResult).toBeVisible();
        await poManager.page.keyboard.press('Escape');
        await poManager.HomePage.clickLogOutButton();
        await new Promise(resolve => setTimeout(resolve, 5000));
    });

    test('Verify that pressing "ESC" on the keyboard closes the search modal', async ({}) => {
        await poManager.page.goto(`https://portal.${environment}.lcp.ai`);
        console.log(await poManager.page.title());
        await poManager.page.waitForLoadState('networkidle');
        await new Promise(resolve => setTimeout(resolve, 3000));
        await poManager.LoginPage.forgetMeButton.click();
        await poManager.LoginPage.loginToZen(envEmail, envPass);
        await new Promise(resolve => setTimeout(resolve, 3000));
        await poManager.HomePage.appBarSearchEnvironment.click();
        await poManager.page.keyboard.press('Escape');
        await expect(poManager.HomePage.appBarSearchDialogue).toBeHidden();
        await poManager.HomePage.clickLogOutButton();
        await new Promise(resolve => setTimeout(resolve, 5000));
    });

    test('Verify that the search keyword and results are retained after closing the modal', async ({}) => {
        await poManager.page.goto(`https://portal.${environment}.lcp.ai`);
        console.log(await poManager.page.title());
        await poManager.page.waitForLoadState('networkidle');
        await new Promise(resolve => setTimeout(resolve, 3000));
         await poManager.LoginPage.forgetMeButton.click();
        await poManager.LoginPage.loginToZen(envEmail, envPass);
        await new Promise(resolve => setTimeout(resolve, 3000));
        await poManager.HomePage.appBarSearchEnvironment.click();
        await poManager.HomePage.appBarSearchBox.type(searchCriteria);
        await new Promise(resolve => setTimeout(resolve, 3000));
        const locator = poManager.page.locator("//p[text()='"+searchCriteria+"']");
        await expect(locator).toBeVisible();
        await poManager.page.keyboard.press('Escape');
        await poManager.HomePage.appBarSearchEnvironment.click();
        await expect(locator).toBeVisible();
        await poManager.HomePage.appBarSearchBox.clear();
        await poManager.page.keyboard.press('Escape');
        await poManager.HomePage.clickLogOutButton();
        await new Promise(resolve => setTimeout(resolve, 5000));
    });

    test('Verify that the keyboard functions are working correctly on the search modal (Arrow Up, Arrow Down, Enter)', async ({}) => {
        await poManager.page.goto(`https://portal.${environment}.lcp.ai`);
        console.log(await poManager.page.title());
        await poManager.page.waitForLoadState('networkidle');
        await new Promise(resolve => setTimeout(resolve, 3000));
        await poManager.LoginPage.forgetMeButton.click();
        await poManager.LoginPage.loginToZen(envEmail, envPass);
        await new Promise(resolve => setTimeout(resolve, 3000));
        await poManager.HomePage.appBarSearchEnvironment.click();
        await poManager.HomePage.appBarSearchBox.type(searchCriteria4);
        await poManager.page.keyboard.press('Enter');
        await new Promise(resolve => setTimeout(resolve, 3000));
        await poManager.page.keyboard.press('ArrowDown');
        await poManager.page.keyboard.press('ArrowDown');
        await poManager.page.keyboard.press('ArrowUp');
        await poManager.page.keyboard.press('Enter');
        const url = await poManager.page.url();
        expect(url).toContain(searchCriteria4);
        await poManager.page.goto(`https://portal.${environment}.lcp.ai`);
        console.log(await poManager.page.title());
        await poManager.HomePage.appBarSearchEnvironment.click();
        await poManager.HomePage.appBarSearchBox.clear();
        await poManager.page.keyboard.press('Escape');
        await poManager.HomePage.clickLogOutButton();
        await new Promise(resolve => setTimeout(resolve, 5000));
    });
    
    test('Verify that the system handles long keyword appropriately', async ({}) => {
        await poManager.page.goto(`https://portal.${environment}.lcp.ai`);
        console.log(await poManager.page.title());
        await poManager.page.waitForLoadState('networkidle');
        await new Promise(resolve => setTimeout(resolve, 3000));
        await poManager.LoginPage.forgetMeButton.click();
        await poManager.LoginPage.loginToZen(envEmail, envPass);
        await new Promise(resolve => setTimeout(resolve, 3000));
        await poManager.HomePage.appBarSearchEnvironment.click();
        await poManager.HomePage.appBarSearchBox.type(searchCriteria5);
        await poManager.page.keyboard.press('Enter');
        await new Promise(resolve => setTimeout(resolve, 3000));
        const locator = poManager.page.locator("//p[text()='"+searchCriteria5+"']");
        await expect(locator).toBeVisible();
        await poManager.HomePage.appBarSearchBox.clear();
        await poManager.page.keyboard.press('Escape');
        await poManager.HomePage.clickLogOutButton();
        await new Promise(resolve => setTimeout(resolve, 5000));
    });

    /*test('Verify that user is able to search Level 2 and 3 menu on the search modal', async ({}) => {
    //This is covered by other test cases
    });
    */

});
