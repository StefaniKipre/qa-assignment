describe('Comprehensive Users GraphQL API Testing', () => {

    // --- Get All Users ---
    it('should be able to get all users without any options', () => {
        const query = `
            query {
                users {
                    data {
                        id
                        name
                        email
                        username
                        website
                        albums {
                            data {
                                id
                                title
                            }
                        }
                    }
                }
            }
        `;
        cy.sendGraphQLRequest(query).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.data.users.data).to.be.an('array').and.not.be.empty;
        });
    });

    // --- Get All Users with Options (Queries) ---
    it('should paginate users with a specific limit', () => {
        const query = `
            query {
                users(options: { paginate: { limit: 5 } }) {
                    data {
                        id
                        name
                        email
                        username
                    }
                }
            }
        `;
        cy.sendGraphQLRequest(query).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.data.users.data).to.have.lengthOf(5);
        });
    });

    it('should paginate users with a specific page and limit', () => {
        const query = `
            query {
                users(options: { paginate: { page: 2, limit: 5 } }) {
                    data {
                        id
                        name
                        email
                        username
                    }
                    links {
                        prev{
                            page
                        }
                        next{
                            page
                        }
                    }
                }
            }
        `;
        cy.sendGraphQLRequest(query).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.data.users.data).to.have.lengthOf(5);
        });
    });

    it('should sort users by name in ascending order', () => {
        const query = `
            query {
                users(options: {
                    sort: { field: "name", order: ASC }
                }) {
                    data {
                        id
                        name
                        email
                        username
                    }
                }
            }
        `;
        cy.sendGraphQLRequest(query).then((response) => {
            expect(response.status).to.eq(200);
            const userNames = response.body.data.users.data.map(user => user.name);
            const sortedNames = [...userNames].sort();
            expect(userNames).to.deep.equal(sortedNames);
        });
    });

    it('should sort users by username in descending order', () => {
        const query = `
            query {
                users(options: {
                    sort: { field: "username", order: DESC }
                }) {
                    data {
                        id
                        name
                        email
                        username
                    }
                }
            }
        `;
        cy.sendGraphQLRequest(query).then((response) => {
            expect(response.status).to.eq(200);
            const userUsernames = response.body.data.users.data.map(user => user.username);
            const sortedUsernames = [...userUsernames].sort().reverse();
            expect(userUsernames).to.deep.equal(sortedUsernames);
        });
    });

    it('should search for users by a keyword', () => {
        const searchKeyword = 'Leanne';
        const query = `
            query {
                users(options: { search: { q: "${searchKeyword}" } }) {
                    data {
                        id
                        name
                        email
                        username
                    }
                }
            }
        `;
        cy.sendGraphQLRequest(query).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.data.users.data).to.have.length.greaterThan(0);
            response.body.data.users.data.forEach(user => {
                // Concatenate all fields you want to search
                const nameEmailOrUsername = user.name + user.email + user.username;
                expect(nameEmailOrUsername).to.include(searchKeyword);
            });
        });
    });

    // CRUD
    // --- C: Create user (using a mock `createUser` mutation) ---
    it('should be able to create a new User (assuming a mock response)', () => {
        const name = "John Does";
        const email = "john.doe@test.com";
        const username = "johndoes"
        const mutation = `
            mutation {
                createUser(input: {
                    name: "${name}",
                    email: "${email}",
                    username: "${username}"
                }) {
                    id
                    name
                    email
                    username
                }
            }
        `;
        cy.sendGraphQLRequest(mutation).then((response) => {
            expect(response.status).to.eq(200);
            // expect(response.body.data.createUser.id).to.be.a('string');
            // Assert that the response data is an object and has a createAlbum field.
            expect(response.body.data).to.have.property('createUser').and.be.an('object');
            // Assert that the id property exists and is a string.
            expect(response.body.data.createUser).to.have.property('id').and.not.be.null;
            expect(response.body.data.createUser.name).to.eq(name);
            expect(response.body.data.createUser.email).to.eq(email);
            expect(response.body.data.createUser.username).to.eq(username);
        });
    });

    // --- R: Read user by id (Queries) ---
    it('should be able to query a User and their Albums', () => {
        const query = `
            query {
                user(id: 1) {
                    name
                    email
                    username
                    website
                    albums {
                        data {
                            id
                            title
                        }
                    }
                }
            }
        `;
        cy.sendGraphQLRequest(query).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.data.user.name).to.eq('Leanne Graham');
            expect(response.body.data.user.albums.data).to.have.length.greaterThan(0);
        });
    });

    it('should return null for a non-existent User', () => {
        const query = `
            query {
                user(id: 99999) {
                    name
                    email
                    username
                    website
                    albums {
                        data {
                            id
                            title
                        }
                    }
                }
            }
        `;
        cy.sendGraphQLRequest(query).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.data.user.name).to.be.null;
            expect(response.body.data.user.email).to.be.null;
            expect(response.body.data.user.username).to.be.null;
        });
    });


    // --- U: Update (Mutation) ---
    it('should be able to update a User (assuming a mock response)', () => {
        const updatedUseraname = 'Updated username';
        const mutation = `
            mutation {
                updateUser(id: 11, input: {
                    username: "${updatedUseraname}"
                }) {
                    username
                }
            }
        `;
        cy.sendGraphQLRequest(mutation).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.data.updateUser.username).to.eq(updatedUseraname);
        });
    });

    // --- D: Delete user (Mutation) ---
    it('should be able to delete a User (assuming a mock response)', () => {
        const mutation = `
            mutation {
                deleteUser(id: 11)
            }
        `;
        cy.sendGraphQLRequest(mutation).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.data.deleteUser).to.be.true;
        });
    });

    // --- Error Handling Scenarios ---
    // Syntax Error
    it('should return a 400 Bad Request for a malformed query', () => {
        // This query has a syntax error (missing a closing brace)
        const malformedQuery = `
            query {
                user(id: 1) { 
                    name 
                
        `; 
        cy.sendGraphQLRequest(malformedQuery, { failOnStatusCode: false }).then((response) => {
            expect(response.status).to.eq(400);
            expect(response.body.errors).to.be.an('array').and.not.be.empty;
            expect(response.body.errors[0].message).to.include('Syntax Error');
        });
    });

    // Validation Error
    it('should return a 400 Bad Request for an invalid ID type', () => {
        const query = `
            query {
                user(id: invalid_id) {
                    name
                }
            }
        `;
        cy.sendGraphQLRequest(query, { failOnStatusCode: false }).then((response) => {
            expect(response.status).to.eq(400);
            expect(response.body.errors).to.be.an('array').and.not.be.empty;
            expect(response.body.errors[0].message).to.include('ID cannot represent a non-string and non-integer value');
        });
    });

    // Mutation Error
    it('should return a 400 for a mutation with missing required fields', () => {
        const mutation = `
            mutation {
                createUser(input: {
                    name: "Test User"
                }) {
                    id
                }
            }
        `;
        cy.sendGraphQLRequest(mutation, { failOnStatusCode: false }).then((response) => {
            expect(response.status).to.eq(400);
            expect(response.body.errors).to.be.an('array').and.not.be.empty;
            expect(response.body.errors[0].message).to.include('Field "CreateUserInput.username" of required type "String!" was not provided.');
        });
    });
});