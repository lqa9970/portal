# Introduction 
Frontend module in the DevOps Foundation project. 

This is a portal where users can order DevOps Foundation projects. 

## Functional requirements:
1. Check existing projects and its information.
2. Check the status on existing and on going projects.
3. Create a new sandbox and project through a form.
4. Easy way to add an environment to an existing project.

## Non functional requirements:
1. Leverage up-to-date technology to improve delivery quality while reduce development time.
2. Apply code best practices to improve application performance, increase code readability and maintainability.
3. Application needs to be easy-to-use by non technical users. Meaning that all inputs and actions from the users need to be validated. Info and error messages need to be shown accordingly.
4. New functional and non-functional requirements need to be up-to-date to provide developers with needed information.
5. Ensure security aspects by implement authentication flow suggested by Microsoft.

# Technology
1.  [Typescript](https://www.typescriptlang.org/): Improve code quality, code maintainability, and developer experience.
2.  [React](https://reactjs.org/): Modern and established library to create frontend application.
3.  [Vite](https://vitejs.dev/): Mordern scaffolding and bundling project tool. Alternative for create-react-app which is no longer actively maintained.
4.  [MSAL](https://learn.microsoft.com/en-us/azure/active-directory/develop/msal-overview): Microsoft Authentication Library, seamless integration with AAD.
5.  [Material UI](https://mui.com/): Ready-to-use UI component library. 
6.  [React query](https://tanstack.com/query/): Improve UX with network cache and stale-while-validate strategy implemented out of the box.
7.  [React hookform](https://react-hook-form.com/): Comprehensive library to manage form in react.
8.  [Zod](https://zod.dev/): Schema creation and validation tools. Support first class Typescript.
9.  [React router](https://reactrouter.com/): Library to handle page routing for React.
10. [React i18next](https://react.i18next.com/): internationalization framework for React.
11. [Cypress](https://www.cypress.io/): Comprehensive end-to-end testing library.
12. [Eslint](https://eslint.org/): Lint tool to improve coding standard.

# Installation and Development
1.  Clone repository
2.  Create a .env and add needed variables
3.  Install the project dependencies
> npm install
4.  Start the development server
> npm run dev 
5.  If you run into npm errors. Check that your system use [LTS node environment](https://nodejs.org/en/).
6.  Make sure that the development server run on http://localhost:3000 to match the Azure Storage redirect url configuration.
7.  Make changes directly to main branch or create and develop from a feature branch.
8.  Push to main branch or create and merge the pull request to main branch which triggers automatic deployment to development environment.
9.  Document the changes

# Test the project
We use cypress to run end-to-end and integration test suite.
1. Start the development server
> npm run dev 
2. Start the test environment
> npx cypress run
3. Follow the test instruction in the opened dashboard

# Build the project locally
We can build the project locally and check the size of the built files.
1. Run the build command
> npm run build 
2. A **dist** folder will be created in the root level. 
3. Additionally you can check the **stats.html** file inside dist to review the library used in this project.

# Code structure
There are no strict rule on the structure of the code. However, please review [react-folder-structure](https://www.robinwieruch.de/react-folder-structure/) section TECHNICAL FOLDERS and FEATURE FOLDERS to develop maintainable, scalable and sensible project structure.

# Contact us
If you run into problem with this project, please contact [Nordcloud](https://nordcloud.com/contact/) for supports. 