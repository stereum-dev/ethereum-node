# Stereum 2.0

[![Support Server](https://img.shields.io/badge/Discord-Stereum-blue?style=flat-square)](https://discord.gg/8Znj8K6GjN) [![Support Email](https://img.shields.io/badge/Email-Stereum-brightgreen?style=flat-square)](mailto:stereum@stereum.net)

This repository contains the code and scripts for ~~[Stereum 2.0](https://stereum.net/ethereum-node/)~~ (tba), an [Ethereum](https://ethereum.org/) node setup and management software with focus on self sovereignity, privacy and flexibility.

## Get Started
Pre-built software packages are available on our [website](https://stereum.net/) or on GitHub releases. After installing the launcher start it up and connect to a server of your choice. Take a look at the ~~[guide](https://stereum.net/ethereum-node/)~~ (tba) to find out what server operating systems are supported and what you can do with Stereum!

### Latest Release
[![beta2.0-solo](https://img.shields.io/badge/release-beta2.0--solo-green?style=for-the-badge)](https://github.com/stereum-dev/ethereum-node/releases/tag/v2.0.0-betasolo)

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
- [![Build: Release](https://github.com/stereum-dev/ethereum-node/actions/workflows/electron.yaml/badge.svg)](https://github.com/stereum-dev/ethereum-node/actions/workflows/electron.yaml) Building Stereum Launcher

### `stable`
Stable version of launcher for build from source & stable version of controls for the launcher to install on the host system.


## Milestones
Milestones build on top of the features of previous milestones.

- [![alpha2.0](https://img.shields.io/badge/milestone-alpha2.0-green?style=flat-square)](https://github.com/stereum-dev/ethereum-node/milestone/1): First release of Stereum 2.0 with the goal to connect to a server and run services. Not properly useable for any use-case yet.
- [![beta2.0-solo](https://img.shields.io/badge/milestone-beta2.0--solo-green?style=flat-square)](https://github.com/stereum-dev/ethereum-node/milestone/2): Suitable for testnet, supporting use cases:
  - Solo staking: Staking validator accounts on Lighthouse, Nimbus, Prysm and Teku
  - Basic monitoring capabilities
- [![beta2.0-bloxssv](https://img.shields.io/badge/milestone-beta2.0--bloxssv-orange?style=flat-square)](https://github.com/stereum-dev/ethereum-node/milestone/3): Suitable for testnet, adding e. g. use cases & features:
  - Blox SSV: Setup an operator and connect to Lighthouse, Nimbus, Prysm or Teku
  - Blox SSV dashboard
  - Fix Grafana dashboards
  - Besu support
  - Nethermind support
  - UI for update settings
  - Validator account stats
- ![unnamed](https://img.shields.io/badge/milestone-unnamed-inactive?style=flat-square): Suitable for testnet, adding use cases & features:
  - tba

### Goal
- ![stable2.0](https://img.shields.io/badge/milestone-stable2.0-inactive?style=flat-square): Suitable for mainnet, supporting main use cases
  - i18n support
  - in-launcher tutorials
  - flexible selection of services
  - switch clients/networks on the fly
  - multiple exeuction/consensus clients
  - ssv support (blox/obol)
  - one-click-installation
  - enhanced slashing protection on import
  - naming & grouping validators
  - unattended updates