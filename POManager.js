const EntryPointsPage = require("./AdminPage/EntryPointsPage");
const EntryPointTypesPage = require("./AdminPage/EntryPointTypesPage");
const CrossOrgGroupMappingPage = require("./AdminPage/CrossOrgGroupMappingPage");
const OrgPage = require("./AdminPage/OrgPage");
const LCPFinOpsOrgPage = require("./Module/LCP-FinOp/LCPFinOpsOrgPage");
const LCPFinOpsCostMgtBudgetPage = require("./Module/LCP-FinOp/LCPFinOpsCostMgtBudgetPage");
const AzureHomePage = require("./Azure/AzureHomePage");
const DisposableEmail = require("./DisposableEmail");
const LoginPage = require("./LoginPage");
const HomePage = require("./HomePage");
const RolesPage = require("./AdminPage/RolesPage");
const GroupsPage = require("./AdminPage/GroupsPage");
const UsersPage = require("./AdminPage/UsersPage");
const SystemBuilderPage = require("./SystemBuilderPage");

class POManager {
    constructor(page) {
        this.page = page;
        this.LoginPage = new LoginPage(page);
        this.HomePage = new HomePage(page);
        this.RolesPage = new RolesPage(page);
        this.GroupsPage = new GroupsPage(page);
        this.UsersPage = new UsersPage(page);
        this.CrossOrgPage = new CrossOrgGroupMappingPage(page);
        this.EntryPointsPage = new EntryPointsPage(page);
        this.OrgPage = new OrgPage(page);
        this.FinOpsOrgPage = new LCPFinOpsOrgPage(page);
        this.FinOpCostMgtBudgetPage = new LCPFinOpsCostMgtBudgetPage(page);
        this.AzureHomePage = new AzureHomePage(page);
        this.DisposableEmail = new DisposableEmail(page);
        this.EntryPointTypesPage = new EntryPointTypesPage(page);
        this.SystemBuilderPage = new SystemBuilderPage(page);
    }
}

module.exports = POManager;