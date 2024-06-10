import { test,expect } from "@playwright/test"
import { SAPSystemPage } from "../page-objects/AuroraPage/SAPSystemPage"   ///-- Note that this includes login until sap system page
import { NewSystem } from "../page-objects/AuroraPage/NewSystem"
import { SAPhanaModule } from "../page-objects/AuroraPage/SAPhanaModule"
import { SAPsystemModule } from "../page-objects/AuroraPage/SAPsystemModule"
import { SAPSystemWorkflow } from "../page-objects/AuroraPage/SAPSystemWorkflow"

test('New SAP system from backup', async ({ page }) => {
    const sapSystemPage = new SAPSystemPage (page);
    const newSystem = new NewSystem (page);

    // --- Login to LCP home to SAP System Page ---
    await sapSystemPage.goToLCPLandingPage();
    await sapSystemPage.loginToHomePage();
    await sapSystemPage.checkOrg();
    await sapSystemPage.goToSAPSystem();

    // --- Create new SAP System From Backup ---
    await newSystem.createNewSAPSystemFromBackup();
    
    // --- Verify SAP System created --- 
    const verifyInWorkflow = new SAPSystemWorkflow (page);
    await verifyInWorkflow.stepsToWorkflow();
    await verifyInWorkflow.verifyWorkflowIsRunning();
    await verifyInWorkflow.verifyWorkflowIsCompleted();

    // --- Verify in SAP Sytem Module ---
    const verifyInSapSystemModule = new SAPsystemModule (page);
    await verifyInSapSystemModule.stepsToSapSystemModule();
    await verifyInSapSystemModule.verifySapSystemIDFromSystemTab();
    await verifyInSapSystemModule.verifySapSystemIDFromSystemInstancesTab();
    await verifyInSapSystemModule.verifySapSystemIDFromSystemHanaDBTab();

    // --- Verify in SAP Hana Module ---
    const verifyInSapHanaModule = new SAPhanaModule (page);
    await verifyInSapHanaModule.stepsToSapHanaModule();
    await verifyInSapHanaModule.verifySapHanaIDFromHanaSystemTab();
    await verifyInSapHanaModule.verifySapHanaIDFromHanaInstanceTab();

})