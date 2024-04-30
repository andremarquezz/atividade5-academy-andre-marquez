import { UserDetailsPage } from "../support/pages/UserDetailsPage";
import { UserListPage } from "../support/pages/UserListPage";

describe("Consulta de detalhes de usuário", () => {
  describe("Quando a consulta de detalhes de usuário é realizada com sucesso", () => {
    const userDetailsPage = new UserDetailsPage();
    let user;

    before(() => {
      cy.createUser().then((randomUser) => {
        user = randomUser;
      });
    });

    beforeEach(() => {
      cy.viewport("macbook-16");

      cy.intercept("GET", "/api/v1/users/*").as("getUserById");

      userDetailsPage.visit(user.id);
    });

    it("Deve ser possível consultar os detalhes de um usuário", () => {
      cy.wait("@getUserById");

      userDetailsPage.getIdInput().should("be.disabled");
      userDetailsPage.getNameInput().should("be.disabled");
      userDetailsPage.getEmailInput().should("be.disabled");

      userDetailsPage.getIdInput().invoke("val").should("eq", user.id);
      userDetailsPage.getNameInput().invoke("val").should("eq", user.name);
      userDetailsPage.getEmailInput().invoke("val").should("eq", user.email);
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

describe("Validação de campos", () => {
  const userDetailsPage = new UserDetailsPage();
  let user;

  before(() => {
    cy.createUser().then((randomUser) => {
      user = randomUser;
    });
  });

  beforeEach(() => {
    cy.viewport("macbook-16");
    cy.intercept("GET", "/api/v1/users/*").as("getUserById");
  });

  it("Deve retornar a lista de usuarios cadastrados quando o usuario não for encontrado e clicar no botão de cancelar ", () => {
    const fakeId = "ca8efbac-3269-4d28-8e89-4cd5345";
    const userListPage = new UserListPage();

    userDetailsPage.visit(fakeId);

    cy.wait("@getUserById");

    userDetailsPage.getModalAlert().should("be.visible");
    userDetailsPage.clickCancelButton();
    cy.url().should("eq", userListPage.URL);
  });

  it("Deve liberar os campos para edição quando clicar no botão de editar", () => {
    userDetailsPage.visit(user.id);

    cy.wait("@getUserById");

    userDetailsPage.clickEditButton();

    userDetailsPage.getNameInput().should("not.be.disabled");
    userDetailsPage.getEmailInput().should("not.be.disabled");
  });
});
