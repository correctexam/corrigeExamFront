describe("Step 6: Voir résultat", () => {
  it("tests Step 6: Voir résultat", () => {
    cy.viewport(1280, 1250);
    cy.visit("http://localhost:8080/");
    cy.clearLocalStorage() // clear all local storage
    cy.visit("http://localhost:8080/");
    cy.wait(1000)


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


    cy.get("button:nth-of-type(6)").click();

    cy.wait(200)

    cy.get("tr:nth-of-type(1) > td:nth-of-type(5)").should('have.text', '1,50')
    cy.get("tr:nth-of-type(2) > td:nth-of-type(5)").should('have.text', '2,00')
    cy.get("tr:nth-of-type(3) > td:nth-of-type(5)").should('have.text', '-0,50')

  });
});
