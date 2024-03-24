describe("Step 4: AssociationEtudiant", () => {
  it("tests step 4:  AssociationEtudiant", () => {

    cy.viewport(1280, 1250);
    cy.visit("http://localhost:8080/");
    cy.clearLocalStorage() // clear all local storage
    cy.visit("http://localhost:8080/");
    cy.wait(1500)


    cy.get("button:nth-of-type(1) > span.p-button-label").click();
    cy.get("[data-cy='username']").type("user");
    cy.get("[data-cy='password']").type("user");
    cy.get("form span").click();
    cy.get("[data-cy='submit']").click();
    cy.wait(1000)


    cy.visit("http://localhost:8080/exam/1");

    cy.wait(1000)

    cy.get("div.p-dialog-footer span").click();
    cy.wait(1000)


    cy.visit("http://localhost:8080/studentbindings/1/1");
    cy.wait(5000)
    cy.get('body').type("{ctrl+enter}");
    cy.wait(1500)
    cy.get('body').type("{ctrl+enter}");
    cy.wait(1500)
    cy.get('body').type("{ctrl+enter}");
    cy.wait(1500)
  });
});
