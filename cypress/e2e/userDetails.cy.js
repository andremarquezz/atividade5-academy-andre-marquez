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

    describe("Quando a consulta de detalhes de usuário falha", () => {
      it("Deve ser exibida uma mensagem de usuário não encontrado", () => {
        const fakeId = "ca8efbac-3269-4d28-8e89-4cd5345";

        userDetailsPage.visit(fakeId);

        userDetailsPage
          .getModalAlert()
          .should("be.visible")
          .and("contain.text", "Usuário não encontrado")
          .and("contain.text", "Não foi possível localizar o usuário.");
      });
    });
  });
});
