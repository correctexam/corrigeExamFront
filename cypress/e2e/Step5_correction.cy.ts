describe("CorrigerCopie", () => {
  it("tests CorrigerCopie", () => {
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

    cy.get("button:nth-of-type(5)").click();
    cy.get("div.p-tabview-panel > div > div:nth-of-type(1) button.p-button").first().click();

    cy.get("div.p-dialog-content > input").click();
    cy.get("div.p-dialog-footer span").click();


    cy.wait(200)
    cy.get("div.col-5 > button:nth-of-type(2)").click();

    cy.wait(2000)


    // Check Question 1

    cy.get('body').type("{ctrl+rightArrow}");
    cy.wait(500)
    cy.get('body').type("{ctrl+rightArrow}");
    cy.wait(500)
    cy.get('body').type("{ctrl+rightArrow}");
    cy.wait(500)


    // Check Question 2
    cy.get('body').type("{ctrl+1}");
    cy.wait(200)
    cy.get('body').type("{shift+8}");
    cy.wait(200)
    cy.get('body').type("{ctrl+rightArrow}");

    cy.wait(200)
    cy.get('body').type("{ctrl+2}");
    cy.wait(200)
    cy.get('body').type("{shift+0}");
    cy.wait(200)
    cy.get('body').type("{ctrl+rightArrow}");

    cy.get('body').type("{ctrl+2}");
    cy.wait(200)
    cy.get('body').type("{shift+0}");
    cy.wait(200)
    cy.get('body').type("{ctrl+rightArrow}");

    // Check Question 3
    cy.wait(200)
    cy.get('body').type("{ctrl+5}");
    cy.wait(200)
    cy.get('body').type("{ctrl+rightArrow}");

    cy.wait(200)
    cy.get('body').type("{ctrl+1}");
    cy.wait(200)
    cy.get('body').type("{ctrl+rightArrow}");


    cy.wait(200)
    cy.get('body').type("{ctrl+2}");
    cy.wait(200)
    cy.get('body').type("{ctrl+rightArrow}");

    // Check Question 4
    cy.wait(200)
    cy.get('body').type("{ctrl+1}");
    cy.wait(200)
    cy.get('body').type("{ctrl+rightArrow}");


    cy.wait(200)
    cy.get('body').type("{ctrl+2}");
    cy.wait(200)
    cy.get('body').type("{ctrl+rightArrow}");


    cy.wait(200)
    cy.get('body').type("{ctrl+3}");
    cy.wait(200)

    cy.visit("http://localhost:8080/exam/1");

    cy.wait(1000)


  });
});
