import {
  userDataEmail,
  userDataName,
  userDetailsButton,
  userDetailsEmailInput,
  userDetailsIdInput,
  userDetailsNameInput,
} from "../selectors/userConsultation.sel.cy";
import { usersURL } from "../support/urls";

describe("Pagina de consulta de usuarios em telas 1536x960", () => {
  beforeEach(() => {
    cy.viewport("macbook-16");
    cy.visit(usersURL);
  });

  describe("Quando a consulta de usuarios é realizada com sucesso", () => {
    it("Deve ser possivel consultar a lista de usuarios ", () => {
      cy.intercept("GET", "/api/v1/users", { fixture: "users.json" }).as(
        "getUsers"
      );

      cy.wait("@getUsers");
      const pageOne = response.body.slice(0, 5);

      pageOne.forEach((user) => {
        cy.get(userDataName).should("contain", `Nome: ${user.name}`);
        cy.get(userDataEmail).should("contain", `E-mail: ${user.email}`);
      });
    });

    it("Deve ser possível consultar os usuários da segunda página", () => {
      cy.intercept("GET", "/api/v1/users", { fixture: "users.json" }).as(
        "getUsers"
      );

      cy.wait("@getUsers").then(({ response }) => {
        const pageTwo = response.body.slice(6, 11);

        cy.get("#paginacaoProximo").click();

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

    it.only("Deve ser possível consultar os detalhes de um usuário", () => {
      cy.intercept("GET", "/api/v1/users", { fixture: "users.json" }).as(
        "getAllUsers"
      );

      cy.wait("@getAllUsers").then(({ response }) => {
        const user = response.body[0];

        cy.intercept("GET", `/api/v1/users/${user.id}`, user).as("getUserById");

        cy.get(userDetailsButton).first().click();

        cy.get(userDetailsIdInput).should("be.disabled");
        cy.get(userDetailsNameInput).should("be.disabled");
        cy.get(userDetailsEmailInput).should("be.disabled");

        cy.get(userDetailsIdInput).invoke("val").should("eq", user.id);
        cy.get(userDetailsNameInput).invoke("val").should("eq", user.name);
        cy.get(userDetailsEmailInput).invoke("val").should("eq", user.email);
      });
    });

    it("Deve exibir uma ancora para cadastrar um novo usuario ao consultar e a lista de usuarios estiver vazia", () => {
      cy.intercept("GET", "/api/v1/users", {}).as("getUsers");

      cy.wait("@getUsers");

      cy.get(".sc-koXPp")
        .should("be.visible")
        .and("contain", "Ops! Não existe nenhum usuário para ser exibido.");

      cy.get(".sc-bmzYkS[href='/users/novo']")
        .should("be.visible")
        .and("contain", "Cadastre um novo usuário");
    });
  });

  describe("Quando a consulta de usuarios falha", () => {
    it("Deve exibir mensagem de erro ao tentar consultar a lista de usuarios", () => {
      cy.intercept("GET", "/api/v1/users", { statusCode: 500 }).as("getUsers");

      cy.wait("@getUsers");
      cy.get(".alert").should(
        "contain",
        "Erro ao consultar a lista de usuários"
      );
    });
  });
});
