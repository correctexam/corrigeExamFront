describe("ChargerScanEtAlignerImage", () => {
  it("tests ChargerScanEtAlignerImage", () => {
    cy.viewport(1280, 1250);
    cy.visit("http://localhost:8080/exam/1");
    cy.wait(1500)


    cy.visit("http://localhost:8080/loadscan/1");
    cy.get("div:nth-of-type(2) span > span").click();
    cy.get("input").selectFile("/home/barais/Téléchargements/esupdays/demo1Template.pdf")
    cy.wait(100)
    cy.get("html > body > jhi-main > div:nth-of-type(2) > div > jhi-chargerscan > div > div.sm\\:col-12 > div > div.col-4 > [data-cy='entityCreateSaveButton'] > span").click();
    cy.wait(100)
    cy.get("button:nth-of-type(3) > span").click();
    cy.wait(100)
    cy.get("button:nth-of-type(2) > span").click();
    cy.wait(100)
    cy.get("[data-cy='entityCreateSaveButton'] > span").click();
  });
});
