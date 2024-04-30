import { faker } from "@faker-js/faker";

Cypress.Commands.add("createUser", () => {
  const infoUser = {
    name: faker.helpers.arrayElement(
      faker.rawDefinitions.person.first_name.filter((a) => a.length >= 4)
    ),
    email: faker.internet.email(),
  };

  cy.request({
    method: "POST",
    url: "https://rarocrud-80bf38b38f1f.herokuapp.com/api/v1/users",
    body: infoUser,
  }).then((response) => {
    return response.body;
  });
});
