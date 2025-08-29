describe('Comprehensive Albums GraphQL API Testing', () => {

    // --- Get All Albums ---
    it('should be able to get all albums without any options', () => {
        const query = `
            query {
                albums {
                    data {
                        id
                        title
                    }
                }
            }
        `;
        cy.sendGraphQLRequest(query).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.data.albums.data).to.be.an('array').and.not.be.empty;
        });
    });

    // --- Get All Albums with Options (Queries) ---
    it('should paginate albums with a specific limit', () => {
        const query = `
            query {
                albums(options: { paginate: { limit: 5 } }) {
                    data {
                        id
                        title
                    }
                }
            }
        `;
        cy.sendGraphQLRequest(query).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.data.albums.data).to.have.lengthOf(5);
        });
    });

    it('should paginate albums with a specific page and limit', () => {
        const query = `
            query {
                albums(options: { paginate: { page: 2, limit: 5 } }) {
                    data {
                        id
                        title
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
            expect(response.body.data.albums.data).to.have.lengthOf(5);
        });
    });

    it('should sort albums by title in ascending order', () => {
        const query = `
            query {
                albums(options: {
                    sort: { field: "title", order: ASC }
                    paginate: { limit: 10 }
                }) {
                    data {
                        id
                        title
                    }
                }
            }
        `;
        cy.sendGraphQLRequest(query).then((response) => {
            expect(response.status).to.eq(200);
            const albumTitles = response.body.data.albums.data.map(album => album.title);
            const sortedTitles = [...albumTitles].sort();
            expect(albumTitles).to.deep.equal(sortedTitles);
        });
    });

    it('should sort albums by title in descending order', () => {
        const query = `
            query {
                albums(options: {
                    sort: { field: "title", order: DESC }
                    paginate: { limit: 10 }
                }) {
                    data {
                        id
                        title
                    }
                }
            }
        `;
        cy.sendGraphQLRequest(query).then((response) => {
            expect(response.status).to.eq(200);
            const albumTitles = response.body.data.albums.data.map(album => album.title);
            const sortedTitles = [...albumTitles].sort().reverse();
            expect(albumTitles).to.deep.equal(sortedTitles);
        });
    });

    it('should search for albums by a keyword', () => {
        const searchKeyword = 'dolores';
        const query = `
            query {
                albums(options: { search: { q: "${searchKeyword}" } }) {
                    data {
                        id
                        title
                    }
                }
            }
        `;
        cy.sendGraphQLRequest(query).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.data.albums.data).to.have.length.greaterThan(0);
            response.body.data.albums.data.forEach(album => {
                expect(album.title).to.include(searchKeyword);
            });
        });
    });

    // CRUD
    // --- C: Create album (Mutation) ---
    it('should be able to create a new Album', () => {
        const title = 'Cypress Album Test'
        const mutation = `
            mutation {
                createAlbum(input: {
                    title: "${title}",
                    userId: 1
                }) {
                    id
                    title
                    user {
                        name
                    }
                }
            }
        `;
        cy.sendGraphQLRequest(mutation).then((response) => {
            expect(response.status).to.eq(200);
            // Assert that the response data is an object and has a createAlbum field.
            expect(response.body.data).to.have.property('createAlbum').and.be.an('object');
            // Assert that the id property exists and is a string.
            expect(response.body.data.createAlbum).to.have.property('id').and.not.be.null;
            expect(response.body.data.createAlbum.title).to.eq(title);
        });
    });

    // --- R: Read album by id (Queries) ---
    it('should be able to query a single Album by ID', () => {
        const query = `
            query {
                album(id: 1) {
                    title
                }
            }
        `;
        cy.sendGraphQLRequest(query).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.data.album).to.have.property('title');
        });
    });

    it('should return null for a non-existent Album', () => {
        const query = `
            query {
                album(id: 99999) {
                    title
                }
            }
        `;
        cy.sendGraphQLRequest(query).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.data.album.title).to.be.null;
        });
    });


    // --- U: Update (Mutation) ---
    it('should be able to update an Album', () => {
        const updatedTitle = 'Updated Album Title';
        const mutation = `
            mutation {
                updateAlbum(id: 1, input: {
                    title: "${updatedTitle}"
                }) {
                    title
                }
            }
        `;
        cy.sendGraphQLRequest(mutation).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.data.updateAlbum.title).to.eq(updatedTitle);
        });
    });

    // --- D: Delete album (Mutation) ---
    it('should be able to delete an Album', () => {
        const mutation = `
            mutation {
                deleteAlbum(id: 1)
            }
        `;
        cy.sendGraphQLRequest(mutation).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.data.deleteAlbum).to.be.true;
        });
    });

    // --- Error Handling Scenarios ---
    // Syntax Error
    it('should return a 400 Bad Request for a malformed album query', () => {
        const malformedQuery = `
            query {
                album(id: 1) { 
                    title 
        `;
        cy.sendGraphQLRequest(malformedQuery, { failOnStatusCode: false }).then((response) => {
            expect(response.status).to.eq(400);
            expect(response.body.errors).to.be.an('array').and.not.be.empty;
            expect(response.body.errors[0].message).to.include('Syntax Error');
        });
    });

    // Validation Error
    it('should return a 400 Bad Request for an invalid ID type in album query', () => {
        const query = `
            query {
                album(id: invalid_id) {
                    title
                }
            }
        `;
        cy.sendGraphQLRequest(query, { failOnStatusCode: false }).then((response) => {
            expect(response.status).to.eq(400);
            expect(response.body.errors).to.be.an('array').and.not.be.empty;
            expect(response.body.errors[0].message).to.include('ID cannot represent a non-string and non-integer value');
        });
    });
    
    // // Mutation Error
    it('should return a 400 for a mutation with missing required fields', () => {
        const mutation = `
            mutation {
                createAlbum(input: {
                    userId: 1
                }) {
                    id
                }
            }
        `;
        cy.sendGraphQLRequest(mutation, { failOnStatusCode: false }).then((response) => {
            expect(response.status).to.eq(400);
            expect(response.body.errors).to.be.an('array').and.not.be.empty;
            expect(response.body.errors[0].message).to.include('Field "CreateAlbumInput.title" of required type "String!" was not provided.');
        });
    });
});
