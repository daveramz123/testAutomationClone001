const {test, expect, firefox, webkit, chromium} = require('@playwright/test');
const POManager = require('../../../../page-objects/POManager');
const Console = require("console");
const dataSet = JSON.parse(JSON.stringify(require('../../../../utils/testData.json')));
require('dotenv').config()
var fs = require("fs");
const config = require("../../../../config");
const environment = "dev";
const envEmail = process.env[`lcp_email_${environment}`];
const envPass = process.env[`lcp_pass_${environment}`];
const node = "westeurope.azure";

let poManager;
let poManager3;
let poManager2;

test.describe(`Verify that if cross organization group mapping is deleted the organization should not be displayed in user\'s account organization dropdown`, async () => {
    let userEmailRandom = Math.floor((Math.random() * 1000000) + 1);
    let userNameRandom = Math.floor((Math.random() * 1000000) + 1);
    let verificationLink;
    test.beforeAll(async ({browser}) => {
        poManager = new POManager(await browser.newPage());
        poManager2 = new POManager(await browser.newPage());
        poManager3 = new POManager(await browser.newPage());
    });

    test('Login To Zen', async ({}) => {
        await poManager.page.goto(`https://portal.${environment}.lcp.ai`);
        console.log(await poManager.page.title());
        await poManager.page.waitForLoadState('networkidle');
        await new Promise(resolve => setTimeout(resolve, 3000));
        await poManager.LoginPage.acceptAllCookie.click();
        await poManager.LoginPage.loginToZen(envEmail, envPass);
        await poManager.page.waitForLoadState('networkidle');
        await new Promise(resolve => setTimeout(resolve, 3000)); // 3 sec
        const locator = poManager.page.locator("#dropdown-button");
        await expect(locator).toBeVisible();
        await new Promise(resolve => setTimeout(resolve, 5000)); // 3 sec
        await poManager.HomePage.selectOrgAccessAppBar("QA Tester Corporation");
        await new Promise(resolve => setTimeout(resolve, 5000)); // 3 sec
    });

    test('Create new Cross Org Group Mappings', async ({}) => {
        await poManager.page.goto(`https://portal.${environment}.lcp.ai/ui/admin/cross-organization-groups`);
        await new Promise(resolve => setTimeout(resolve, 5000)); // 3 sec
        await poManager.CrossOrgPage.createCrossOrgGroupMappingButton.click();
        await poManager.CrossOrgPage.selectSourceOrg('zen');
        await poManager.CrossOrgPage.selectSourceGroup('zen-test-cross-org')
        await poManager.CrossOrgPage.selectTargetOrg('QA Tester Corporation');
        await poManager.CrossOrgPage.selectTargetGroup('qa-test-cross-org')
        await poManager.CrossOrgPage.addMappingButton.click();
        await new Promise(resolve => setTimeout(resolve, 3000)); // 3 sec
        await poManager.CrossOrgPage.refreshIcon.click();
        await poManager.CrossOrgPage.filterExternalGroupId('2RSc4KxM_KwM'); // external group ID of zen org
        await new Promise(resolve => setTimeout(resolve, 2000));
        await poManager.CrossOrgPage.crossOrgColumns.first().textContent();
        const allCrossOrgValue = await poManager.CrossOrgPage.crossOrgColumns.allTextContents();
        await expect(allCrossOrgValue.find((el) => el.includes("2RSc4KxM_KwM"))).toBeDefined();
    });

    test('Create a new user using the newly created group for QA Tester Corp org', async ({}) => {
        await poManager.HomePage.selectOrgAccessAppBar("QA Tester Corporation"); // De-select QA Tester Corp
        await new Promise(resolve => setTimeout(resolve, 5000)); // 3 sec
        await poManager.page.goto(`https://portal.${environment}.lcp.ai/ui/admin`);
        await new Promise(resolve => setTimeout(resolve, 5000)); // 3 sec
        await poManager.page.goto(`https://portal.${environment}.lcp.ai/ui/admin/users`);
        await new Promise(resolve => setTimeout(resolve, 5000)); // 3 sec
        let retries = 0;
        while (retries < 20)
            try {
                await poManager.page.reload();
                await poManager.UsersPage.refreshIcon.click({timeout: 20000});
                break;
            } catch (e) {
                console.log("Refresh icon still not visible")
                await new Promise(resolve => setTimeout(resolve, 10000)); // 3 sec
                retries++;
            }
        await poManager.page.reload();
        await new Promise(resolve => setTimeout(resolve, 5000)); // 3 sec
        await poManager.UsersPage.createUser.click();
        await poManager.page.waitForURL(`https://portal.${environment}.lcp.ai/ui/admin/users/create`, { timeout: 10000 });
        await expect(poManager.page.url()).toEqual(`https://portal.${environment}.lcp.ai/ui/admin/users/create`);
        await new Promise(resolve => setTimeout(resolve, 3000)); // 3 sec
        await poManager.UsersPage.fillUpForm(`lg_qatester${userEmailRandom}@mail7.io`, `lgqatester${userNameRandom}`);
        await poManager.UsersPage.selectStatus(dataSet.userStatus);
        await new Promise(resolve => setTimeout(resolve, 3000)); // 3 sec
        await poManager.UsersPage.AddGroup(dataSet.zenGroupName);
        await new Promise(resolve => setTimeout(resolve, 3000)); // 3 sec
        await poManager.UsersPage.createUserButton.click()
        await new Promise(resolve => setTimeout(resolve, 3000)); // 3 sec
        await poManager.UsersPage.refreshIcon.click();
        await new Promise(resolve => setTimeout(resolve, 10000));
        await poManager.UsersPage.filterEmail(`lg_qatester${userEmailRandom}@mail7.io`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        await poManager.UsersPage.usersColumn.first().textContent();
        const allUsersValue = await poManager.UsersPage.usersColumn.allTextContents();
        await expect(allUsersValue.find((el) => el.includes(`lg_qatester${userEmailRandom}@mail7.io`))).toBeDefined();
        await expect(allUsersValue.find((el) => el.includes(`lgqatester${userNameRandom}`))).toBeDefined();

    });

    test('Register User', async ({}) => {
        await poManager3.page.goto(`https://portal.${environment}.lcp.ai`);
        console.log(await poManager3.page.title());
        await new Promise(resolve => setTimeout(resolve, 3000)); // 3 sec
        await poManager3.LoginPage.signUpToZen(`lg_qatester${userEmailRandom}@mail7.io`, process.env.default_pass);
        console.log(`lg_qatester${userEmailRandom}@mail7.io`);
    });

    test('Verify Email Verification Test', async ({}) => {
        await poManager2.DisposableEmail.verifyEmailUsingMail7(`lg_qatester${userEmailRandom}@mail7.io`);
        await expect(poManager2.page.frameLocator('iframe').locator("//a[normalize-space()='Click Here to Verify']")).toBeVisible({timeout: 5000});
        verificationLink = await poManager2.page.frameLocator('iframe').locator("//a[contains(@href,'lcp')]").getAttribute("href");
        console.log(verificationLink);
        await poManager3.page.goto(verificationLink);
        await new Promise(resolve => setTimeout(resolve, 2000));

    });

    test('Verify New User Login', async ({}) => {
        try {
            await poManager3.LoginPage.continueButton.click({timeout: 15000});
        } catch (e) {
            console.log("Continue button not clickable")
        }
        await new Promise(resolve => setTimeout(resolve, 5000)); // 5 sec
        let retries = 0;
        while (retries < 10) {
            try {
                await poManager3.page.reload();
                await poManager3.HomePage.profileNameButton.click({timeout: 15000});
                break;
            } catch (e) {
                console.log("Profile button not visible")
                await new Promise(resolve => setTimeout(resolve, 3000)); // 3 sec
                retries++;
            }
        }
        await expect(poManager3.HomePage.profileMenu).toBeVisible({timeout: 2000});
    });

    test('Verify QA Tester and Zen are displayed in the  dropdown org list', async ({}) => {
        await poManager3.HomePage.newAppBar.click({timeout: 15000});
        await poManager3.HomePage.showAll.click();
        await expect(poManager.page.locator('text=QA Tester Corporationzen')).toBeVisible({timeout: 2000});
        await poManager3.HomePage.clickLogOutButton();
    });

    test('Delete the cross org group mappings', async ({}) => {
        await poManager.page.goto(`https://portal.${environment}.lcp.ai/ui/admin/cross-organization-groups`);
        await new Promise(resolve => setTimeout(resolve, 5000)); // 3 sec
        await poManager.CrossOrgPage.filterExternalGroupId('2RSc4KxM_KwM'); // external group ID of zen org
        await new Promise(resolve => setTimeout(resolve, 2000));
        await poManager.CrossOrgPage.deleteIcon.click();
        await new Promise(resolve => setTimeout(resolve, 3000));
        await poManager.CrossOrgPage.filterExternalGroupId('2RSc4KxM_KwM'); // external group ID of zen org
        await poManager.CrossOrgPage.crossOrgColumns.first().textContent();
        const allCrossOrgValue = await poManager.CrossOrgPage.crossOrgColumns.allTextContents();
        await expect(allCrossOrgValue.find((el) => !el.includes("2RSc4KxM_KwM"))).toBeDefined();
    });

    test('Re-Login test account and verify if QA Test Corporation is not accessible', async ({}) => {
        await poManager3.page.goto(`https://portal.${environment}.lcp.ai`);
        console.log(await poManager.page.title());
        await poManager3.page.waitForLoadState('networkidle');
        await new Promise(resolve => setTimeout(resolve, 3000)); // 3 sec
        await poManager3.LoginPage.loginToZen(`lg_qatester${userEmailRandom}@mail7.io`, process.env.default_pass);
        await poManager.page.waitForLoadState('networkidle');
        await new Promise(resolve => setTimeout(resolve, 3000)); // 3 sec
        const locator = poManager.page.locator("#dropdown-button");
        await expect(locator).toBeVisible();
        await poManager3.HomePage.newAppBar.click({timeout: 15000});
        await poManager3.HomePage.showAll.click();
        await expect(poManager.page.locator('text=QA Tester Corporationzen')).not.toBeVisible({timeout: 2000});
        await expect(poManager.page.locator('text=zen')).toBeVisible({timeout: 2000});
    });

    test('Verify Delete User', async ({}) => {
        await poManager.page.goto(`https://portal.${environment}.lcp.ai/ui/admin/users`);
        await poManager.UsersPage.refreshIcon.click();
        await new Promise(resolve => setTimeout(resolve, 10000));
        await poManager.UsersPage.filterEmail(`lg_qatester${userEmailRandom}@mail7.io`);
        await poManager.UsersPage.deleteIcon.click();
        await poManager.UsersPage.deleteButton.click();
        await new Promise(resolve => setTimeout(resolve, 3000));
        await poManager.UsersPage.filterEmail(`lg_qatester${userEmailRandom}@mail7.io`);
        await poManager.UsersPage.usersColumn.first().textContent();
        const allUsersValue = await poManager.UsersPage.usersColumn.allTextContents();
        await expect(allUsersValue.find((el) => !el.includes(`lg_qatester${userEmailRandom}@mail7.io`))).toBeDefined();
    });

});


