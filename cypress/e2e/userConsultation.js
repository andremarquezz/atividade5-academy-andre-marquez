describe.only("Pagina de consulta de usuarios em telas 1536x960", () => {
  beforeEach(() => {
    cy.visit("https://rarocrud-frontend-88984f6e4454.herokuapp.com/users");
  });

  it("Deve ser possivel consultar a lista de usuarios", () => {
    cy.intercept("GET", "/api/v1/users", { fixture: "users.json" }).as(
      "getUsers"
    );

    cy.wait("@getUsers").then(() => {
      cy.get("#listaUsuarios");
    });
  });
});
