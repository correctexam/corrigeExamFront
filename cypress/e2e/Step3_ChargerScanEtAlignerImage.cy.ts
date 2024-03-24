describe("ChargerScanEtAlignerImage", () => {
  it("tests ChargerScanEtAlignerImage", () => {
    cy.viewport(1280, 1250);
    cy.visit("http://localhost:8080/");
    cy.clearLocalStorage() // clear all local storage
    cy.visit("http://localhost:8080/");

    cy.wait(1500)


    // Autentification
    cy.get("button:nth-of-type(1) > span.p-button-label").click();
    cy.get("[data-cy='username']").type("user");
    cy.get("[data-cy='password']").type("user");
    cy.get("form span").click();
    cy.get("[data-cy='submit']").click();

    cy.wait(1000)


    cy.visit("http://localhost:8080/exam/1");
    cy.wait(1500)


    cy.visit("http://localhost:8080/loadscan/1");
    cy.get("div:nth-of-type(2) span > span").click();
    cy.get("input").selectFile("cypress/upload/demo1Copies.pdf",{force:true})

    cy.wait(2000)

    cy.visit("http://localhost:8080/imagealign/1");
    cy.wait(1500)

    cy.get("button:nth-of-type(2) > span").click();
    cy.wait(2000)
    cy.get("[data-cy='entityCreateSaveButton'] > span").click();
  });
});
