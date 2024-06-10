const {test, expect, chromium} = require('@playwright/test');
const POManager = require('../../../page-objects/POManager');
require('dotenv').config()
const environment = "prodEU";
const envEmail = process.env[`lcp_email_${environment}`];
const envPass = process.env[`lcp_pass_${environment}`];
const envSecretKey = process.env['secretkey'];
const node = "eu-west-1.aws";
const path = require('path');
let poManager;
let i = "Running";




test.describe.serial('test', async () => {
    test.beforeEach(async ({ browser }, testInfo) => {
        const testName = testInfo.title;
        const testFileName = path.basename(__filename);
        console.log(`Starting test on "${testFileName}" - "${testName}"`);
    });

    test.beforeAll(async ({browser}) => {
        poManager = new POManager(await browser.newPage());
    });

  test('Verify when user redeploy Sap System from System Builder', async ({}) => {
        await poManager.page.goto('https://www.lcp.ai/');
        console.log(await poManager.page.title());
        await poManager.page.waitForLoadState('networkidle');
        await new Promise(resolve => setTimeout(resolve, 3000));
        await poManager.LoginPage.acceptAllCookie.click();
        await poManager.LoginPage.selectNode(node);
        await poManager.LoginPage.loginWithMFA(envEmail, envPass, envSecretKey);
        await new Promise(resolve => setTimeout(resolve, 3000));
        await poManager.HomePage.selectOrgAccessAppBar('OTIS');
        await new Promise(resolve => setTimeout(resolve, 3000));
        await poManager.HomePage.selectOrgAccessAppBar('Lemongrass Consulting');
        await new Promise(resolve => setTimeout(resolve, 3000));
        await poManager.SystemBuilderPage.goToSystemBuilder();
        await poManager.SystemBuilderPage.sidFilter();
        await poManager.SystemBuilderPage.redeployButton.click();
        await poManager.SystemBuilderPage.deploySteps();
        await poManager.page.bringToFront();
        await new Promise(resolve => setTimeout(resolve, 8000));
        const workflowstatus = await poManager.SystemBuilderPage.workflowStatus.textContent();
        expect(workflowstatus).toHaveText('Running');
        await poManager.SystemBuilderPage.waitForWorkflowStatus();
        await expect(workflowstatus).toHaveText('Succeeded');
        
        
    }); 

    test('Verify when user clone Sap System from System Builder', async ({}) => {
        await poManager.page.goto('https://www.lcp.ai/');
        console.log(await poManager.page.title());
        await poManager.page.waitForLoadState('networkidle');
        await new Promise(resolve => setTimeout(resolve, 3000));
        await poManager.LoginPage.acceptAllCookie.click();
        await poManager.LoginPage.selectNode(node);
        await poManager.LoginPage.loginWithMFA(envEmail, envPass, envSecretKey);
        await new Promise(resolve => setTimeout(resolve, 3000));
        await poManager.HomePage.selectOrgAccessAppBar('OTIS');
        await new Promise(resolve => setTimeout(resolve, 3000));
        await poManager.HomePage.selectOrgAccessAppBar('Lemongrass Consulting');
        await new Promise(resolve => setTimeout(resolve, 3000));
        await poManager.SystemBuilderPage.goToSystemBuilder();
        await poManager.SystemBuilderPage.sidFilter();
        await poManager.SystemBuilderPage.cloneSteps();
        await poManager.SystemBuilderPage.deploySteps();
        await poManager.page.bringToFront();
        await new Promise(resolve => setTimeout(resolve, 8000));
        const workflowStatus = await poManager.SystemBuilderPage.workflowStatus.textContent();
        await expect(workflowStatus).toHaveText('Running');
        //await poManager.SystemBuilderPage.verifyWorkflowStatus();
        await expect(workflowStatus).toHaveText('Succeeded');
        
    }); 


});