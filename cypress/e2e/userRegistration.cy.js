import { faker } from "@faker-js/faker";
import { mockErrorUserAlreadyExists } from "../fixtures/mocksErrors";
import { UserListPage } from "../support/pages/UserListPage";
import { UserRegistrationPage } from "../support/pages/UserRegistrationPage";

describe("Pagina de cadastro de usuarios em telas 1536x960", () => {
  const registrationPage = new UserRegistrationPage();

  beforeEach(() => {
    cy.viewport("macbook-16");
    cy.visit(registrationPage.URL);
  });

  describe("Quando o cadastro é realizado com sucesso", () => {
    it("Deve ser possivel cadastrar um usuario com sucesso", () => {
      const name = faker.helpers.arrayElement(
        faker.rawDefinitions.person.first_name.filter((a) => a.length >= 4)
      );
      const email = faker.internet.email();

      cy.intercept("POST", "/api/v1/users").as("createUser");

      registrationPage.register(name, email);

      cy.wait("@createUser");

      registrationPage
        .getSuccessMessage()
        .should("exist")
        .and("contain.text", "Usuário salvo com sucesso!");
    });
  });

  describe("Quando o cadastro de usuarios falha", () => {
    it("Deve exibir mensagem de erro ao tentar cadastrar um usuario sem nome", () => {
      const email = faker.internet.email();

      registrationPage.register("", email);
      registrationPage
        .getErrorFeedbackMessageName()
        .should("be.visible")
        .and("contain.text", "O campo nome é obrigatório.");
    });

    it("Deve exibir mensagem de erro ao tentar cadastrar um usuario com nome com menos de 4 caracteres", () => {
      const name = "Jey";
      const email = faker.internet.email();

      registrationPage.register(name, email);

      registrationPage
        .getErrorFeedbackMessageName()
        .should("be.visible")
        .and("contain.text", "Informe pelo menos 4 letras para o nome.");
    });

    it("Deve exibir mensagem de erro ao tentar cadastrar um usuario com nome com mais de 100 caracteres", () => {
      const name = faker.lorem.words(101);
      const email = faker.internet.email();

      registrationPage.register(name, email);
      registrationPage
        .getErrorFeedbackMessageName()
        .should("be.visible")
        .and("contain.text", "Informe no máximo 100 caracteres para o nome");
    });

    it("Deve exibir mensagem de erro ao tentar cadastrar um usuario com numero no nome", () => {
      const name = "Jey123";
      const email = faker.internet.email();

      registrationPage.register(name, email);

      registrationPage
        .getErrorFeedbackMessageName()
        .should("be.visible")
        .and("contain.text", "Formato do nome é inválido.");
    });

    it("Deve exibir mensagem de erro ao tentar cadastrar um usuario sem email", () => {
      const name = faker.helpers.arrayElement(
        faker.rawDefinitions.person.first_name.filter((a) => a.length >= 4)
      );
      registrationPage.register(name, "");

      registrationPage
        .getErrorFeedbackMessageName()
        .should("be.visible")
        .and("contain.text", "O campo e-mail é obrigatório.");
    });

    it("Deve exibir mensagem de erro ao tentar cadastrar um usuario com email invalido", () => {
      const name = faker.helpers.arrayElement(
        faker.rawDefinitions.person.first_name.filter((a) => a.length >= 4)
      );

      registrationPage.register(name, "email");

      registrationPage
        .getErrorFeedbackMessageEmail()
        .should("be.visible")
        .and("contain.text", "Formato de e-mail inválido");
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
        .and("contain.text", "Este e-mail já é utilizado por outro usuário.");
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
        .and("contain.text", "Informe no máximo 60 caracteres para o e-mail");
    });
  });
  describe("Validação de campos", () => {
    it("Deve redirecionar para a tela de listagem de usuarios ao clicar no botão voltar", () => {
      const userListPage = new UserListPage();

      registrationPage.clickBackButton();

      cy.url().should("eq", userListPage.URL);
    });

    it("Deve redirecionar para a tela de listagem de usuarios ao clicar no icone da Raro", () => {
      const userListPage = new UserListPage();

      registrationPage.clickRaroIcon();

      cy.url().should("eq", userListPage.URL);
    });
  });
});
