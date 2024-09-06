# Contribution Guide

Thank you for your interest in Stereum. The following is a set of instructions for contributing to this project. These are just guidelines, not rules, however it is highly recommended that you follow them in order to pass automated tests and your [pull requests](#pull-requests) get accepted.

## Prerequisites

Before you can start, you need to install the necessary software packages to develop (or **optionally** test and build) Stereum locally.

### Required Software

Refer to the official [NodeJS](https://nodejs.org/) website to install [NodeJS >= 16 LTS](https://nodejs.org/en/download/) on your OS.

### Recommended Software

Furthermore, the easiest way to follow our [Style Guide](#style-guide) and [contributor workflow](#pull-requests) is to use [Visual Studio Code (VSCode)](https://code.visualstudio.com/) as IDE with at least the following extensions added:

- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [GitLens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens)

This guide will explain all further steps assuming you are using [VSCode](https://code.visualstudio.com/) and the mentioned extensions.

> If you are using Windows, we strongly recommend you to [use Git Bash as terminal inside VSCode](https://www.geeksforgeeks.org/how-to-integrate-git-bash-with-visual-studio-code/)!

## Getting Started

1. [Fork the repository](https://github.com/stereum-dev/ethereum-node/fork) to your GitHub account
2. Clone the repository from your GitHub account to your local system
3. On your local system open the main directory (_ethereum-node_) in VSCode
4. Inside VSCode, open a new terminal and type:
   - `cd launcher` (to move to the launcher directory)
   - `npm i` (to install the required NodeJS packages)
   - `npm run electron:serve` (to start the development version of Stereum)

Congratulations, Stereum was running the first time in _dev-mode_ on your local system.
To create your own build you can use `npm run electron:build` and find it in the _dist_electron_ folder.

## Pull Requests

If you want to add changes to the global Stereum repository you need to do a pull request.

Pull requests will be reviewed/merged ASAP - please follow this steps:

1. Open your [local development environment](#getting-started)
2. Create your feature branch:
   - `git checkout -b feat/new-feature`
3. Use `npm run format:check` to check the format of your code and `run npm run format` to format your code
4. Commit your changes:
   - `git commit -m "feat(optional): new feature"`
5. Push the branch:
   - `git push origin feat/new-feature`
6. Open a pull request

#### Pull Request Titles

- Should be short and descriptive summary
- Should be written in imperative present tense
- Should not end with a period

For example:

> Add a new restart button to the node page

If you wanna write commit messages and pull request like a boss, feel free to [read this](https://www.conventionalcommits.org/en/v1.0.0/), but that's really just optional. :smiley:

#### Pull Request Essentials

- An open pull request signals to the maintainers that it's ready for review. This implies that a pull request which is not ready for review should remain as draft.
- If your pull request is no longer applicable to fix an issue, please close your pull request.
- If your pull request is fixable and needs additional changes or commits within a short period of time, please switch your pull request into a draft until it's ready for review.

## Unit Testing and Linting

All [pull requests](#pull-requests) running thru automated tests. It is recommended to run this tests locally before you open a [pull request](#pull-requests) to pass global tests later on.

1. Execute `npm run test .test` to run unit tests with Jest (where no errors as result means passed)
2. Execute `npm run lint:fix` to run lint tests with ESLint (where no errors as result means passed)

> Note: The ESLint (`npm run lint:fix`) tests are currently optional and you only need to care about files you changed.

## But Reporting and Feature Requests

If you have found a bug or wanna have a new feature just [create a new issue](https://github.com/stereum-dev/ethereum-node/issues/new/choose). Select the type of issue that best fits, and please fill out as much of the information as you can.

## Style Guide

If you use the [recommended software and extensions](#recommended-software) described in the [prerequisites](#prerequisites) section usually everything is already auto formatted and/or code issues are announced in the "Problems" tab of [VSCode](https://code.visualstudio.com/).

However, here are a few hints you may follow to keep your code clean and pass automated tests:

- Make sure your code is properly linted:
  - Use an IDE that will show linting errors/warnings
  - Execute `npm run lint:fix` from the command line
  - Common rules:
    - Functions and variables should be [camelCase](https://en.wikipedia.org/wiki/Camel_case)
    - Classes should be [PascalCase](http://wiki.c2.com/?PascalCase)
    - Constants should be `UPPERCASE_WITH_UNDERSCORES`
    - Use `"` instead of `'`

> You only have to take care about linting issues of files you have changed

- Make sure that jest tests are passing:
  - run `npm run test .test` from the command line

> Pull requests must pass all automated Jest tests to get accepted

- Comments:
  - If your code does something that is not obvious or deviates from standards, please leave a comment for other developers to explain your logic and reasoning
  - Use `//` commenting format as default
  - Optional use `/* */` commenting format for documenting a function, class or variable
  - Keep comments short and simple

## First Time Contributor?

Still not sure how to help or where to start? Then visit us on [Discord](https://discord.gg/8Znj8K6GjN) or drop us an email to [stereum@stereum.net](mailto:stereum@stereum.net).
