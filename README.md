# Stereum 2.0

[![Support Server](https://img.shields.io/badge/Discord-Stereum-blue)](https://discord.gg/8Znj8K6GjN) [![Support Email](https://img.shields.io/badge/Email-Stereum-brightgreen)](mailto:stereum@stereum.net)

This repository contains the code and scripts for ~~[Stereum 2.0](https://stereum.net/ethereum-node/)~~ (tba), an [Ethereum](https://ethereum.org/) node setup and management software with focus on self sovereignity, privacy and flexibility.

## Get Started
Pre-built software packages are available on our [website](https://stereum.net/). After installing the launcher start it up and connect to a server of your choice. Take a look at the ~~[guide](https://stereum.net/ethereum-node/)~~ (tba) to find out what server operating systems are supported and what you can do with Stereum!

## Contribute
Want to get involved? Create a pull request and we'll have a look at it!

Not sure? Then visit us on [Discord](https://discord.gg/8Znj8K6GjN) or drop us an email to [stereum@stereum.net](mailto:stereum@stereum.net).

## Branches
### `main`
For development, automated tests running for each commit and merge.

#### Tests
- [![Security: Shellcheck](https://github.com/stereum-dev/ethereum-node/actions/workflows/shellcheck.yml/badge.svg)](https://github.com/stereum-dev/ethereum-node/actions/workflows/shellcheck.yml) Security checking shell scripts
- [![Tests: JEST](https://github.com/stereum-dev/ethereum-node/actions/workflows/test-jest.yml/badge.svg)](https://github.com/stereum-dev/ethereum-node/actions/workflows/test-jest.yml) JEST unit tests
- [![Tests: Molecule](https://github.com/stereum-dev/ethereum-node/actions/workflows/test-molecule.yml/badge.svg)](https://github.com/stereum-dev/ethereum-node/actions/workflows/test-molecule.yml) Backend system tests with Molecule & Ansible
- [![Tests: Integration](https://github.com/stereum-dev/ethereum-node/actions/workflows/test-integration.yml/badge.svg)](https://github.com/stereum-dev/ethereum-node/actions/workflows/test-integration.yml) JEST system integration tests

#### Build
- [![Build: Release](https://github.com/stereum-dev/ethereum-node/actions/workflows/build.yml/badge.svg)](https://github.com/stereum-dev/ethereum-node/actions/workflows/build.yml) Building Stereum Launcher

### `stable`
~~released code~~ not yet in use


## Milestones
Milestones build on top of the features of previous milestones.

- [![alpha2.0](https://img.shields.io/badge/milestone-alpha2.0-green)](https://github.com/stereum-dev/ethereum-node/milestone/1): First release of Stereum 2.0 with the goal to connect to a server and run services. Not properly useable for any use-case yet.
- [![beta2.0-solo](https://img.shields.io/badge/milestone-beta2.0--solo-orange)](https://github.com/stereum-dev/ethereum-node/milestone/2): Suitable for testnet, supporting use cases:
  - Solo staking: Staking validator accounts on Lighthouse, Nimbus, Prysm and Teku
  - Basic monitoring capabilities
- [![beta2.0-bloxssv](https://img.shields.io/badge/milestone-beta2.0--bloxssv-inactive)](https://github.com/stereum-dev/ethereum-node/milestone/3): Suitable for testnet, supporting use cases:
  - Blox SSV: Setup an operator and connect to Lighthouse, Nimbus, Prysm or Teku
- ![stable2.0](https://img.shields.io/badge/milestone-stable2.0-inactive): Suitable for mainnet, supporting main use cases
  - i18n support