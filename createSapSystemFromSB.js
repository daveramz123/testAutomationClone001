import { test,expect } from "@playwright/test"
import { SAPSystemPage } from "../page-objects/AuroraPage/SAPSystemPage"   ///-- Note that this includes login until sap system page
import { NewSystem } from "../page-objects/AuroraPage/NewSystem"
import { SAPhanaModule } from "../page-objects/AuroraPage/SAPhanaModule"
import { SAPsystemModule } from "../page-objects/AuroraPage/SAPsystemModule"
import { SAPSystemWorkflow } from "../page-objects/AuroraPage/SAPSystemWorkflow"

test.only('Create SAP System from System Builder', async ({ page }) => {
    const sapSystemPage = new SAPSystemPage (page);

    // --- Login to LCP home to SAP System Page ---
    await sapSystemPage.goToLCPLandingPage();
    await sapSystemPage.loginToHomePage();
    


})