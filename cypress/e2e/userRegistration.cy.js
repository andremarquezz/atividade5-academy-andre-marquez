import { faker } from "@faker-js/faker";

import {
  emailInput,
  errorMessage,
  nameInput,
  submitButton,
  successMessage,
} from "../selectors/userRegistration.sel.cy";
import { registrationURL } from "../support/urls";

describe("Pagina de cadastro de usuarios em telas 1536x960", () => {
  beforeEach(() => {
    cy.viewport("macbook-16");
    cy.visit(registrationURL);
  });

  describe("Validação de campos", () => {
    it("Deve exibir mensagem de erro ao tentar cadastrar um usuario sem nome", () => {
      const email = faker.internet.email();

      cy.get(emailInput).type(email);
      cy.get(submitButton).click();
      cy.get(errorMessage)
        .should("be.visible")
        .and("contain", "O campo nome é obrigatório.");
    });

    it("Deve exibir mensagem de erro ao tentar cadastrar um usuario com menos de 4 caracteres", () => {
      const name = faker.helpers.arrayElement(
        faker.rawDefinitions.person.first_name.filter((a) => a.length < 4)
      );
      const email = faker.internet.email();

      cy.get(nameInput).type(name);
      cy.get(emailInput).type(email);
      cy.get(submitButton).click();
      cy.get(errorMessage)
        .should("be.visible")
        .and("contain", "Informe pelo menos 4 letras para o nome.");
    });

    it("Deve exibir mensagem de erro ao tentar cadastrar um usuario sem email", () => {
      const name = faker.helpers.arrayElement(
        faker.rawDefinitions.person.first_name.filter((a) => a.length >= 4)
      );
      cy.get(nameInput).type(name);
      cy.get(submitButton).click();
      cy.get(errorMessage)
        .should("be.visible")
        .and("contain", "O campo e-mail é obrigatório.");
    });

    it("Deve exibir mensagem de erro ao tentar cadastrar um usuario com email invalido", () => {
      const name = faker.helpers.arrayElement(
        faker.rawDefinitions.person.first_name.filter((a) => a.length >= 4)
      );
      cy.get(nameInput).type(name);
      cy.get(emailInput).type("emailinvalido");

      cy.get(submitButton).click();
      cy.get(".sc-jEACwC")
        .should("be.visible")
        .and("contain", "Formato de e-mail inválido");
    });
  });

  describe("Cadastro de usuarios", () => {
    it("Deve ser possivel cadastrar um usuario com sucesso", () => {
      const name = faker.helpers.arrayElement(
        faker.rawDefinitions.person.first_name.filter((a) => a.length >= 4)
      );
      const email = faker.internet.email();

      cy.intercept("POST", "/api/v1/users").as("createUser");

      cy.get(nameInput).type(name);
      cy.get(emailInput).type(email);
      cy.get(submitButton).click();

      cy.wait("@createUser").then(() => {
        cy.get(successMessage)
          .should("exist")
          .and("contain", "Usuário salvo com sucesso!");
      });
    });
  });
});
