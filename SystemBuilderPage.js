const {authenticator} = require("../../regression-suite/node_modules/otplib");
const {expect} = require("@playwright/test");

class SystemBuilderPage {
    constructor(page) {
        this.page = page;

        this.passwordLogo = page.locator("(//img[@alt='Icon'])[2]");
        this.email = page.locator("//input[@id='login-email-input']");
        this.loginButtonLCPLanding = page.locator("//button[contains(text(),'Login')]");
        this.userName = page.locator("//input[@name='email']");
        this.password = page.locator("//input[@name='password']");
        this.loginButton = page.locator("button[name='submit']");
        this.recoveryCode = page.locator("//a[normalize-space()='Use the recovery code']");
        this.enterCode = page.locator("//input[@placeholder='Enter your code here']");
        this.sixDigitMFACode = page.locator('[placeholder="Enter the 6-digit code"]');
        this.loginMFAbutton = page.locator('#Login');

        this.nodeDropdown = page.locator('//div[@id="lcp-home-node-checkbox"]');
        this.euWest1 = page.locator('//span[normalize-space()="eu-west-1.aws"]');
        this.cookieConsent = page.locator('//button[normalize-space()="Accept All"]');
        this.megaSearch = page.locator('//input[@id="mega-search"]');
        this.popupSearch = page.locator('//input[@id="search"]');
        this.autopilotModule = page.locator('//p[normalize-space()="AutoPilot (System Builder)"]');
        this.publishTab = page.locator('//a[normalize-space()="Published"]');
        this.checkingOrg = page.locator('(//span[@class="MuiTypography-root MuiTypography-body1 css-1k9swes"])[1]');
        this.pipeline = page.locator('//div[@id=":r99:"]');
        this.option1 = page.locator('//li[@role="option"]');
        this.branch = page.locator('//div[@id=":r9a:"]');
        this.option2 = page.locator('//li[normalize-space()="main"]');
        this.variableGroup = page.locator('//div[@id=":r9b:"]');
        this.option3 = page.locator('//li[normalize-space()="Settings - Workload"]');
        this.tickBoxAcceptTerms = page.locator('//input[@name="acceptTerms"]');
        this.deployButton = page.locator('//button[normalize-space()="Deploy"]');

        this.sidColumn = page.locator("//div[@aria-label='SID']")
        this.sidThreeDotElement = page.locator("(//button//*[@data-testid='TripleDotsVerticalIcon'])[1]");
        this.filterButton = page.locator("//li[normalize-space()='Filter']");
        this.filterField = page.locator("(//*[@placeholder='Filter value'])[1]");
        this.redeployButton = page.locator("//button[@title='Deploy']").first();

        this.cloneButton = page.locator("//button[@title='Clone']");
        this.sapSID = page.locator('//input[@name="bom_install.web_sid"]');
        this.dbSID = page.locator('//input[@name="bom_install.web_sid"]');
        this.webSID = page.locator('//input[@name="bom_install.web_sid"]');
        this.nextButton = page.locator("//button[normalize-space()='Next']");
        this.hostNameDB = page.locator("//input[@id=':r4j:']");
        this.hostNameSCS = page.locator("//input[@id=':r4v:']");
        this.hostNamePAS = page.locator("//input[@id=':r60:']");
        this.virtualFqDb = page.locator("//input[@id=':rkm:']");
        this.virtualNameDB = page.locator("//input[@id=':rks:']");
        this.virtualFqSCS1 = page.locator("//input[@id=':rl1:']");
        this.virtualFqSCS2 = page.locator("//input[@id=':rl8:']");
        this.virtualNameSCS = page.locator("//input[@id=':rle:']");
        this.virtaulNamePAS = page.locator("//input[@id=':rlj:']");
        this.pubDeploy = page.locator("//button[normalize-space()='Publish & Deploy Now']");

        this.workflowStatus = page.locator("//span[@class='MuiChip-label MuiChip-labelMedium css-9iedg7']");
        this.viewWorkflowButton = page.locator("//a[normalize-space()='View Workflow']");


    }

    async loginWithMFA(username, password, secretKey) {
        await new Promise(resolve => setTimeout(resolve, 3000)); // 3 sec
        await this.nodeDropdown.click();
        await this.euWest1.click();
        await this.passwordLogo.click({timeout: 50000});
        await this.email.type(username);
        await new Promise(resolve => setTimeout(resolve, 2000)); // 3 sec
        await this.loginButtonLCPLanding.click();
        await new Promise(resolve => setTimeout(resolve, 5000)); // 3 sec
        await this.userName.click({timeout: 50000});
        await this.userName.clear();
        await this.userName.type(username);
        await new Promise(resolve => setTimeout(resolve, 5000)); // 3 sec
        await this.password.type(password);
        await this.loginButton.click();
        const token = authenticator.generate(secretKey);
        await new Promise(resolve => setTimeout(resolve, 5000)); // 3 sec
        await this.sixDigitMFACode.type(token);
        await new Promise(resolve => setTimeout(resolve, 2000)); // 3 sec
        await this.loginMFAbutton.click();

}

    async goToSystemBuilder() {
        await this.megaSearch.click();
        await new Promise(resolve => setTimeout(resolve, 10000));
        await this.popupSearch.fill("Autopilot");
        await new Promise(resolve => setTimeout(resolve, 10000));
        await this.autopilotModule.click();
        await this.publishTab.click();

    }

    async sidFilter() {
        await this.sidColumn.hover();
        await this.page.waitForTimeout(1000);
        await this.sidThreeDotElement.click();
        await this.page.waitForTimeout(1000);
        await this.filterButton.click();
        await this.filterField.click();
        await this.filterField.type("OT3");    // test data and for testing purposes
        await this.publishTab.click();
        await this.page.waitForTimeout(10000);
        //await this.redeployButton.click();
        //await new Promise(resolve => setTimeout(resolve, 10000));
        

    }

    async deploySteps() {
        //await this.pipeline.click();
        //await this.option1.click();
        //await this.branch.click();
        //await this.option2.click();
        //await this.variableGroup.click();
        //await this.option3.click();
        await this.tickBoxAcceptTerms.click();
        await this.deployButton.click();
        await this.viewWorkflowButton.click();

    }

    /*async verifyWorkflowStatus() {
        let workflowstatus = "";
        while (workflowstatus !== "Succeeded") {
        workflowstatus = await this.workflowStatus.textContent(); 
        }
    
        return workflowstatus;


        let workflowStatus
    
            if (!poManager.SystemBuilderPage.isClosed()) {
                workflowStatus = await this.workflowStatus.textContent();
                return workflowStatus;
            }
                else {
                    console.log('Page is closed. Unable to access workflow status.');
                    return 'Closed';
                }
                
    }*/

    async waitForWorkflowStatus() {
    await this.page.bringToFront();
    let retries = 0;
    const MAX_RETRIES = 7200;
    const RETRY_INTERVAL = 10000;

        async function checkWorkflowStatus() {
            if (!poManager.SystemBuilderPage.isClosed()) {
                workflowStatus = await poManager.SystemBuilderPage.workflowStatus.textContent();
                return workflowStatus;
            } else {
                console.log('Page is closed. Unable to access workflow status.');
                return 'Closed';
            }
        }

        const timeout = setTimeout(() => {
            console.log('Timeout exceeded.');
            clearInterval(interval);
        }, 2 * 60 * 60 * 1000);

        const interval = setInterval(async () => {
            const status = await checkWorkflowStatus();
                if (status === 'Succeeded') {
                    console.log('Workflow status is "Succeeded".');
                    clearInterval(interval);
                    clearTimeout(timeout);
                } else if (status === 'Failed') {
                    console.log('Workflow status is "Failed".');
                    clearInterval(interval);
                    clearTimeout(timeout);
                } else if (status === 'Closed') {
                    console.log('Page is closed. Exiting loop.');
                    clearInterval(interval);
                    clearTimeout(timeout);
                } else {
                    console.log(`Workflow status is "${status}". Retrying...`);
                    retries++;
                    if (retries >= MAX_RETRIES) {
                        console.log('Maximum number of retries reached. Exiting loop.');
                        clearInterval(interval);
                        clearTimeout(timeout);
                    }
                }
        }, RETRY_INTERVAL);
    }

    async cloneSteps() {
        await this.cloneButton.click();
        await this.page.waitForTimeout(10000);
        await this.sapSID.click();
        await this.sapSID.type("QQ7");
        await this.dbSID.click();
        await this.dbSID.type("QQ8");
        await this.nextButton.click();
        await this.nextButton.click();
        await this.nextButton.click();
        await new Promise(resolve => setTimeout(resolve, 3000));
        await this.hostNameDB.click();
        await this.hostNameDB.type("lcqq7db");
        await this.nextButton.click();
        await this.hostNameSCS.click();
        await this.hostNameSCS.type("lcqq7scs");
        await this.nextButton.click();
        await this.hostNamePAS.click();
        await this.hostNamePAS.type("lcqq7pas");
        await this.nextButton.click();
        await this.virtualFqDb.click();
        await this.virtualFqDb.type("uxqq7db");
        await this.virtualNameDB.click();
        await this.virtualNameDB.type("vtqq7db");
        await this.nextButton.click();
        await this.virtualFqSCS1.click();
        await this.virtualFqSCS1.type("vtqq7scs");
        await this.virtualFqSCS2.click();
        await this.virtualFqSCS2.type("vtqq8scs");
        await this.virtualNameSCS.click();
        await this.virtualNameSCS.type("vtqq7scs");
        await this.nextButton.click();
        await this.virtaulNamePAS.click();
        await this.virtaulNamePAS.type("vtqq7pas");
        await this.nextButton.click();
        await this.nextButton.click();
        await this.nextButton.click();
        await new Promise(resolve => setTimeout(resolve, 3000));
        await this.nextButton.click();
        await this.nextButton.click();
        await this.pubDeploy.click();
        await new Promise(resolve => setTimeout(resolve, 5000));

    }
}
module.exports = SystemBuilderPage;