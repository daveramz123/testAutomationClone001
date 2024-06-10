const {test, expect, chromium} = require('@playwright/test');
const POManager = require('../../../../page-objects/POManager');
require('dotenv').config()
const environment = "dev";
const envEmail = process.env[`lcp_email_${environment}`];
const envPass = process.env[`lcp_pass_${environment}`];
const node = "westeurope.azure";
const path = require('path');
let poManager;
let accesstoken, newaccesstoken;

test.describe.serial(`Allow copy of token without "Bearer" prefix from portal ui @ui-regression-${environment}-westeurope @pipeline1`, async () => {
    test.beforeEach(async ({ page }, testInfo) => {
        const testName = testInfo.title;
        const testFileName = path.basename(__filename);
        console.log(`Starting test on "${testFileName}" - "${testName}"`);
    });

    test.beforeAll(async ({browser}) => {
        poManager = new POManager(await browser.newPage());
    });

    test('Verify that when the user selects the option to copy the full authorization header, the token is correctly copied with "Bearer" prefix', async ({}) => {
        await poManager.page.goto(`https://portal.${environment}.lcp.ai`);
        console.log(await poManager.page.title());
        await poManager.page.waitForLoadState('networkidle');
        await new Promise(resolve => setTimeout(resolve, 3000));
        await poManager.LoginPage.acceptAllCookie.click();
        await poManager.LoginPage.loginToZen(envEmail, envPass);
        await new Promise(resolve => setTimeout(resolve, 3000));
        const locator = poManager.page.locator("#dropdown-button");
        await expect(locator).toBeVisible();
        await new Promise(resolve => setTimeout(resolve, 5000));
        await poManager.HomePage.selectOrgAccessAppBar("QA Tester Corporation");
        await new Promise(resolve => setTimeout(resolve, 5000));
        await poManager.HomePage.profileNameButton.click();
        await poManager.HomePage.profileMenu.click();
        await poManager.HomePage.selectCopyTokenOptionWithBearer('QA Tester Corporation');
        accesstoken = await poManager.page.evaluate(() => navigator.clipboard.readText());
        console.log(accesstoken);
        expect(accesstoken).toContain('Bearer ory');
        await poManager.page.keyboard.press('Escape');
        await poManager.HomePage.clickLogOutButton();
        await new Promise(resolve => setTimeout(resolve, 5000));
    });

   test('Verify that when user selects the option to copy the partial token, then it is correctly copied without the "Bearer" prefix', async ({}) => {
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
        await new Promise(resolve => setTimeout(resolve, 5000));
        await poManager.HomePage.selectOrgAccessAppBar("QA Tester Corporation");
        await new Promise(resolve => setTimeout(resolve, 5000));
        await poManager.HomePage.profileNameButton.click();
        await poManager.HomePage.profileMenu.click();
        await poManager.HomePage.selectCopyTokenOptionWithoutBearer('QA Tester Corporation');
        accesstoken = await poManager.page.evaluate(() => navigator.clipboard.readText());
        console.log(accesstoken);
        expect(accesstoken).not.toContain('Bearer');
        expect(accesstoken).toContain('ory');
        await poManager.page.keyboard.press('Escape');
        await poManager.HomePage.clickLogOutButton();
        await new Promise(resolve => setTimeout(resolve, 5000));
    }); 

    test('Verify that switching between full authorization and token-only copies works as expected', async ({}) => {
        await poManager.page.goto(`https://portal.${environment}.lcp.ai`);
        console.log(await poManager.page.title());
        await poManager.page.waitForLoadState('networkidle');
        await new Promise(resolve => setTimeout(resolve, 3000));
        await poManager.LoginPage.forgetMeButton.click();
        await poManager.LoginPage.loginToZen(envEmail, envPass);
        await new Promise(resolve => setTimeout(resolve, 3000));
        const locator = poManager.page.locator("#dropdown-button");
        await expect(locator).toBeVisible();
        await new Promise(resolve => setTimeout(resolve, 5000));
        await poManager.HomePage.selectOrgAccessAppBar("QA Tester Corporation");
        await new Promise(resolve => setTimeout(resolve, 5000));
        await poManager.HomePage.profileNameButton.click();
        await poManager.HomePage.profileMenu.click();
        await poManager.HomePage.selectCopyTokenOptionWithBearer('QA Tester Corporation');
        accesstoken = await poManager.page.evaluate(() => navigator.clipboard.readText());
        console.log(accesstoken);
        expect(accesstoken).toContain('Bearer ory');
        await poManager.HomePage.selectCopyTokenOptionWithoutBearer('QA Tester Corporation');
        accesstoken = await poManager.page.evaluate(() => navigator.clipboard.readText());
        console.log(accesstoken);
        expect(accesstoken).not.toContain('Bearer');
        expect(accesstoken).toContain('ory');
        await poManager.HomePage.selectCopyTokenOptionWithBearer('QA Tester Corporation');
        accesstoken = await poManager.page.evaluate(() => navigator.clipboard.readText());
        console.log(accesstoken);
        expect(accesstoken).toContain('Bearer ory');
        await poManager.page.keyboard.press('Escape');
        await poManager.HomePage.clickLogOutButton();
        await new Promise(resolve => setTimeout(resolve, 5000));
    });

    test('Verify that clicking on the copy button without selecting an option copies the full authorization header with the "Bearer" prefix', async ({}) => {
        await poManager.page.goto(`https://portal.${environment}.lcp.ai`);
        console.log(await poManager.page.title());
        await poManager.page.waitForLoadState('networkidle');
        await new Promise(resolve => setTimeout(resolve, 3000));
        await poManager.LoginPage.forgetMeButton.click();
        await poManager.LoginPage.loginToZen(envEmail, envPass);
        await new Promise(resolve => setTimeout(resolve, 3000));
        const locator = poManager.page.locator("#dropdown-button");
        await expect(locator).toBeVisible();
        await new Promise(resolve => setTimeout(resolve, 5000));
        await poManager.HomePage.selectOrgAccessAppBar("QA Tester Corporation");
        await new Promise(resolve => setTimeout(resolve, 5000));
        await poManager.HomePage.profileNameButton.click();
        await poManager.HomePage.profileMenu.click();
        await poManager.HomePage.copyToken(node,'QA Tester Corporation');
        accesstoken = await poManager.page.evaluate(() => navigator.clipboard.readText());
        console.log(accesstoken);
        expect(accesstoken).toContain('Bearer ory');
        await poManager.page.keyboard.press('Escape');
        await poManager.HomePage.clickLogOutButton();
        await new Promise(resolve => setTimeout(resolve, 5000));
    });

    test('Verify that the  token updates accordingly and the copied token is correct when a previously copied token has already expired', async ({}) => {
        await poManager.page.goto(`https://portal.${environment}.lcp.ai`);
        console.log(await poManager.page.title());
        await poManager.page.waitForLoadState('networkidle');
        await new Promise(resolve => setTimeout(resolve, 3000));
        await poManager.LoginPage.forgetMeButton.click();
        await poManager.LoginPage.loginToZen(envEmail, envPass);
        await new Promise(resolve => setTimeout(resolve, 3000));
        const locator = poManager.page.locator("#dropdown-button");
        await expect(locator).toBeVisible();
        await new Promise(resolve => setTimeout(resolve, 5000));
        await poManager.HomePage.selectOrgAccessAppBar("QA Tester Corporation");
        await new Promise(resolve => setTimeout(resolve, 5000));
        await poManager.HomePage.profileNameButton.click();
        await poManager.HomePage.profileMenu.click();
        await poManager.HomePage.selectCopyTokenOptionWithBearer('QA Tester Corporation');
        accesstoken = await poManager.page.evaluate(() => navigator.clipboard.readText());
        console.log(accesstoken);
        await poManager.page.keyboard.press('Escape');
        await poManager.HomePage.clickLogOutButton();
        await new Promise(resolve => setTimeout(resolve, 5000));
        await poManager.page.goto(`https://portal.${environment}.lcp.ai`);
        console.log(await poManager.page.title());
        await poManager.page.waitForLoadState('networkidle');
        await new Promise(resolve => setTimeout(resolve, 3000));
        await poManager.LoginPage.forgetMeButton.click();
        await poManager.LoginPage.loginToZen(envEmail, envPass);
        await new Promise(resolve => setTimeout(resolve, 3000));
        const newlocator = poManager.page.locator("#dropdown-button");
        await expect(newlocator).toBeVisible();
        await new Promise(resolve => setTimeout(resolve, 5000));
        await poManager.HomePage.selectOrgAccessAppBar("QA Tester Corporation");
        await new Promise(resolve => setTimeout(resolve, 5000));
        await poManager.HomePage.profileNameButton.click();
        await poManager.HomePage.profileMenu.click();
        await poManager.HomePage.selectCopyTokenOptionWithBearer('QA Tester Corporation');
        newaccesstoken = await poManager.page.evaluate(() => navigator.clipboard.readText());
        console.log(newaccesstoken);
        expect(accesstoken).not.toEqual(newaccesstoken);
        await poManager.page.keyboard.press('Escape');
        await poManager.HomePage.clickLogOutButton();
        await new Promise(resolve => setTimeout(resolve, 5000));
    });

    test('Verify that the copy of token correctly copies the token of the selected org', async ({}) => {
        await poManager.page.goto(`https://portal.${environment}.lcp.ai`);
        console.log(await poManager.page.title());
        await poManager.page.waitForLoadState('networkidle');
        await new Promise(resolve => setTimeout(resolve, 3000));
        await poManager.LoginPage.forgetMeButton.click();
        await poManager.LoginPage.loginToZen(envEmail, envPass);
        await new Promise(resolve => setTimeout(resolve, 3000));
        const locator = poManager.page.locator("#dropdown-button");
        await expect(locator).toBeVisible();
        await new Promise(resolve => setTimeout(resolve, 5000));
        await poManager.HomePage.selectOrgAccessAppBar("QA Tester Corporation");
        await new Promise(resolve => setTimeout(resolve, 5000));
        await poManager.HomePage.selectOrgAccessAppBar("zen");
        await new Promise(resolve => setTimeout(resolve, 5000));
        await poManager.HomePage.profileNameButton.click();
        await poManager.HomePage.profileMenu.click();
        await poManager.HomePage.selectCopyTokenOptionWithBearer('QA Tester Corporation');
        accesstoken = await poManager.page.evaluate(() => navigator.clipboard.readText());
        console.log(accesstoken);
        await poManager.HomePage.selectCopyTokenOptionWithBearer('zen');
        newaccesstoken = await poManager.page.evaluate(() => navigator.clipboard.readText());
        console.log(newaccesstoken);
        expect(accesstoken).not.toEqual(newaccesstoken);
        await poManager.page.keyboard.press('Escape');
        await poManager.HomePage.clickLogOutButton();
    });

});