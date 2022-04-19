describe('test login functionality', () => {
  it('user can login', () => {
    cy.clearCookies();

    cy.visit('http://localhost:3000/#/');
    cy.findByRole('button', { name: /login/i }).click();
    const username = 'test-user';
    const password = 'password';
    cy.get('.login_searchInputBox__pQkqQ').type(username);
    cy.get('.login_inputBox__2hN0K').type(password);
    cy.get('.login_signUpButton__hO_j2').click();

    cy.get('.home__sidebar_username__oT5hs').then((heading) => {
      const headingText = heading.text().replace(/\@|,/g, '');
      expect(headingText).to.equal(username);
    });
  });
});
