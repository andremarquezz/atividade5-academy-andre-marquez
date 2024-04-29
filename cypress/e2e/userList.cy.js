import { mockErrorInternalServer } from "../fixtures/mockErrors";
import { UserListPage } from "../support/pages/UserListPage";

describe("Pagina de consulta de usuarios em telas 1536x960", () => {
  const userListPage = new UserListPage();

  describe("Quando a consulta de usuarios é realizada com sucesso", () => {
    beforeEach(() => {
      cy.viewport("macbook-16");
      cy.intercept("GET", "/api/v1/users", {
        fixture: "mockResponseGetAllUsers.json",
      }).as("getAllUsers");
      userListPage.visit();
    });

    it("Deve ser possivel consultar a lista de usuarios ", () => {
      cy.wait("@getAllUsers").then(({ response }) => {
        const pageOne = response.body.slice(0, 5);

        pageOne.forEach((user) => {
          userListPage.getName().should("contain.text", `Nome: ${user.name}`);
          userListPage
            .getEmail()
            .should("contain.text", `E-mail: ${user.email}`);
        });
      });
    });

    it("Deve ser possivel consultar o usuario pela barra de pesquisa através do nome", () => {
      cy.wait("@getAllUsers").then(({ response }) => {
        const user = response.body[6];

        cy.intercept("GET", "/api/v1/search?value=*", [user]).as("searchUser");

        userListPage.typeSearchBar(user.name);
        cy.wait("@searchUser");

        userListPage
          .getName()
          .should("be.visible")
          .and("contain.text", `Nome: ${user.name}`);
        userListPage
          .getEmail()
          .should("be.visible")
          .and("contain.text", `E-mail: ${user.email}`);
      });
    });

    it("Deve ser possivel consultar o usuario pela barra de pesquisa através do email", () => {
      cy.wait("@getAllUsers").then(({ response }) => {
        const user = response.body[6];

        cy.intercept("GET", "/api/v1/search?value=*", [user]).as("searchUser");

        userListPage.typeSearchBar(user.email);
        cy.wait("@searchUser");

        userListPage
          .getName()
          .should("be.visible")
          .and("contain.text", `Nome: ${user.name}`);
        userListPage
          .getEmail()
          .should("be.visible")
          .and("contain.text", `E-mail: ${user.email}`);
      });
    });

    it("Deve exibir uma ancora para pagina de cadastro quando a lista de usuarios estiver vazia", () => {
      cy.intercept("GET", "/api/v1/users", {}).as("getEmptyUsers");

      cy.wait("@getEmptyUsers");

      userListPage
        .getEmptyUserListMessage()
        .should("be.visible")
        .and(
          "contain.text",
          "Ops! Não existe nenhum usuário para ser exibido."
        );

      userListPage
        .getNewUserAnchor()
        .should("be.visible")
        .and("contain.text", "Cadastre um novo usuário");
    });
  });

  describe("Quando a consulta de usuarios falha", () => {
    beforeEach(() => {
      cy.viewport("macbook-16");
      userListPage.visit();
    });

    it("Deve exibir uma mensagem de erro ao pesquisar um usuario inexistente", () => {
      cy.intercept("GET", "/api/v1/search?value=*", []).as("searchUser");

      userListPage.typeSearchBar("84489");
      cy.wait("@searchUser");

      userListPage
        .getEmptyUserListMessage()
        .should("be.visible")
        .and(
          "contain.text",
          "Ops! Não existe nenhum usuário para ser exibido."
        );
    });

    it("Deve exibir mensagem de erro ao tentar consultar a lista de usuarios e a API falhar", () => {
      cy.intercept("GET", "/api/v1/users", mockErrorInternalServer).as(
        "internalServerError"
      );

      cy.wait("@internalServerError");
      userListPage
        .getModalErrorServerMessage()
        .should("be.visible")
        .and(
          "contain.text",
          "Não foi possível consultar os usuários cadastrados."
        );
    });
  });

  describe("Validação de campos", () => {
    beforeEach(() => {
      cy.viewport("macbook-16");
      cy.intercept("GET", "/api/v1/users", {
        fixture: "mockResponseGetAllUsers.json",
      }).as("getAllUsers");
      userListPage.visit();
    });

    it("Deve limpar o campo de pesquisa ao clicar no icone de limpar e mostrar todos os usuarios", () => {
      cy.wait("@getAllUsers").then(({ response }) => {
        const user = response.body[0];

        cy.intercept("GET", "/api/v1/search?value=*", [user]).as("searchUser");

        userListPage.typeSearchBar(user.name);
        cy.wait("@searchUser");

        userListPage
          .getName()
          .should("be.visible")
          .and("contain.text", `Nome: ${user.name}`);
        userListPage
          .getEmail()
          .should("be.visible")
          .and("contain.text", `E-mail: ${user.email}`);

        userListPage.clickClearSearchButton();

        cy.wait("@getAllUsers");

        response.body.slice(0, 5).forEach((user) => {
          userListPage.getName().should("contain.text", `Nome: ${user.name}`);
          userListPage
            .getEmail()
            .should("contain.text", `E-mail: ${user.email}`);
        });
      });
    });

    it("Deve ser possível consultar os usuários da segunda página ao clicar no botão Proxima", () => {
      cy.wait("@getAllUsers").then(({ response }) => {
        const pageTwo = response.body.slice(6, 11);

        cy.get("#paginacaoProximo").click();

        pageTwo.forEach((user) => {
          const characterLimit = 20;
          const truncatedEmail = user.email.substring(0, 21);

          userListPage.getName().should("contain.text", `Nome: ${user.name}`);

          if (user.email.length > characterLimit) {
            userListPage
              .getEmail()
              .should("contain.text", `E-mail: ${truncatedEmail}...`);
          } else {
            userListPage
              .getEmail()
              .should("contain.text", `E-mail: ${user.email}`);
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
  });
});
