const {test, expect, firefox, webkit, chromium} = require('@playwright/test');
const POManager = require('../../../../page-objects/POManager');
const Console = require("console");
const dataSet = require("../../../../utils/testData.json");
const loginData = JSON.parse(JSON.stringify(require("../../../../utils/login_data.json")));
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
test.describe.serial(`test`, async () => {
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

    test('Update Role', async ({}) => {
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
        try {
            await poManager.page.evaluate(() => document.getElementsByClassName('MuiDataGrid-virtualScroller')[0].scroll({
                top: 10000,
                left: 0,
                behavior: 'smooth'
            }));
        } catch (e) {
            console.log("Scroll Bar Not available")
        }
        await new Promise(resolve => setTimeout(resolve, 2000));
        await poManager.UsersPage.clickEditIcon(loginData.user_id);
        await poManager.page.waitForURL(`https://portal.${environment}.lcp.ai/ui/admin/users/edit`, { timeout: 10000 });
        await expect(poManager.page.url()).toEqual(`https://portal.${environment}.lcp.ai/ui/admin/users/edit`);
        await new Promise(resolve => setTimeout(resolve, 3000)); // 3 sec
        await poManager.UsersPage.deleteGroupButton.click();
        await new Promise(resolve => setTimeout(resolve, 3000)); // 3 sec
        await poManager.UsersPage.updateUserButton.click();
        await poManager.UsersPage.refreshIcon.click({timeout: 20000});
        await new Promise(resolve => setTimeout(resolve, 5000)); // 3 sec
        try {
            await poManager.page.evaluate(() => document.getElementsByClassName('MuiDataGrid-virtualScroller')[0].scroll({
                top: 10000,
                left: 0,
                behavior: 'smooth'
            }));
        } catch (e) {
            console.log("Scroll Bar Not available")
        }
        await new Promise(resolve => setTimeout(resolve, 2000));
        await poManager.UsersPage.clickEditIcon(loginData.user_id);
        await new Promise(resolve => setTimeout(resolve, 2000));
        await poManager.UsersPage.AddGroup(dataSet.QAGroupFilterFieldWithRecordFilter);
        await new Promise(resolve => setTimeout(resolve, 3000)); // 3 sec
        await poManager.UsersPage.updateUserButton.click()
        await new Promise(resolve => setTimeout(resolve, 3000)); // 3 sec
        await poManager.UsersPage.refreshIcon.click();

    });

    test('Verify User Login', async ({}) => {
        await poManager3.page.goto(`https://portal.${environment}.lcp.ai`);
        await poManager3.page.waitForLoadState('networkidle');
        await new Promise(resolve => setTimeout(resolve, 3000)); // 3 sec
        await poManager3.LoginPage.loginToZen(loginData.new_emailadd, process.env.default_pass);
        await poManager3.page.waitForLoadState('networkidle');
        await new Promise(resolve => setTimeout(resolve, 3000)); // 3 sec
        const locator = poManager3.page.locator("#dropdown-button");
        await expect(locator).toBeVisible();
        await new Promise(resolve => setTimeout(resolve, 5000)); // 3 sec
        await poManager3.page.goto(`https://portal.${environment}.lcp.ai/ui/admin/users`);
        await new Promise(resolve => setTimeout(resolve, 3000)); // 3 sec
        let retries = 0;
        while (retries < 15)
            try {
                await poManager3.page.reload();
                await poManager3.HomePage.profileNameButton.click({timeout: 20000});
                break;
            } catch (e) {
                console.log("Refresh icon still not visible")
                await new Promise(resolve => setTimeout(resolve, 10000)); // 3 sec
                retries++;
            }
    });

    test('Get Access Token', async ({}) => {
        await poManager3.HomePage.profileMenu.click();
        await poManager3.HomePage.copyToken(node,'QA Tester Corporation');
        accesstoken = await poManager3.page.evaluate(() => navigator.clipboard.readText());
        accesstoken = accesstoken.replace("Bearer ", "");
        await new Promise(resolve => setTimeout(resolve, 20000)); // 3 sec

    });

    test('Response if permission includes record filter and field filter', async ({request}) => {

        const post = {description: "Body", label: "string"};
        const response = await request.post(`https://${node}.${environment}.lcp.ai/crud/v1/test/pep-test/query`, {
            headers: {
                'Authorization': `Bearer ${accesstoken}`,
                'content-type': 'application/json',
                'x-lcp-act-tenantid': '0',
            },
            data: JSON.stringify(post),
        });

        await expect(response).toBeOK();

        var respBody = JSON.stringify(await response.json());

        await expect(respBody.includes("name")).toBeTruthy();
        await expect(respBody.includes("createdBy")).toBeTruthy();
        await expect(respBody.includes("id")).toBeTruthy();
        await expect(respBody.includes("\"expectedResult\":\"pass\"")).toBeTruthy();
        await expect(respBody.includes("\"expectedResult\":\"false\"")).toBe(false);
    });

});


