import { UserListPage } from "./UserListPage";

export class UserDetailsPage {
  userIdInput = "[name=id]";
  userNameInput = "#userName";
  userEmailInput = "#userEmail";
  userListPage = new UserListPage();

  URL = `https://rarocrud-frontend-88984f6e4454.herokuapp.com/users/dfc10878-a1ac-4a0c-a4f6-6b2984d77ac2`;

  visitDetailsPage() {
    let user;
    cy.intercept("GET", "/api/v1/users", {
      fixture: "mockResponseGetAllUsers.json",
    })
      .as("getAllUsers")
      .then(({ response }) => {
        user = response.body[0];
      });

    cy.wait("@getAllUsers");

    cy.intercept("GET", `/api/v1/users/${user.id}`, user).as("getUserById");

    cy.visit(this.userListPage.URL);
    cy.get(this.userListPage.userDetailsButton).first().click();
  }

  getUserIdInput() {
    return cy.get(this.userIdInput);
  }

  getUserNameInput() {
    return cy.get(this.userNameInput);
  }

  getUserEmailInput() {
    return cy.get(this.userEmailInput);
  }
}
