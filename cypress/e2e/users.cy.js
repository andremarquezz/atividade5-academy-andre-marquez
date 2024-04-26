import { faker } from "@faker-js/faker";
import {
  emailInput,
  nameInput,
  submitButton,
  successMessage,
} from "../selectors/userRegistration.sel.cy";
import { registrationURL } from "../support/urls";

describe("Criação de usuarios", () => {
  it("Deve ser possivel cadastrar um usuario com sucesso", () => {
    cy.viewport("macbook-16");
    const name = faker.person.firstName(4);
    const email = faker.internet.email();

    cy.intercept("POST", "/api/v1/users").as("createUser");

    cy.visit(registrationURL);
    cy.get(nameInput).type(name);
    cy.get(emailInput).type(email);
    cy.get(submitButton).click();

    cy.wait("@createUser").then(() => {
      cy.get(successMessage)
      .should("contain", "Usuário salvo com sucesso!");
    });
  });
});
