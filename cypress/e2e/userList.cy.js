import { mockErrorInternalServer } from "../fixtures/mockErrors";
import { UserListPage } from "../support/pages/UserListPage";

describe("Pagina de consulta de usuarios em telas 1536x960", () => {
  const userListPage = new UserListPage();
  beforeEach(() => {
    cy.viewport("macbook-16");
    cy.intercept("GET", "/api/v1/users", {
      fixture: "mockResponseGetAllUsers.json",
    }).as("getAllUsers");
    cy.visit(userListPage.URL);
  });

  describe("Quando a consulta de usuarios é realizada com sucesso", () => {
    it("Deve ser possivel consultar a lista de usuarios ", () => {
      cy.wait("@getAllUsers").then(({ response }) => {
        const pageOne = response.body.slice(0, 5);

        pageOne.forEach((user) => {
          userListPage.getUserName().should("contain", `Nome: ${user.name}`);
          userListPage
            .getUserEmail()
            .should("contain", `E-mail: ${user.email}`);
        });
      });
    });

    it("Deve ser possível consultar os usuários da segunda página", () => {
      cy.wait("@getAllUsers").then(({ response }) => {
        const pageTwo = response.body.slice(6, 11);

        cy.get("#paginacaoProximo").click();

        pageTwo.forEach((user) => {
          const characterLimit = 20;
          const truncatedEmail = user.email.substring(0, 21);

          userListPage.getUserName().should("contain", `Nome: ${user.name}`);

          if (user.email.length > characterLimit) {
            userListPage
              .getUserEmail()
              .should("contain", `E-mail: ${truncatedEmail}...`);
          } else {
            userListPage
              .getUserEmail()
              .should("contain", `E-mail: ${user.email}`);
          }
        });
      });
    });

    it("Deve redirecionar para a página de detalhes do usuário ao clicar no botão de detalhes", () => {
      cy.wait("@getAllUsers").then(({ response }) => {
        const user = response.body[0];

        cy.intercept("GET", `/api/v1/users/${user.id}`, user).as("getUserById");

        userListPage.clickFirstUserDetailsButton();

        cy.wait("@getUserById");
        cy.url().should("include", `/users/${user.id}`);
      });
    });

    it("Deve exibir uma ancora para cadastrar um novo usuario ao consultar e a lista de usuarios estiver vazia", () => {
      cy.intercept("GET", "/api/v1/users", {}).as("getEmptyUsers");

      cy.wait("@getEmptyUsers");

      userListPage
        .getEmptyUserListMessage()
        .should("be.visible")
        .and("contain", "Ops! Não existe nenhum usuário para ser exibido.");

      userListPage
        .getNewUserAnchor()
        .should("be.visible")
        .and("contain", "Cadastre um novo usuário");
    });
  });

  describe("Quando a consulta de usuarios falha", () => {
    it("Deve exibir mensagem de erro ao tentar consultar a lista de usuarios", () => {
      cy.intercept("GET", "/api/v1/users", mockErrorInternalServer).as(
        "internalServerError"
      );

      cy.wait("@internalServerError");
      userListPage
        .getModalErrorServerMessage()
        .should(
          "contain",
          "Não foi possível consultar os usuários cadastrados."
        );
    });
  });
});
