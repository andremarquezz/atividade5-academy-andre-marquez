import { mockResponseGetUserById } from "../fixtures/mockResponseGetUserById";
import { UserDetailsPage } from "../support/pages/userDetailsPage";

describe("Consulta de detalhes de usuário", () => {
  describe("Quando a consulta de detalhes de usuário é realizada com sucesso", () => {
    const userDetailsPage = new UserDetailsPage();

    beforeEach(() => {
      cy.viewport("macbook-16");

      cy.intercept(
        "GET",
        `/api/v1/users/${mockResponseGetUserById.id}`,
        mockResponseGetUserById
      ).as("getUserById");

      userDetailsPage.visit(mockResponseGetUserById.id);
    });

    it("Deve ser possível consultar os detalhes de um usuário", () => {
      cy.wait("@getUserById");

      userDetailsPage.getIdInput().should("be.disabled");
      userDetailsPage.getNameInput().should("be.disabled");
      userDetailsPage.getEmailInput().should("be.disabled");

      userDetailsPage
        .getIdInput()
        .invoke("val")
        .should("eq", mockResponseGetUserById.id);
      userDetailsPage
        .getNameInput()
        .invoke("val")
        .should("eq", mockResponseGetUserById.name);
      userDetailsPage
        .getEmailInput()
        .invoke("val")
        .should("eq", mockResponseGetUserById.email);
    });

    describe.skip("Quando a consulta de detalhes de usuário falha", () => {
      it("Deve ser exibida uma mensagem de erro", () => {
        cy.intercept("GET", "/api/v1/users/*", {
          statusCode: 500,
          body: {},
        }).as("getUserByIdError");

        userDetailsPage.visit("TODO");

        cy.wait("@getUserByIdError");

        userDetailsPage
          .getErrorAlert()
          .should("contain.text", "Erro ao carregar usuário");
      });
    });
  });
});

describe.skip("Atualização de detalhes de usuário", () => {
  const userDetailsPage = new UserDetailsPage();

  beforeEach(() => {
    cy.viewport("macbook-16");

    userDetailsPage.visit("TODO");
  });

  describe("Quando a edição de um usuário é realizada com sucesso", () => {
    it("Deve ser possível editar o nome de um usuário", () => {
      cy.wait("@getUserById");

      userDetailsPage.clickEditButton();

      userDetailsPage.getIdInput().should("be.disabled");
      userDetailsPage.getNameInput().should("be.enabled");
      userDetailsPage.getEmailInput().should("be.enabled");

      userDetailsPage.typeName("Novo nome");
      userDetailsPage.clickSaveButton();
    });
  });
});
