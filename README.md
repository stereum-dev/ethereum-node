# Stereum 2.0

[![Support Server](https://img.shields.io/badge/Discord-Stereum-blue)](https://discord.gg/8Znj8K6GjN) [![Support Email](https://img.shields.io/badge/Email-Stereum-brightgreen)](mailto:stereum@stereum.net)

This repository contains the code and scripts for [Stereum 2.0](https://stereum.net/ethereum-node/), an [Ethereum](https://ethereum.org/de/) node setup and management software with focus on self sovereignity, privacy and flexibility.

## Get Started
Pre-built software packages are available on our [website](https://stereum.net/ethereum-node/). After installing the launcher start it up and connect to a server of your choice. Take a look at the [guide](https://stereum.net/ethereum-node/) to find out what server operating systems are supported and what you can do with Stereum!

## Contribute
Want to get involved? Create a pull request and we'll have a look at it!

Not sure? Then visit us on [Discord](https://discord.gg/8Znj8K6GjN) or drop us an email to [stereum@stereum.net](mailto:stereum@stereum.net).

## Branches
### `main`
For development, automated tests running for each commit and merge.

#### Tests
- [![Security: Shellcheck](https://github.com/stereum-dev/ethereum-node/actions/workflows/shellcheck.yml/badge.svg)(https://github.com/stereum-dev/ethereum-node/actions/workflows/shellcheck.yml)] Security checking shell scripts
- [![Tests: JEST](https://github.com/stereum-dev/ethereum-node/actions/workflows/test-jest.yml/badge.svg)(https://github.com/stereum-dev/ethereum-node/actions/workflows/test-jest.yml)] JEST unit tests
- [![Tests: Molecule](https://github.com/stereum-dev/ethereum-node/actions/workflows/test-molecule.yml/badge.svg)(https://github.com/stereum-dev/ethereum-node/actions/workflows/test-molecule.yml)] Backend system tests with Molecule & Ansible
- [![Tests: Integration](https://github.com/stereum-dev/ethereum-node/actions/workflows/test-integration.yml/badge.svg)(https://github.com/stereum-dev/ethereum-node/actions/workflows/test-integration.yml)] JEST system integration tests

### `stable`
~~released code~~ not yet in use


## Milestones
- [alpha2.0](https://github.com/stereum-dev/ethereum-node/milestone/1): First release of Stereum 2.0 with the goal to connect to a server and run services. Not properly useable for any use-case yet.
- beta2.0: Suitable for testnet, supporting use cases:
  - Solo staking: Staking validator accounts on Lighthouse, Nimbus, Prysm and Teku
  - Blox SSV: Setup an operator and connect to Lighthouse, Nimbus, Prysm or Teku
  - Basic monitoring capabilities
  - i18n support
- stable2.0: Suitable for mainnet, supporting main use cases