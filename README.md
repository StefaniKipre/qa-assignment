

# QA Assignment: Comprehensive GraphQL API Testing

This repository contains a Quality Assurance assignment focused on performing comprehensive API testing for a GraphQL endpoint using Cypress. The project is set up with a Continuous Integration (CI) pipeline to ensure that all changes are automatically validated.

## 🚀 Features

* **Comprehensive Test Suite**: Includes tests for various GraphQL operations, including queries, mutations, and error handling.
* **Cypress API Testing**: Utilizes Cypress as the primary tool for making HTTP requests to the GraphQL API and validating responses.
* **Continuous Integration (CI)**: A GitHub Actions workflow is configured to automatically run tests on every push and pull request.
* **Git Branching Strategy**: The CI pipeline is configured to run on both the `main` and `develop` branches, supporting a standard Git branching workflow.

## 🛠️ Technologies Used

* **Cypress**: A fast, easy, and reliable testing tool for anything that runs in a browser.
* **Node.js & npm**: The JavaScript runtime and package manager used to set up the project.
* **GraphQL Zero API**: A public GraphQL API endpoint used for testing.
* **GitHub Actions**: The CI/CD platform used to automate the testing workflow.

## 🏁 Getting Started

To get a copy of this project up and running on your local machine, follow these steps.

### Prerequisites

You need to have Node.js and npm installed.

### Installation

1.  **Clone the repository and navigate into the project directory:**

    ```bash
    git clone https://github.com/StefaniKipre/qa-assignment.git
    cd qa-assignment
    ```

2.  **Install project dependencies:**

    ```bash
    npm i
    ```

### Running Tests

To run the Cypress tests locally in headless mode, use the following command:

```bash
npm run cypress:run
```

To open the Cypress Test Runner for interactive testing and debugging, use:

```bash
npm run cypress:open
```

## ⚙️ CI/CD Pipeline

The CI workflow is configured in `.github/workflows/ci.yml`. It performs the following actions:

1.  **Triggers**: The pipeline runs automatically on `push` and `pull_request` events targeting the `main` or `develop` branches.
2.  **Dependencies**: It installs all necessary npm dependencies.
3.  **Cypress Run**: It executes the `npm run cypress:run` command to run all tests in a headless environment.

This setup ensures that all code changes are automatically validated, preventing regressions and maintaining a high level of quality on both the development and production branches.