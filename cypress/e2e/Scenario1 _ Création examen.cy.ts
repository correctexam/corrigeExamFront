describe("Scenario1 : Création examen", () => {
  it("tests Scenario1 : Création examen", () => {
    cy.viewport(960, 240);
    cy.visit("http://localhost:8080/");
    cy.clearLocalStorage() // clear all local storage

    cy.wait(1500)

    cy.get("button:nth-of-type(1) > span.p-button-label").click();
    cy.get("[data-cy='username']").type("user");
    cy.get("[data-cy='password']").type("user");
    cy.get('#rememberMe').click();

    cy.get("form span").click();
    cy.get("[data-cy='submit']").click();
    cy.get("#\\30  img").click();
    cy.get("[data-cy='name']").click();
    cy.get("[data-cy='name']").type("Test");
    cy.get("[data-cy='entityCreateSaveButton'] > span").click();

    // Load student
    cy.visit("http://localhost:8080/registerstudents/1");
    cy.get("td:nth-of-type(2) > input").click();
    cy.get("td:nth-of-type(2) > input").type("18001841");
    cy.get("td:nth-of-type(3) > input").type("BARAIS");
    cy.get("td:nth-of-type(4) > input").type("olivier");
    cy.get("td:nth-of-type(5) > input").type("OLIVIER");
    cy.get("td:nth-of-type(6) > input").type("g1");
    cy.get("div.md\\:col-12 path").click();
    cy.get("tr:nth-of-type(2) > td:nth-of-type(2) > input").click();
    cy.get("tr:nth-of-type(2) > td:nth-of-type(2) > input").type("20212882");
    cy.get("tr:nth-of-type(2) > td:nth-of-type(3) > input").click();
    cy.get("tr:nth-of-type(2) > td:nth-of-type(3) > input").type("BLOUIN");
    cy.get("tr:nth-of-type(2) > td:nth-of-type(4) > input").click();
    cy.get("tr:nth-of-type(2) > td:nth-of-type(4) > input").type("ARNAUD");
    cy.get("tr:nth-of-type(2) > td:nth-of-type(5) > input").click();
    cy.get("tr:nth-of-type(2) > td:nth-of-type(5) > input").type("arnaud.blouin@irisa.fr");
    cy.get("tr:nth-of-type(2) > td:nth-of-type(6) > input").dblclick();
    cy.get("tr:nth-of-type(2) > td:nth-of-type(6) > input").type("g1");
    cy.get("tr:nth-of-type(2) path").click();
    cy.get("tr:nth-of-type(2) > td:nth-of-type(2) > input").click();
    cy.get("tr:nth-of-type(2) > td:nth-of-type(2) > input").type("22111417");
    cy.get("tr:nth-of-type(2) > td:nth-of-type(3) > input").click();
    cy.get("tr:nth-of-type(2) > td:nth-of-type(3) > input").type("DERRIEN");
    cy.get("tr:nth-of-type(2) > td:nth-of-type(4) > input").click();
    cy.get("tr:nth-of-type(2) > td:nth-of-type(4) > input").type("STEVEN");
    cy.get("tr:nth-of-type(2) > td:nth-of-type(5) > input").click();
    cy.get("tr:nth-of-type(2) > td:nth-of-type(5) > input").type("steven.derrien@irisa.fr");
    cy.get("tr:nth-of-type(2) > td:nth-of-type(6) > input").dblclick();
    cy.get("tr:nth-of-type(2) > td:nth-of-type(6) > input").type("g1");
    cy.get("tr:nth-of-type(2) path").click();
    cy.get("div:nth-of-type(3) span").click();

    // Create exam
    cy.visit("http://localhost:8080/course/1");
    cy.wait(1500)

    cy.get("div.p-dialog-footer.ng-tns-c566989842-1 button").click();
//    cy.get("div.p-dialog-footer span").click();
    cy.wait(1000)


    cy.get("#\\31  img").click();
    cy.get("[data-cy='name']").click();
    cy.get("[data-cy='name']").type("Test exam");
    cy.get("div:nth-of-type(2) > div > [data-cy='content']").click();
    cy.get("div:nth-of-type(2) > div > [data-cy='content']").selectFile("/home/barais/Téléchargements/esupdays/demo1Template.pdf")
    cy.get("form [data-cy='entityCreateSaveButton'] > span").click();



    // Create exam
    cy.visit("http://localhost:8080/exam/1");

    cy.wait(1000)

    cy.get("div.p-dialog-footer span").click();
    cy.wait(1000)
    // Annotate exam


  });
});
