import {
  userDataEmail,
  userDataName,
} from "../selectors/userConsultation.sel.cy";
import { usersURL } from "../support/urls";

describe.only("Pagina de consulta de usuarios em telas 1536x960", () => {
  beforeEach(() => {
    cy.viewport("macbook-16");
    cy.visit(usersURL);
  });

  it("Deve ser possivel consultar a lista de usuarios", () => {
    cy.intercept("GET", "/api/v1/users", { fixture: "users.json" }).as(
      "getUsers"
    );

    cy.wait("@getUsers").then(({ response }) => {
      const pageOne = response.body.slice(0, 5);

      pageOne.forEach((user) => {
        cy.get(userDataName).should("contain", `Nome: ${user.name}`);
        cy.get(userDataEmail).should("contain", `E-mail: ${user.email}`);
      });
    });
  });

  it.only("Deve apresentar 6 usuários por página e ser possível consultar os usuários da segunda página com sucesso", () => {
    cy.intercept("GET", "/api/v1/users", { fixture: "users.json" }).as(
      "getUsers"
    );

    cy.wait("@getUsers").then(({ response }) => {
      cy.get("#paginacaoProximo").click();

      const pageTwo = response.body.slice(6, 11);

      pageTwo.forEach((user) => {
        const characterLimit = 20;
        const truncatedEmail = user.email.substring(0, 21);

        cy.get(userDataName).should("contain", `Nome: ${user.name}`);
        if (user.email.length > characterLimit) {
          cy.get(userDataEmail).should(
            "contain",
            `E-mail: ${truncatedEmail}...`
          );
        } else {
          cy.get(userDataEmail).should("contain", `E-mail: ${user.email}`);
        }
      });
    });
  });
});
