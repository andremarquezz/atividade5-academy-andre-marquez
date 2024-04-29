export class UserDetailsPage {
  idInput = "[name=id]";
  nameInput = "#userName";
  emailInput = "#userEmail";
  editButton = '.sc-kpDqfm [type="button"]';
  saveButton = '.sc-kpDqfm [type="submit"]';
  modalAlert = ".sc-dCFHLb";

  URL = "https://rarocrud-frontend-88984f6e4454.herokuapp.com/users";

  visit(userId) {
    const userDetailsURL = `${this.URL}/${userId}`;
    cy.visit(userDetailsURL);
  }

  getIdInput() {
    return cy.get(this.idInput);
  }

  getNameInput() {
    return cy.get(this.nameInput);
  }

  getEmailInput() {
    return cy.get(this.emailInput);
  }

  getModalAlert() {
    return cy.get(this.modalAlert);
  }

  typeName(name) {
    return cy.get(this.nameInput).type(name);
  }

  typeEmail(email) {
    return cy.get(this.emailInput).type(email);
  }

  clickEditButton() {
    return cy.get(this.editButton).click();
  }

  clickSaveButton() {
    cy.get(this.saveButton).click();
  }

  edit(name, email) {
    if (name) {
      this.typeName(name);
    }
    if (email) {
      this.typeEmail(email);
    }
    this.clickSaveButton();
  }
}
