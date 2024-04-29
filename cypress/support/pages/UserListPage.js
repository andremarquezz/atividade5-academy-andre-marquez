export class UserListPage {
  userDataName = `[data-test="userDataName"]`;
  userDataEmail = `[data-test="userDataEmail"]`;
  userDetailsButton = "#userDataDetalhe";
  emptyUserListMessage = ".sc-koXPp";
  modalErrorServerMessage = ".sc-dCFHLb";
  newUserAnchor = ".sc-bmzYkS[href='/users/novo']";
  searchInput = ".sc-gsFSXq";

  URL = "https://rarocrud-frontend-88984f6e4454.herokuapp.com/users";

  visit() {
    cy.visit(this.URL);
  }

  getName() {
    return cy.get(this.userDataName);
  }

  getEmail() {
    return cy.get(this.userDataEmail);
  }

  typeSearchBar(text) {
    return cy.get(this.searchInput).type(text);
  }

  clickFirstUserDetailsButton() {
    return cy.get(this.userDetailsButton).first().click();
  }

  getEmptyUserListMessage() {
    return cy.get(this.emptyUserListMessage);
  }

  getNewUserAnchor() {
    return cy.get(this.newUserAnchor);
  }

  getModalErrorServerMessage() {
    return cy.get(this.modalErrorServerMessage);
  }

  // createUserAndBackList(name, email) {
  //   registrationPage.register(name, email);

  //   registrationPage.clickBackButton()

  // }
}
