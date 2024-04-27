import { faker } from "@faker-js/faker";

import { mockErrorUserAlreadyExists } from "../fixtures/mockErrors";
import RegistrationPage from "../support/pages/RegistrationPage";

describe("Pagina de cadastro de usuarios em telas 1536x960", () => {
  const registrationPage = new RegistrationPage();

  beforeEach(() => {
    cy.viewport("macbook-16");
    cy.visit(registrationPage.url);
  });

  describe("Quando o cadastro é realizado com sucesso", () => {
    it("Deve ser possivel cadastrar um usuario com sucesso", () => {
      const name = faker.helpers.arrayElement(
        faker.rawDefinitions.person.first_name.filter((a) => a.length >= 4)
      );
      const email = faker.internet.email();

      cy.intercept("POST", "/api/v1/users").as("createUser");

      cy.get(registrationPage.nameInput).type(name);
      cy.get(registrationPage.emailInput).type(email);
      cy.get(registrationPage.submitButton).click();

      cy.wait("@createUser");

      registrationPage
        .getSuccessMessage()
        .should("exist")
        .and("contain", "Usuário salvo com sucesso!");
    });
  });

  describe("Quando o cadastro de usuarios falha", () => {
    it("Deve exibir mensagem de erro ao tentar cadastrar um usuario sem nome", () => {
      const email = faker.internet.email();

      registrationPage.register("", email);
      registrationPage
        .getErrorFeedbackMessageName()
        .should("be.visible")
        .and("contain", "O campo nome é obrigatório.");
    });

    it("Deve exibir mensagem de erro ao tentar cadastrar um usuario com nome com menos de 4 caracteres", () => {
      const name = faker.helpers.arrayElement(
        faker.rawDefinitions.person.first_name.filter((a) => a.length < 4)
      );
      const email = faker.internet.email();

      registrationPage.register(name, email);

      registrationPage
        .getErrorFeedbackMessageName()
        .should("be.visible")
        .and("contain", "Informe pelo menos 4 letras para o nome.");
    });

    it("Deve exibir mensagem de erro ao tentar cadastrar um usuario com nome com mais de 100 caracteres", () => {
      const name = faker.lorem.words(101);
      const email = faker.internet.email();

      registrationPage.register(name, email);
      registrationPage
        .getErrorFeedbackMessageName()
        .should("be.visible")
        .and("contain", "Informe no máximo 100 caracteres para o nome");
    });

    it("Deve exibir mensagem de erro ao tentar cadastrar um usuario sem email", () => {
      const name = faker.helpers.arrayElement(
        faker.rawDefinitions.person.first_name.filter((a) => a.length >= 4)
      );
      registrationPage.register(name, "");

      registrationPage
        .getErrorFeedbackMessageName()
        .should("be.visible")
        .and("contain", "O campo e-mail é obrigatório.");
    });

    it("Deve exibir mensagem de erro ao tentar cadastrar um usuario com email invalido", () => {
      const name = faker.helpers.arrayElement(
        faker.rawDefinitions.person.first_name.filter((a) => a.length >= 4)
      );

      registrationPage.register(name, "email");

      registrationPage
        .getErrorFeedbackMessageEmail()
        .should("be.visible")
        .and("contain", "Formato de e-mail inválido");
    });

    it("Deve exibir mensagem de erro ao tentar cadastrar um usuario com email ja cadastrado", () => {
      cy.intercept("POST", "/api/v1/users", mockErrorUserAlreadyExists).as(
        "createUser"
      );

      registrationPage.register("Jeey", "lala@gmail.com");

      cy.wait("@createUser");

      registrationPage
        .getErrorModal()
        .should("be.visible")
        .and("contain", "Este e-mail já é utilizado por outro usuário.");
    });

    it("Deve exibir mensagem de erro ao tentar cadastrar um usuario com email com mais de 60 caracteres", () => {
      const name = faker.helpers.arrayElement(
        faker.rawDefinitions.person.first_name.filter((a) => a.length >= 4)
      );
      const email = `${faker.lorem.words(46)}@gmail.com`;

      registrationPage.register(name, email);
      registrationPage
        .getErrorFeedbackMessageEmail()
        .should("be.visible")
        .and("contain", "Informe no máximo 60 caracteres para o e-mail");
    });
  });
});
