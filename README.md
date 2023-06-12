![GitHub_Stereum_Banner](https://github.com/stereum-dev/ethereum-node/assets/82385103/cf94018a-b926-4fbe-aec8-ceef587053ff)


---

[![IE](https://img.shields.io/badge/Website-0076D6?style=for-the-badge&logo=Internet%20Explorer&logoColor=white)](https://stereum.net) [![Discord](https://img.shields.io/badge/Discord-%235865F2.svg?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/8Znj8K6GjN)
[![Twitter](https://img.shields.io/badge/Twitter-%231DA1F2.svg?style=for-the-badge&logo=Twitter&logoColor=white)](https://twitter.com/stereumdev)
[![YouTube](https://img.shields.io/badge/YouTube-%23FF0000.svg?style=for-the-badge&logo=YouTube&logoColor=white)](https://www.youtube.com/channel/UCq_LYa0idkQcSnxBUmiJm3Q)
[![Gmail](https://img.shields.io/badge/EMail-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:stereum@stereum.net) [![App Store](https://img.shields.io/badge/App_Store-0D96F6?style=for-the-badge&logo=app-store&logoColor=white)](https://apps.apple.com/nz/app/stereum-node-monitor/id1605910573) [![Play Store](https://img.shields.io/badge/Google_Play-414141?style=for-the-badge&logo=google-play&logoColor=white)](https://play.google.com/store/apps/details?id=cloud.stereum.monitor&hl=en_US&gl=US&pli=1)

[![GitPOAP Badge](https://public-api.gitpoap.io/v1/repo/stereum-dev/ethereum-node/badge)](https://www.gitpoap.io/gh/stereum-dev/ethereum-node)

---

This repository contains the code and scripts for Stereum 2.0

🍄 Stereum manages the process of setting up & maintaining an Ethereum node for you with a focus on self sovereignty, privacy and flexibility.

🍄 Stereum 2.0 aims to be the most flexible way to leverage your Ethereum node for staking, data science, development or your own personal use case. We hope to explore every hermit’s dream with you!

🍄 With Stereum you are able to participate in the Ethereum network and its various protocols (like SSV Network, MEV Boost, ...)!

## Get Started

After installing the launcher start it up and connect to a server of your choice. Take a look at the [guide](https://stereum.net/ethereum-node-setup/) to find out what server operating systems are supported and what you can do with Stereum!

## Contribute

Want to get involved? Create a pull request and we'll have a look at it!

- [Contribution Guidelines](launcher/CONTRIBUTING.md)

Not sure how to help or where to start? Then visit us on [Discord](https://discord.gg/8Znj8K6GjN) or drop us an email to [stereum@stereum.net](mailto:stereum@stereum.net).

### Tech Stack

![Ansible](https://img.shields.io/badge/ansible-%231A1918.svg?style=for-the-badge&logo=ansible&logoColor=white) ![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white) ![Ethereum](https://img.shields.io/badge/Ethereum-3C3C3D?style=for-the-badge&logo=Ethereum&logoColor=white) ![Electron.js](https://img.shields.io/badge/Electron-191970?style=for-the-badge&logo=Electron&logoColor=white) ![Grafana](https://img.shields.io/badge/grafana-%23F46800.svg?style=for-the-badge&logo=grafana&logoColor=white) ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E) ![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white) ![Jinja](https://img.shields.io/badge/jinja-white.svg?style=for-the-badge&logo=jinja&logoColor=black) ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![Prometheus](https://img.shields.io/badge/Prometheus-E6522C?style=for-the-badge&logo=Prometheus&logoColor=white) ![Shell Script](https://img.shields.io/badge/shell_script-%23121011.svg?style=for-the-badge&logo=gnu-bash&logoColor=white) ![Vue.js](https://img.shields.io/badge/vuejs-%2335495e.svg?style=for-the-badge&logo=vuedotjs&logoColor=%234FC08D)

## Branches

### `main`

For development, automated tests running for each commit.

#### Tests

- [![Security: Shellcheck](https://github.com/stereum-dev/ethereum-node/actions/workflows/shellcheck.yml/badge.svg)](https://github.com/stereum-dev/ethereum-node/actions/workflows/shellcheck.yml) Security checking shell scripts
- [![Tests: JEST](https://github.com/stereum-dev/ethereum-node/actions/workflows/test-jest.yml/badge.svg)](https://github.com/stereum-dev/ethereum-node/actions/workflows/test-jest.yml) JEST unit tests
- [![Tests: Molecule](https://github.com/stereum-dev/ethereum-node/actions/workflows/test-molecule.yml/badge.svg)](https://github.com/stereum-dev/ethereum-node/actions/workflows/test-molecule.yml) Backend system tests with Molecule & Ansible
- [![Tests: Integration](https://github.com/stereum-dev/ethereum-node/actions/workflows/test-integration.yml/badge.svg)](https://github.com/stereum-dev/ethereum-node/actions/workflows/test-integration.yml) JEST system integration tests

#### Build

- [![Build: Release](https://github.com/stereum-dev/ethereum-node/actions/workflows/electron.yaml/badge.svg)](https://github.com/stereum-dev/ethereum-node/actions/workflows/electron.yaml) Building Stereum Launcher
