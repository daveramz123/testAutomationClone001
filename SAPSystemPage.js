import { expect } from "@playwright/test"

export class SAPSystemPage {
    constructor(page) {
        this.page = page;

        this.Email = page.locator('[id="login-email-input"]');
        this.Lemon =page.locator('//button/img[@alt="Lemongrass"]');
        this.cookieConsent = page.locator('//button[normalize-space()="Accept All"]');
        this.passwordIcon = page.locator('//div[@class="MuiBox-root css-1b6sj8w"]');     //page.getByRole('img', { name: 'Icon' }).nth(1);
        this.loginButton = page.locator('//button[text()="Login"]');     //page.getByRole('button', { name: 'Login' });
        this.Password = page.locator('//input[contains(@placeholder, "your password")]');
        this.loginButton2 = page.locator('//button[contains(@class, "auth0-lock-submit")]');
        this.menuButton = page.locator('//button[contains(@class, "MuiButton-containedSizeMedium") and contains(@class, "css-fba9qg")]');
        this.MDO = page.locator('//*/p[text()="Minimized Downtime Operations"]');
        this.megaSearch = page.locator('[id="mega-search"]');
        this.selectOrg = page.locator('[data-testid="Entrypoint-Selector"]');
        this.showAllBtn = page.locator('//button[text()="Show All"]');
        this.validationEnviBtn = page.locator('//*/p[text()="Validation Environment"]');
        

    }

    goToLCPLandingPage = async () => {
        await this.page.goto('https://portal.qa.lcp.ai/LCPLanding');
        await this.cookieConsent.click();

    }

    loginToHomePage = async () => {
        const emailBox = this.Email;
        await expect(emailBox).toBeVisible();
        await emailBox.fill('demosap1@mail7.io');
        await this.passwordIcon.click();
        const loginbutton = this.loginButton;
        await expect(loginbutton).toBeVisible();
        await loginbutton.click();
        const passwordBox = this.Password;
        await expect(passwordBox).toBeVisible();
        await passwordBox.fill('demosap1@mail7.io');
        const loginbutton2 = this.loginButton2;
        await expect(loginbutton2).toBeVisible();
        await loginbutton2.click();

    }

   // checkOrg = async () => { 
   //     const lemon = this.Lemon;
   //     await expect(lemon).toBeVisible(); // or click
    //    await this.selectOrg.click();
    //    await this.showAllBtn.click();
  //      await this.validationEnviBtn.click();
        
   // }

  //  goToSAPSystemPage = async () => {
  //      await this.menuButton.click();
  //      await this.megaSearch.click();
  //      await this.megaSearch.fill('Minimized Downtime Operations');
  //      await this.MDO.click();

  //  }

//
}
