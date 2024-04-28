import { mockResponseGetUserById } from "../fixtures/mockResponseGetUserById";
import { UserDetailsPage } from "../support/pages/userDetailsPage";

describe("Quando a consulta de detalhes de usuarios é realizada com sucesso", () => {
  const userDetailsPage = new UserDetailsPage();

  beforeEach(() => {
    cy.viewport("macbook-16");

    cy.intercept(
      `GET", "/api/v1/users/${mockResponseGetUserById.id}`,
      mockResponseGetUserById
    ).as("getUserById");

    cy.visit(userDetailsPage.URL);
  });

  it.only("Deve ser possível consultar os detalhes de um usuário", () => {
    userDetailsPage.getUserIdInput().should("be.disabled");
    userDetailsPage.getUserNameInput().should("be.disabled");
    userDetailsPage.getUserEmailInput().should("be.disabled");

    userDetailsPage
      .getUserIdInput()
      .invoke("val")
      .should("eq", mockResponseGetUserById.id);
    userDetailsPage
      .getUserNameInput()
      .invoke("val")
      .should("eq", mockResponseGetUserById.name);
    userDetailsPage
      .getUserEmailInput()
      .invoke("val")
      .should("eq", mockResponseGetUserById.email);
  });
});
