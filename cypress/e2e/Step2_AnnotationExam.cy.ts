describe("Step2 : Annotation Exam", () => {
  it("tests Step2 : Annotation Exam", () => {


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

    cy.wait(1500)


    cy.get("div.p-dialog-footer span").click();
    cy.wait(1000)
//    cy.get("#form-total button:nth-of-type(1) > span").click();


    cy.visit("http://localhost:8080/exam/annotate/1");

    cy.wait(1500)

    cy.get("jhi-graphical-toolbar > div > div:nth-of-type(2) > div:nth-of-type(1) path").click();

    // Set de la box nom
//    cy.get("canvas.upper-canvas").click();

cy.wait(500)


cy.get('canvas.upper-canvas')
//  .trigger('keydown', { keyCode: 16 })  // shift
  .trigger('mousedown', 105, 55)
  .wait(200)
  .trigger('mousemove', 730, 83)
  .wait(200)
  .trigger('mouseup', {clientX: 730, clientY: 83,  force: true})

  cy.wait(300)


    cy.get("div:nth-of-type(2) > div:nth-of-type(2) path").click();
    cy.wait(300)

    // Set de la box prénom
    cy.get('canvas.upper-canvas')
//  .trigger('keydown', { keyCode: 16 })  // shift
  .trigger('mousedown', 105, 86)
  .wait(200)
  .trigger('mousemove', 730, 117)
  .wait(200)
  .trigger('mouseup',{clientX: 730, clientY: 117,force: true})

  cy.wait(300)

//    cy.get("canvas.upper-canvas").click();
    cy.get("div:nth-of-type(2) > div:nth-of-type(3) svg").click();

    cy.wait(200)

        // Set de la box ine
        cy.get('canvas.upper-canvas')
        //  .trigger('keydown', { keyCode: 16 })  // shift
          .trigger('mousedown', 109, 118)
          .wait(200)
          .trigger('mousemove', 730, 149)
          .wait(200)
          .trigger('mouseup',{clientX: 730, clientY: 149,force: true})


          cy.wait(200)

     // Set de la box question




//  .trigger('keyup', { keyCode: 16 }) // shift

    cy.get("div:nth-of-type(4) svg").click();

    cy.get('canvas.upper-canvas')
    //  .trigger('keydown', { keyCode: 16 })  // shift
      .trigger('mousedown', 50, 410)
      .wait(200)
      .trigger('mousemove', 550, 550)
      .wait(200)
      .trigger('mouseup',{clientX: 550, clientY: 550,force: true})


    // cy.get("canvas.upper-canvas").click();



    cy.get("#field_type").select('QCM')
//    cy.get("#field_type").type("2: 3");
    cy.get("#validexp").click();
    cy.get("#validexp").type("b");
    cy.get("#panel").click();



     // Set de la box question 2


    cy.get("jhi-graphical-toolbar div:nth-of-type(4)").click();
//    cy.get("canvas.upper-canvas").click();

    cy.get('canvas.upper-canvas')
    //  .trigger('keydown', { keyCode: 16 })  // shift
      .trigger('mousedown', 40, 580)
      .wait(200)
      .trigger('mousemove', 740, 690)
      .wait(200)
      .trigger('mouseup',{clientX: 730, clientY: 690,force: true})

    cy.get("#field_type").select("manual");
    cy.get("#panel").click();
    cy.get("span.p-button-label").click();
    cy.get("div.ng-trigger div:nth-of-type(3) > button").click();
    cy.get("div.p-sidebar-header path").click();

    // Select `manuscrit` from the dropdown
    cy.get("#field_type").select("manuscrit");  // Assuming "manuscrit" is the visible value in the dropdown
    cy.get("#panel").click();
    cy.get("span.p-button-label").click();
    cy.get("div.ng-trigger div:nth-of-type(3) > button").click();
    cy.get("div.p-sidebar-header path").click();


    cy.get('#viewerContainer').scrollTo('bottom')

    cy.wait(200);


     // Set de la box question 3

    cy.get("div:nth-of-type(4) svg").click();

//    cy.get("canvas.upper-canvas").click();

cy.get('canvas.upper-canvas')
//  .trigger('keydown', { keyCode: 16 })  // shift
  .trigger('mousedown', 40, 700)
  .wait(200)
  .trigger('mousemove', 750, 1000)
  .wait(200)
  .trigger('mouseup',{force: true})

//    cy.get("[data-cy='gradeType']").click();
    cy.get("[data-cy='gradeType']").select("POSITIVE");
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
      .trigger('mousedown', 330, 1005)
      .wait(200)
      .trigger('mousemove', 340, 1035)
      .wait(200)
      .trigger('mouseup',{force: true})
//    cy.get("canvas.upper-canvas").click();
   // cy.get("[data-cy='gradeType']").click();
    cy.get("[data-cy='gradeType']").select("HYBRID");
    cy.get("#panel").click();
    cy.get("span.p-button-label").click();
    cy.get("div.ng-trigger div:nth-of-type(3) > button").click();
    cy.get("div.p-sidebar-header > button").click();
    cy.get("div.p-checkbox-box").click();

     // Set de la box question 4


    cy.get("div:nth-of-type(4) svg").click();
//    cy.get("canvas.upper-canvas").click();
  cy.get('canvas.upper-canvas')
//  .trigger('keydown', { keyCode: 16 })  // shift
  .trigger('mousedown', 530, 1005)
  .wait(200)
  .trigger('mousemove', 545, 1035)
  .wait(200)
  .trigger('mouseup',{force: true})

    cy.get("[data-cy='numero']").clear().type("{backspace}4");
    cy.get("[data-cy='numero']").click();

    cy.get("[data-cy='entityDetailsBackButton']").click();

//    cy.visit("http://localhost:8080/exam/1");
  });
});
