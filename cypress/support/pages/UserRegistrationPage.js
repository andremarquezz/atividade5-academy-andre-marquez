export class UserRegistrationPage {
  nameInput = "#name";
  emailInput = "#email";
  submitButton = ".sc-kpDqfm";
  successMessage = ".go4109123758";
  errorFeedbackMessageName = ".sc-cPiKLX";
  errorFeedbackMessageEmail = ".sc-jEACwC";
  errorModal = ".sc-dCFHLb";

  URL = "https://rarocrud-frontend-88984f6e4454.herokuapp.com/users/novo";

  typeName(name) {
    cy.get(this.nameInput).type(name);
  }

  typeEmail(email) {
    cy.get(this.emailInput).type(email);
  }

  clickButtonSubmit() {
    cy.get(this.submitButton).click();
  }

  getSuccessMessage() {
    return cy.get(this.successMessage);
  }

  getErrorFeedbackMessageName() {
    return cy.get(this.errorFeedbackMessageName);
  }

  getErrorFeedbackMessageEmail() {
    return cy.get(this.errorFeedbackMessageEmail);
  }

  getErrorModal() {
    return cy.get(this.errorModal);
  }

  register(name, email) {
    if (name) {
      this.typeName(name);
    }
    if (email) {
      this.typeEmail(email);
    }
    this.clickButtonSubmit();
  }
}
