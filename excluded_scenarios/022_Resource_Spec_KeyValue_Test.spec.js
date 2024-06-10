const {test, expect, firefox, webkit, chromium} = require('@playwright/test');
const POManager = require('../../../../page-objects/POManager');
const Console = require("console");
const dataSet = require("../../../../utils/testData.json");
require('dotenv').config()
var fs = require("fs");
const config = require("../../../../config");
const environment = "dev";
const envEmail = process.env[`lcp_email_${environment}`];
const envPass = process.env[`lcp_pass_${environment}`];
const node = "westeurope.azure";
const path = require('path');
let poManager;
let poManager3;
let poManager2;
let accesstoken;
test.describe.serial(`Resource Spec Key Value Tests`, async () => {
    let userEmailRandom = Math.floor((Math.random() * 1000000) + 1);
    let userNameRandom = Math.floor((Math.random() * 1000000) + 1);
    let verificationLink;
    test.beforeEach(async ({ page }, testInfo) => {
        const testName = testInfo.title;
        const testFileName = path.basename(__filename);
        console.log(`Starting test on "${testFileName}" - "${testName}"`);
    });

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
        await poManager.HomePage.selectOrgAccessAppBar("zen");
        await new Promise(resolve => setTimeout(resolve, 5000)); // 3 sec
    });

    test('Verify New User Creation', async ({}) => {
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
        await poManager.UsersPage.AddGroup(dataSet.QAGroupResourceSpecKeyValue);
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
        await new Promise(resolve => setTimeout(resolve, 2000));
        const userId = await poManager.page.locator("(//div[@class='MuiDataGrid-row MuiDataGrid-row--lastVisible'])[2]").getAttribute('data-id');
        var loginDataObject = {
            "new_emailadd": `lg_qatester${userEmailRandom}@mail7.io`,
            "user_id": userId
        };
        fs.writeFile("utils/login_data.json", JSON.stringify(loginDataObject, null, 4), (err) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log("File has been created");
        });

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
                console.log("Refresh icon still not visible")
                await new Promise(resolve => setTimeout(resolve, 3000)); // 3 sec
                retries++;
            }
        }
        await expect(poManager3.HomePage.profileMenu).toBeVisible({timeout: 2000});
    });

    test('Get Access Token', async ({}) => {
        await poManager3.HomePage.profileMenu.click();
        await poManager3.HomePage.copyToken(node,'QA Tester Corporation');
        accesstoken = await poManager3.page.evaluate(() => navigator.clipboard.readText());
        accesstoken = accesstoken.replace("Bearer ", "");
        await new Promise(resolve => setTimeout(resolve, 20000)); // 3 sec

    });

    test('Test Resource Spec - Key / Value', async ({request}) => {

        const post = {description: "Body", label: "string"};
        const response = await request.post(`https://${node}.${environment}.lcp.ai/crud/v1/test/pep-test/query`, {
            headers: {
                'Authorization': `Bearer ${accesstoken}`,
                'content-type': 'application/json',
                'x-lcp-act-tenantid': '888',
            },
            data: JSON.stringify(post),
        });

        await expect(response).toBeOK();

    });


});


