describe("Annotation Examen", () => {
  it("tests Annotation Examen", () => {
    cy.clearLocalStorage() // clear all local storage


    cy.viewport(3840, 959);
    cy.visit("http://localhost:8080/");
    cy.get("button:nth-of-type(1) > span.p-button-label").click();
    cy.get("[data-cy='username']").type("user");
    cy.get("[data-cy='password']").type("user");
    cy.get("form span").click();
    cy.get("[data-cy='submit']").click();

    cy.wait(1000)



    cy.visit("http://localhost:8080/exam/1");

    cy.wait(2000)


    cy.get("p-dialog.ng-tns-c566989842-2 input").click();
    cy.get("div.p-dialog-footer span").click();
    cy.wait(1000)
//    cy.get("#form-total button:nth-of-type(1) > span").click();


    cy.visit("http://localhost:8080/exam/annotate/1");

    cy.wait(2000)

    cy.get("jhi-graphical-toolbar > div > div:nth-of-type(2) > div:nth-of-type(1) path").click();

    // Set de la box nom
//    cy.get("canvas.upper-canvas").click();

cy.get('canvas.upper-canvas')
//  .trigger('keydown', { keyCode: 16 })  // shift
  .trigger('mousedown', 100, 100)
  .wait(200)
  .trigger('mousemove', 150, 150)
  .wait(200)
  .trigger('mouseup', {force: true})



    cy.get("div:nth-of-type(2) > div:nth-of-type(2) path").click();

    // Set de la box prénom
    cy.get('canvas.upper-canvas')
//  .trigger('keydown', { keyCode: 16 })  // shift
  .trigger('mousedown', 100, 200)
  .wait(200)
  .trigger('mousemove', 150, 250)
  .wait(200)
  .trigger('mouseup',{force: true})

//    cy.get("canvas.upper-canvas").click();
    cy.get("div:nth-of-type(2) > div:nth-of-type(3) svg").click();


        // Set de la box ine
        cy.get('canvas.upper-canvas')
        //  .trigger('keydown', { keyCode: 16 })  // shift
          .trigger('mousedown', 100, 300)
          .wait(200)
          .trigger('mousemove', 150, 350)
          .wait(200)
          .trigger('mouseup',{force: true})



     // Set de la box question


    //    cy.get("canvas.upper-canvas").click();
    cy.get("div:nth-of-type(4) svg").click();

    cy.get('canvas.upper-canvas')
//  .trigger('keydown', { keyCode: 16 })  // shift
  .trigger('mousedown', 100, 400)
  .wait(200)
  .trigger('mousemove', 150, 450)
  .wait(200)
  .trigger('mouseup',{force: true})


//  .trigger('keyup', { keyCode: 16 }) // shift

    cy.get("div:nth-of-type(4) svg").click();

    cy.get('canvas.upper-canvas')
    //  .trigger('keydown', { keyCode: 16 })  // shift
      .trigger('mousedown', 100, 500)
      .wait(200)
      .trigger('mousemove', 150, 550)
      .wait(200)
      .trigger('mouseup',{force: true})


    // cy.get("canvas.upper-canvas").click();



    cy.get("#field_type").click();
    cy.get("#field_type").type("2: 3");
    cy.get("#validexp").click();
    cy.get("#validexp").type("b");
    cy.get("#panel").click();



     // Set de la box question 2


    cy.get("jhi-graphical-toolbar div:nth-of-type(4)").click();
//    cy.get("canvas.upper-canvas").click();

    cy.get('canvas.upper-canvas')
    //  .trigger('keydown', { keyCode: 16 })  // shift
      .trigger('mousedown', 100, 600)
      .wait(200)
      .trigger('mousemove', 150, 650)
      .wait(200)
      .trigger('mouseup',{force: true})

    cy.get("#field_type").click();
    cy.get("#field_type").type("1: 2");
    cy.get("#panel").click();
    cy.get("span.p-button-label").click();
    cy.get("div.ng-trigger div:nth-of-type(3) > button").click();
    cy.get("div.p-sidebar-header path").click();






     // Set de la box question 3

    cy.get("div:nth-of-type(4) svg").click();

//    cy.get("canvas.upper-canvas").click();

cy.get('canvas.upper-canvas')
//  .trigger('keydown', { keyCode: 16 })  // shift
  .trigger('mousedown', 100, 700)
  .wait(200)
  .trigger('mousemove', 150, 750)
  .wait(200)
  .trigger('mouseup',{force: true})

    cy.get("[data-cy='gradeType']").click();
    cy.get("[data-cy='gradeType']").type("POSITIVE");
    cy.get("#panel").click();
    cy.get("span.p-button-label").click();
    cy.get("div.ng-trigger div:nth-of-type(3) > button").click();
    cy.get("p > input").click();
    cy.get("p > input").type("I");
    cy.get("p > input").type("Imprécis");
    cy.get("div.ng-trigger textarea").click();
    cy.get("div.ng-trigger textarea").click();
    cy.get("div.ng-trigger textarea").type("cd");
    cy.get("div:nth-of-type(5) svg").click();
    cy.get("div.ng-trigger a").click();
    cy.get("div.p-sidebar-header svg").click();



     // Set de la box question 4

    cy.get("jhi-graphical-toolbar div:nth-of-type(4)").click();
    cy.get('canvas.upper-canvas')
    //  .trigger('keydown', { keyCode: 16 })  // shift
      .trigger('mousedown', 100, 800)
      .wait(200)
      .trigger('mousemove', 150, 850)
      .wait(200)
      .trigger('mouseup',{force: true})
//    cy.get("canvas.upper-canvas").click();
    cy.get("[data-cy='gradeType']").click();
    cy.get("[data-cy='gradeType']").type("HYBRID");
    cy.get("#panel").click();

     // Set de la box question 4


    cy.get("div:nth-of-type(4) svg").click();
//    cy.get("canvas.upper-canvas").click();
cy.get('canvas.upper-canvas')
//  .trigger('keydown', { keyCode: 16 })  // shift
  .trigger('mousedown', 200, 800)
  .wait(200)
  .trigger('mousemove', 250, 850)
  .wait(200)
  .trigger('mouseup',{force: true})

    cy.get("[data-cy='numero']").type("6");
    cy.get("[data-cy='numero']").click();
    cy.get("[data-cy='numero']").type("5");
    cy.get("[data-cy='numero']").click();
    cy.get("[data-cy='numero']").type("4");
    cy.get("[data-cy='numero']").click();
    cy.get("span.p-button-label").click();
    cy.get("div.ng-trigger div:nth-of-type(3) > button").click();
    cy.get("div.p-sidebar-header > button").click();
    cy.get("div.p-checkbox-box").click();
    cy.get("[data-cy='entityDetailsBackButton']").click();
    cy.visit("http://localhost:8080/exam/1");
  });
});
