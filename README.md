## Description

nest-starter kit using [Nest](https://github.com/nestjs/nest) framework for any API development

### Features

- Authentication with local, jwt and google strategies.
- User management

## Installation

```bash
$ nvm use
$ npm install
$ cp .env.example .env
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## API Swagger Documentation

API documentation is available at http://localhost:3000/api-docs

## Commit Message Guide

### Commit Message Format

```
<type>(<scope?>): <subject>
```

#### Type

Must be one of the following:

- **build**: Changes that affect the build system or external dependencies (example scopes: node, npm)
- **chore**: Updating tasks etc; no production code change
- **gh-actions**: Changes to .github files and scripts (example scopes: ci, dependabot etc.)
- **docs**: Documentation only changes
- **feat**: A new feature
- **fix**: A bug fix
- **perf**: A code change that improves performance
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- **test**: Adding missing tests or correcting existing tests

#### Scope

- **common**: for changes made on src/common directory
- **config**: for changes made on src/config directory
- **resources**: for changes made on src/resources directory
- **lib**: for changes made on root/libs directory
