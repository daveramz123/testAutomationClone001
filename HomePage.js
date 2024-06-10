const {expect} = require("@playwright/test");

class HomePage {
    constructor(page) {
        this.page = page;
        this.loginButton = page.locator("//button[normalize-space()='Login']");
        this.adminDashboard = page.getByRole('link', {name: 'Admin Dashboard (Preview)'});
        this.hamburgerIcon = page.locator("//button[@aria-label='menu']");
        this.appBar = page.locator("//button[@id='lcp-org-menu-selection-button']");
        this.logOutButton = page.locator("//p[contains(text(),'Logout')]");
        this.createNewOrganizationButton = page.locator('text=Create New Organization');
        this.userAdminGroupDropDown = page.locator('text=Select a user admin group');
        this.orgAdminGroupDropDown = page.locator('text=Select a organization admin group');
        this.addButton = page.locator('text=Add');
        this.selectOrg = page.locator("//div[@id='select-organization']");
        this.arrowDownOrgIcon = page.locator("//div[@class='MuiTreeItem-iconContainer']//*[name()='svg']");
        this.advanceButton = page.locator("//button[normalize-space()='Advanced']");
        this.orgIdTxtField = page.locator("//input[@id='org-id-input']");
        this.refreshButton = page.locator("//button[normalize-space()='Refresh Data']");
        this.profileNameButton = page.locator("//button[@id='dropdown-button']");
        this.usersMenu = page.locator("//span[normalize-space()='Users']");
        this.groupsMenu = page.locator("//span[normalize-space()='Groups']");
        this.crossOrgGroupMappingsMenu = page.locator("//span[normalize-space()='Cross Organization Group Mappings']");
        this.rolesMenu = page.locator("//span[normalize-space()='Roles']");
        this.profileMenu = page.locator("//li[normalize-space()='Profile']");
        this.lemongrassConsultingCopyToken = page.locator('text=Netherlands-1Lemongrass Consulting >> #copy_token_button').first();
        this.newAppBar = page.locator("//div[@data-testid='Entrypoint-Selector']");
        this.appBarSearch = page.locator('[data-testid="Entrypoint-Selector"] [placeholder="Search"]');
        this.appBarSearchEnvironment = page.locator('#mega-search');
        this.appBarSearchDialogue = page.locator("//h2[@id='search-dialog']");
        this.appBarSearchBox = page.locator('#search')
        this.searchBoxClear = page.locator("//button[@aria-label='Clear search text']");
        this.qaTesterCorporationCopyToken = page.locator('text=Netherlands-1QA Tester Corporation >> #copy_token_button').first();
        this.lcpLemongrassNonProdCopyToken = page.locator("(//td[normalize-space()='Lemongrass LCP NonProd']/following::button)[1]");
        this.zenCopyToken = page.locator('text=Netherlands-1zen >> #copy_token_button').first();
        this.qaMemcachedCopyToken = page.locator("(//td[normalize-space()='qa-memcached']/following::button)[1]");
        this.homeButton = page.getByRole('link', { name: 'Lemongrass' });
        this.showAll = page.locator("text=Show All");
        this.nodeCheckbox = page.locator('input[role="combobox"]');
        this.menuButton = page.locator('[aria-label="menu"]');
        this.adminButton = page.getByTestId('MegaMenu').getByRole('heading', {name: 'Admin'});
        this.solutionsButton = page.getByText('SOLUTIONS', {exact: true});
        this.qaWorkFlowCorpCopyToken = page.locator('text=Netherlands-1QA Workflow Corp >> #copy_token_button').first();
        this.recentMenu = page.getByText('RECENT');
        this.recentAdminDashboard = page.locator('div').filter({ hasText: /^RECENTAdmin Dashboard \(Preview\)$/ }).getByRole('link');
        this.adminViewButton = page.locator('text=AdminConfiguration of LCP Tooling.View >> span >> text=View');
    }

    async copyToken(param1) {
        let elementValue = `tr:has-text('${param1}') >> #copy_token_button`;
        await this.page.locator(elementValue).first().click({timeout: 60000});
    }

    async clickCopyTokenRowMoreOptions(param1){
        const copyTokenLocator = this.page.locator("//tr[contains (., '"+param1+"')]//button[@id='copy_token_menu_button']");
        await copyTokenLocator.click();
    }

    async selectCopyTokenOptionWithBearer(param1) {
        await this.clickCopyTokenRowMoreOptions(param1);
        const copyTokenOption1 = this.page.locator("//li[@id='copy_token_menu_item_1']");
        await copyTokenOption1.click();
    }

    async selectCopyTokenOptionWithoutBearer(param1) {
        await this.clickCopyTokenRowMoreOptions(param1);
        const copyTokenOption1 = this.page.locator("//li[@id='copy_token_menu_item_2']");
        await copyTokenOption1.click();
    }

    async selectUserAdminGroup(UserAdminGroup) {
        await this.userAdminGroupDropDown.click();
        const groupLocator = this.page.locator("//li[contains(normalize-space(),'" + UserAdminGroup + "')]");
        await groupLocator.click();
    }

    async clickLogOutButton() {
        await this.profileNameButton.click();
        await this.logOutButton.click();

    }

    async selectOrgAdminGroup(OrgAdminGroup) {
        await this.orgAdminGroupDropDown.click();
        const groupLocator = this.page.locator("//li[contains(normalize-space(),'" + OrgAdminGroup + "')]");
        await groupLocator.click();
    }

    async selectOrgAccessAppBar(Org) {
        await this.newAppBar.click();
        await new Promise(resolve => setTimeout(resolve, 2000));
        await this.appBarSearch.fill(Org);
        await new Promise(resolve => setTimeout(resolve, 500));
        await this.page.locator(`//p[normalize-space(text())="${Org}"]`).first().click();
        await new Promise(resolve => setTimeout(resolve, 2000)); // 3 sec
        await this.page.keyboard.press('Escape');
    }

    async selectNode(nodeName) {
        await this.nodeCheckbox.click();
        await this.page.waitForTimeout(2000);
        await this.page.getByRole('button', { name: `${nodeName}` }).click();
        await this.page.waitForTimeout(2000);
    }

    getOrgLocator(OrgBelongTo) {
        return this.page.locator("//li[contains(normalize-space(),'" + OrgBelongTo + "')]");
    }

    async clickAndWait(button, retryButton = null) {
        try {
            await button.click({timeout: 2000});
            await this.page.waitForTimeout(1000);
        } catch (e) {
            if (retryButton) {
                await retryButton.click({timeout: 2000});
                await this.page.waitForTimeout(1000);
            }
            await button.click({timeout: 2000});
            await this.page.waitForTimeout(1000);
        }
    }

    async selectAdminSideBarMenu(sideBarName) {
        const sidebarItem = this.page.locator(`a:has-text("${sideBarName}")`);

        if (await sidebarItem.isVisible()) {
            await sidebarItem.click(); // directly click the sidebar if it's already visible
        } else {
            await this.clickAndWait(this.menuButton);
            await this.clickAndWait(this.solutionsButton, this.menuButton);
            await this.clickAndWait(this.adminButton, this.solutionsButton);
            await this.clickAndWait(this.adminDashboard, this.adminButton);
            await sidebarItem.click();
            await this.clickAndWait(this.menuButton);
        }
        await this.page.waitForTimeout(2000);
    }

    async selectRecentAdminDashboard() {
        await this.clickAndWait(this.menuButton);
        await this.clickAndWait(this.recentMenu, this.menuButton);
        await this.clickAndWait(this.recentAdminDashboard, this.recentMenu);
    }
}

module.exports = HomePage;