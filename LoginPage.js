const {authenticator} = require("otplib");

class LoginPage {
    constructor(page) {
        this.page = page;
        this.userName = page.locator("//input[@name='email']");
        this.password = page.locator("//input[@name='password']");
        this.loginButton = page.locator("button[name='submit']");
        this.signUpTab = page.locator('text=Sign Up');
        this.signUpButton = page.locator('[aria-label="Sign Up"]');
        this.checkBox = page.locator("//input[@type='checkbox']");
        this.continueButton = page.locator("//button[contains(text(),'Continue')]");
        this.email = page.locator("//input[@id='login-email-input']");
        this.loginButtonLCPLanding = page.locator("//button[contains(text(),'Login')]");
        //this.nodeDropdown = page.locator('//div[@id="lcp-home-node-checkbox"]');
        //this.euWest1 = page.locator('//span[normalize-space()="eu-west-1.aws"]');
        // this.passwordLogo = page.locator("//img[@alt='Password logo']");
        this.passwordLogo = page.locator("(//img[@alt='Icon'])[2]");
        this.welcomeTitle = page.locator("//div[@title='Welcome']");
        this.nodeCheckbox = page.locator("//div[@id='lcp-home-node-checkbox']");
        this.loginWithMSWork = page.locator('text=Log in with Microsoft Work');
        this.emailMS = page.locator("//input[@type='email']");
        this.nextButtonMS = page.locator("//input[@type='submit']");
        this.passwordMS = page.locator("//input[@type='password']");
        this.signInButtonMS = page.locator("//input[@type='submit']");
        this.useVerificationCode = page.locator("//div[contains(text(),'Use a verification code')]");
        this.code = page.locator("//input[@name='otc']");
        this.verifyButton = page.locator("//input[@type='submit']");
        this.loginWithGoogleIcon = page.locator('div:nth-child(3) > .MuiBox-root > img')
        this.nextButtonGoogle = page.locator("//span[normalize-space()='Next']");
        this.passwordGoogle = page.locator("//input[@type='password']");
        this.clearLoginStateButton = page.locator("//button[normalize-space()='Clear Login State']");
        this.emailGoogle = page.locator("//input[@type='email']");
        this.forgetMeButton = page.locator("//button[normalize-space()='Forget me']");
        this.rememberMeButton = page.locator("//input[@type='checkbox']");
        this.passwordLogoWithMFA = page.locator("(//img[@alt='Icon'])[6]");
        this.userAuthenticatorButton = page.locator("//button[@id='totp-submit']");
        this.authenticationCode = page.locator("//input[@id='mui-1']");
        this.passwordMFA = page.locator("//input[@id='outlined-adornment-password']");
        this.signInMFA = page.locator("//button[@id='password-submit']");
        this.emailMFA = page.locator("//input[@type='email']");
        this.signUpMFAButton = page.locator("//button[@id='password-submit']");
        this.dontRememberYourPassword = page.locator("(//a[contains(text(),'remember your password')])[1]");
        this.emailForgetPassword = page.locator("//input[@type='email']");
        this.submitForgetPasswordButton = page.locator("//button[@id='code-submit']");
        this.changePasswordTextField = page.locator("//input[@id='outlined-adornment-password']");
        this.saveButton = page.locator("//input[@id='outlined-adornment-password']");
        this.signInButton = page.locator("//button[@id='password-submit']");
        this.saveButtonChangePassword = page.locator("//button[@id='password-submit']");
        this.microsoftPersonalLogo = page.locator("(//img[@alt='Icon'])[4]");
        this.loginWithMSPersonalButton = page.locator("//div[@class='auth0-lock-social-button-text']");
        this.microsoftPasswordTextBox = page.locator("//input[@name='passwd']");
        this.googleLogo = page.locator("(//img[@alt='Icon'])[3]");
        this.sixDigitMFACode = page.locator('[placeholder="Enter the 6-digit code"]');
        this.loginMFAbutton = page.locator('#Login');
        this.cookieConsent = page.locator("//h5[text()='Cookie Consent']");
        this.acceptAllCookie = page.locator("//button[text()='Accept All']");

    }
    async loginToZen(username, password) {
        await new Promise(resolve => setTimeout(resolve, 3000)); // 3 sec
        await this.passwordLogo.click({timeout: 50000});
        await this.email.type(username);
        await new Promise(resolve => setTimeout(resolve, 2000)); // 3 sec
        await this.loginButtonLCPLanding.click();
        await new Promise(resolve => setTimeout(resolve, 5000)); // 3 sec
        // await this.welcomeTitle.isVisible({timeout: 50000});
        await this.userName.click({timeout: 50000});
        await this.userName.clear();
        await this.userName.type(username);
        await new Promise(resolve => setTimeout(resolve, 5000)); // 3 sec
        await this.password.type(password);
        await this.loginButton.click();
      
    }
    async loginUsingNewTab(username, password) {
        await new Promise(resolve => setTimeout(resolve, 3000)); // 3 sec
        await this.passwordLogo.click({timeout: 50000});
        await this.email.type(username);
        await new Promise(resolve => setTimeout(resolve, 2000)); // 3 sec
        await this.loginButtonLCPLanding.click();
        await new Promise(resolve => setTimeout(resolve, 5000)); // 3 sec
    }

    async reLoginToZen(username, password) {
        await this.loginButtonLCPLanding.click();
        await new Promise(resolve => setTimeout(resolve, 5000)); // 3 sec
        try {
            await this.userName.click({timeout: 50000});
            await this.userName.clear();
            await this.userName.type(username);
            await new Promise(resolve => setTimeout(resolve, 5000)); // 3 sec
            await this.password.type(password);
            await this.loginButton.click();
        } catch (e) {
        }
    }
    async loginToZenViaMS(username, password, secretkey) {
        await this.email.type(username);
        await this.loginButtonLCPLanding.click();
        await new Promise(resolve => setTimeout(resolve, 5000)); // 3 sec
        // await this.welcomeTitle.isVisible({timeout: 50000});
        await this.loginWithMSWork.click();
        await this.emailMS.type(username);
        await this.nextButtonMS.click();
        await this.passwordMS.type(password);
        await this.signInButtonMS.click();
        await new Promise(resolve => setTimeout(resolve, 3000)); // 3 sec
        try {
            await this.useVerificationCode.click({timeout: 5000});
            const token2 = authenticator.generate(secretkey);
            await this.code.fill(token2);
            await this.verifyButton.click()
        } catch (e) {
            console.log("MFA not needed")
        }
    }
    async loginToZenProd(username, password) {
        await new Promise(resolve => setTimeout(resolve, 5000)); // 3 sec
        await this.userName.click({timeout: 50000});
        await this.userName.clear();
        await this.userName.type(username);
        await new Promise(resolve => setTimeout(resolve, 5000)); // 3 sec
        await this.password.type(password);
        await this.loginButton.click();
    }
    async signUpToZen(username, password) {
        await this.passwordLogo.click();
        await this.email.clear();
        await this.email.type(username);
        await this.loginButtonLCPLanding.click();
        await new Promise(resolve => setTimeout(resolve, 5000)); // 3 sec
        await this.signUpTab.click({timeout: 50000});
        await this.userName.clear();
        await this.userName.type(username);
        await new Promise(resolve => setTimeout(resolve, 5000)); // 3 sec
        await this.password.type(password);
        await this.signUpButton.click()
    }

    async signUpToZenMFA(username, password) {
        await this.passwordLogoWithMFA.click();
        await this.email.type(username);
        await this.loginButtonLCPLanding.click();
        await new Promise(resolve => setTimeout(resolve, 5000)); // 3 sec
        await this.signUpTab.click({timeout: 50000});
        await this.emailMFA.clear();
        await this.emailMFA.type(username);
        await new Promise(resolve => setTimeout(resolve, 5000)); // 3 sec
        await this.passwordMFA.type(password);
        await this.signUpMFAButton.click()
    }

    async selectNode(NodeName) {
        await this.nodeCheckbox.click();
        await this.page.waitForTimeout(2000);
        await this.page.getByRole('option', { name: `${NodeName}` }).getByRole('checkbox').check();
        await this.page.waitForTimeout(2000);

    }

    async loginToGoogle(username, password) {
        await new Promise(resolve => setTimeout(resolve, 3000)); // 3 sec
        await this.loginWithGoogleIcon.click({timeout: 50000});
        await this.email.type(username);
        await new Promise(resolve => setTimeout(resolve, 2000)); // 3 sec
        await this.loginButtonLCPLanding.click();
        await new Promise(resolve => setTimeout(resolve, 5000)); // 3 sec
        await this.nextButtonGoogle.click({timeout: 10000});
        await new Promise(resolve => setTimeout(resolve, 5000)); // 3 sec
        await this.passwordGoogle.type(password);
        await this.nextButtonGoogle.click();
        await new Promise(resolve => setTimeout(resolve, 3000)); // 3 sec
    }
    async loginToZenWithMFA(username, password, secretkey) {
        await new Promise(resolve => setTimeout(resolve, 3000)); // 3 sec
        await this.passwordLogoWithMFA.click({timeout: 50000});
        await this.email.type(username);
        await new Promise(resolve => setTimeout(resolve, 2000)); // 3 sec
        await this.loginButtonLCPLanding.click();
        await new Promise(resolve => setTimeout(resolve, 5000)); // 3 sec
        await this.passwordMFA.type(password);
        await this.signInMFA.click();
        await new Promise(resolve => setTimeout(resolve, 3000)); // 3 sec
        try {
            const token2 = authenticator.generate(secretkey);
            await this.authenticationCode.fill(token2);
            await this.userAuthenticatorButton.click()
        } catch (e) {
            console.log("MFA not needed")
        }
    }

    async loginWithMSPersonal(username, password) {
        await new Promise(resolve => setTimeout(resolve, 3000)); // 3 sec
        await this.microsoftPersonalLogo.click({timeout: 50000});
        await this.email.type(username);
        await new Promise(resolve => setTimeout(resolve, 2000)); // 3 sec
        await this.loginButtonLCPLanding.click();
        await new Promise(resolve => setTimeout(resolve, 5000)); // 3 sec
        try {
            await this.microsoftPersonalLogo.click({timeout: 2000});
        } catch (e) {
            console.log("Pop-up message not existing")
        }
        await new Promise(resolve => setTimeout(resolve, 3000)); // 3 sec
        await this.microsoftPasswordTextBox.fill(password);
        await this.signInButtonMS.click();
        await new Promise(resolve => setTimeout(resolve, 3000)); // 3 sec
        try {
            await this.signInButtonMS.click({timeout: 2000});
        } catch (e) {
            console.log("Pop-up message not existing")
        }
    }

    async clickDontRememberYourPassword(username, password, secretkey) {
        await new Promise(resolve => setTimeout(resolve, 3000)); // 3 sec
        await this.passwordLogoWithMFA.click({timeout: 50000});
        await this.email.type(username);
        await new Promise(resolve => setTimeout(resolve, 2000)); // 3 sec
        await this.loginButtonLCPLanding.click();
        await new Promise(resolve => setTimeout(resolve, 5000)); // 3 sec
        await this.dontRememberYourPassword.click();
        await this.emailForgetPassword.type(username);
        await this.submitForgetPasswordButton.click();
    }

    async pasteRecoveryAccessCode(code) {
        const selector = "(//input[@autocomplete='one-time-code'])";
        const elements = await this.page.$$(selector);
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            element.fill(code.charAt(i));
        }
    }

    async loginWithMFA(username, password, secretKey) {
        await new Promise(resolve => setTimeout(resolve, 3000)); // 3 sec
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
        await new Promise(resolve => setTimeout(resolve, 10000));
        const token = authenticator.generate(secretKey);
        await new Promise(resolve => setTimeout(resolve, 5000)); // 3 sec
        await this.sixDigitMFACode.type(token);
        await new Promise(resolve => setTimeout(resolve, 2000)); // 3 sec
        await this.loginMFAbutton.click();
    }

    async loginUsingMSWork(username, password) {
        await new Promise(resolve => setTimeout(resolve, 3000)); // 3 sec
        await this.passwordLogo.click({timeout: 50000});
        await this.email.type(username);
        await new Promise(resolve => setTimeout(resolve, 2000)); // 3 sec
        await this.loginButtonLCPLanding.click();
        await new Promise(resolve => setTimeout(resolve, 5000)); // 3 sec
        // await this.welcomeTitle.isVisible({timeout: 50000});
        await this.userName.click({timeout: 50000});
        await this.userName.clear();
        await this.userName.type(username);
        await new Promise(resolve => setTimeout(resolve, 5000)); // 3 sec
        await this.password.type(password);
        await this.loginButton.click();
    }
}
module.exports = LoginPage;